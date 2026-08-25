import React, { useState } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import Sidebar from "./components/Sidebar";
import BottomNav from "./components/BottomNav";
import Header from "./components/Header";
import Home from "./components/Home";
import Spaces from "./components/Spaces";
import Goals from "./components/Goals";
import Payments from "./components/Payments";
import Accounts from "./components/Accounts";
import Insights from "./components/Insights";
import Security from "./components/Security";
import Profile from "./components/Profile";
import {
  X,
  Plus,
  CheckCircle2,
  AlertCircle,
  Info,
  Layers,
  ArrowUpRight,
  QrCode,
  Lock,
  Camera
} from "lucide-react";

function MainApp() {
  const {
    currentView,
    setCurrentView,
    toasts,
    removeToast,
    accounts,
    spaces,
    addTransaction,
    formatMoney,
    currency,
    triggerToast
  } = useApp();

  // Quick Add Money Modal State
  const [showQuickAddModal, setShowQuickAddModal] = useState(false);
  const [addAmount, setAddAmount] = useState("");
  const [targetAccountId, setTargetAccountId] = useState("acc-1");
  const [fundingSource, setFundingSource] = useState("M-Pesa Direct");

  // Pay From Space selected state
  const [payFromSpaceObj, setPayFromSpaceObj] = useState(null);

  // Quick Scan QR Modal
  const [showQuickScanModal, setShowQuickScanModal] = useState(false);
  const [isScanningQuick, setIsScanningQuick] = useState(false);
  const [quickScanResult, setQuickScanResult] = useState(null);

  const handleQuickAddSubmit = (e) => {
    e.preventDefault();
    const amtNum = Number(addAmount);
    if (!amtNum || amtNum <= 0) {
      triggerToast("Invalid Amount", "Please enter a valid deposit amount.", "error");
      return;
    }

    addTransaction({
      title: `Deposit via ${fundingSource}`,
      amount: amtNum,
      type: "receive",
      category: "Income",
      bankAccountId: targetAccountId,
      allocatedSpaceId: null,
      merchantLogo: "⚡",
      description: `Added ${formatMoney(amtNum)} to wallet from ${fundingSource}.`
    });

    triggerToast("Funds Deposited", `Successfully added ${formatMoney(amtNum)} to your wallet.`, "success");
    setShowQuickAddModal(false);
    setAddAmount("");
  };

  const handleOpenPayFromSpace = (space) => {
    setPayFromSpaceObj(space);
    setCurrentView("Payments");
  };

  const handleStartQuickScan = () => {
    setIsScanningQuick(true);
    setTimeout(() => {
      setQuickScanResult({
        merchant: "LUKU Prepaid Power",
        amount: 45000,
        token: "2019-8812-4019-3321"
      });
      setIsScanningQuick(false);
    }, 2000);
  };

  const handleSettleQuickScan = () => {
    if (!quickScanResult) return;
    addTransaction({
      title: quickScanResult.merchant,
      amount: -quickScanResult.amount,
      type: "bill",
      category: "Utilities",
      bankAccountId: "acc-1",
      allocatedSpaceId: null,
      merchantLogo: "⚡",
      description: `Settled via Instant QR Scanner`
    });
    triggerToast("QR Bill Settled", `Paid ${formatMoney(quickScanResult.amount)} successfully.`, "success");
    setShowQuickScanModal(false);
    setQuickScanResult(null);
  };

  return (
    <div className="zavo-layout">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main App Container */}
      <div className="zavo-main-container">
        <Header />

        {/* Dynamic View Rendering */}
        <main className="zavo-content">
          {currentView === "Home" && (
            <Home
              onOpenAddMoneyModal={() => setShowQuickAddModal(true)}
              onOpenSendModal={() => setCurrentView("Payments")}
              onOpenScanModal={() => setShowQuickScanModal(true)}
            />
          )}

          {currentView === "Spaces" && (
            <Spaces onOpenPayFromSpace={handleOpenPayFromSpace} />
          )}

          {currentView === "Goals" && (
            <Goals />
          )}

          {currentView === "Payments" && (
            <Payments initialSelectedSpace={payFromSpaceObj} />
          )}

          {currentView === "Accounts" && (
            <Accounts />
          )}

          {currentView === "Insights" && (
            <Insights />
          )}

          {currentView === "Security" && (
            <Security />
          )}

          {currentView === "Profile" && (
            <Profile />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* GLOBAL QUICK ADD MONEY MODAL */}
      {showQuickAddModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: "1.15rem", fontWeight: "700", color: "var(--text-primary)" }}>
                  Add Money
                </h3>
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  Top up your Zavo Wallet from linked mobile money or card
                </p>
              </div>
              <button onClick={() => setShowQuickAddModal(false)} className="modal-close">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleQuickAddSubmit}>
              <div className="form-group">
                <label>Amount to Add ({currency})</label>
                <input
                  type="number"
                  required
                  min="100"
                  placeholder="e.g. 100000"
                  className="input-control"
                  value={addAmount}
                  onChange={(e) => setAddAmount(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label>Destination Account</label>
                <select
                  className="input-control"
                  value={targetAccountId}
                  onChange={(e) => setTargetAccountId(e.target.value)}
                >
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name} — Current: {formatMoney(acc.balance)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Funding Source</label>
                <select
                  className="input-control"
                  value={fundingSource}
                  onChange={(e) => setFundingSource(e.target.value)}
                >
                  <option value="M-Pesa Direct">Vodacom M-Pesa (+255 754 ••• •89)</option>
                  <option value="Airtel Money Express">Airtel Money (+255 784 ••• •12)</option>
                  <option value="NMB Direct Checking">NMB Bank Account (•••• 4011)</option>
                  <option value="Debit Card Visa/MC">Debit Card (Visa •••• 1092)</option>
                </select>
              </div>

              <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
                <button
                  type="button"
                  onClick={() => setShowQuickAddModal(false)}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  Confirm Deposit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QUICK SCAN MODAL */}
      {showQuickScanModal && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ textAlign: "center" }}>
            <div className="modal-header">
              <h3 style={{ fontSize: "1.15rem", fontWeight: "700", color: "var(--text-primary)" }}>
                Quick QR Scanner
              </h3>
              <button onClick={() => { setShowQuickScanModal(false); setQuickScanResult(null); }} className="modal-close">
                <X size={18} />
              </button>
            </div>

            <div
              style={{
                width: "200px",
                height: "200px",
                margin: "1rem auto",
                borderRadius: "var(--radius-xl)",
                border: "2px dashed var(--zavo-green)",
                backgroundColor: "var(--bg-surface)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem"
              }}
            >
              <Camera size={40} color={isScanningQuick ? "var(--zavo-green)" : "var(--text-muted)"} />
              <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: "600" }}>
                {isScanningQuick ? "Scanning Point of Sale..." : "Ready to Scan"}
              </span>
            </div>

            {quickScanResult ? (
              <div style={{ padding: "1rem", backgroundColor: "var(--zavo-green-light)", borderRadius: "var(--radius-lg)", marginBottom: "1rem", textAlign: "left" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Merchant</span>
                  <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--text-primary)" }}>{quickScanResult.merchant}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.25rem" }}>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Amount Due</span>
                  <span style={{ fontSize: "1.1rem", fontWeight: "800", color: "var(--zavo-green)" }}>{formatMoney(quickScanResult.amount)}</span>
                </div>
                <button
                  onClick={handleSettleQuickScan}
                  className="btn btn-primary"
                  style={{ width: "100%", marginTop: "1rem" }}
                >
                  <Lock size={14} /> Authorize Payment
                </button>
              </div>
            ) : (
              <button
                onClick={handleStartQuickScan}
                disabled={isScanningQuick}
                className="btn btn-primary"
                style={{ width: "100%" }}
              >
                {isScanningQuick ? "Scanning..." : "Scan Demo QR Code"}
              </button>
            )}
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION CONTAINER */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "0.875rem", fontWeight: "700", color: "var(--text-primary)", marginBottom: "0.15rem" }}>
                {toast.title}
              </div>
              <div style={{ fontSize: "0.775rem", color: "var(--text-secondary)", lineHeight: 1.35 }}>
                {toast.message}
              </div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "0.1rem" }}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
