import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Send,
  QrCode,
  ScanLine,
  Layers,
  CheckCircle2,
  Lock,
  Camera,
  Smartphone,
  Zap,
  User,
  Info,
  ChevronRight,
  Sparkles
} from "lucide-react";
import confetti from "canvas-confetti";

export default function Payments({ initialSelectedSpace = null }) {
  const {
    accounts,
    spaces,
    bills,
    payBill,
    addTransaction,
    formatMoney,
    currency,
    biometricsEnabled,
    triggerToast
  } = useApp();

  const [activeTab, setActiveTab] = useState("send"); // send, scan, bills, airtime

  // Payment Form States
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [fundingAccId, setFundingAccId] = useState(accounts[0]?.id || "acc-1");
  const [selectedSpaceId, setSelectedSpaceId] = useState(initialSelectedSpace?.id || "");
  const [note, setNote] = useState("");

  // Simulated Quick Contacts
  const contacts = [
    { id: "c-1", name: "Neema Mwangi", phone: "+255 754 112 301", avatar: "👩🏽" },
    { id: "c-2", name: "Juma Rashid", phone: "+255 784 990 412", avatar: "👨🏾" },
    { id: "c-3", name: "Kibo Cafe Masaki", phone: "+255 655 401 200", avatar: "☕" },
    { id: "c-4", name: "Amani Auto Spares", phone: "+255 713 881 902", avatar: "🚗" }
  ];

  // QR Scanning States
  const [isScanning, setIsScanning] = useState(false);
  const [scannedInvoice, setScannedInvoice] = useState(null);

  // Biometrics & Success Screen
  const [showBiometrics, setShowBiometrics] = useState(false);
  const [biometricStatus, setBiometricStatus] = useState("idle");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastPaymentSummary, setLastPaymentSummary] = useState(null);

  // Airtime States
  const [airtimePhone, setAirtimePhone] = useState("+255 754 ");
  const [airtimeNetwork, setAirtimeNetwork] = useState("Vodacom");
  const [airtimeAmount, setAirtimeAmount] = useState("10000");

  const fundingAcc = accounts.find(a => a.id === fundingAccId);
  const chosenSpace = spaces.find(s => s.id === selectedSpaceId);

  // Initiate Payment with Biometric Gate
  const handleInitiatePayment = (e) => {
    e.preventDefault();
    const amtNum = Number(amount);
    if (!amtNum || amtNum <= 0) {
      triggerToast("Invalid Amount", "Please enter a valid payment amount.", "error");
      return;
    }
    if (!recipient.trim()) {
      triggerToast("Recipient Required", "Please enter a recipient name, phone or account number.", "error");
      return;
    }

    if (!fundingAcc || fundingAcc.balance < amtNum) {
      triggerToast("Insufficient Balance", `Your ${fundingAcc?.name || "wallet"} balance is too low.`, "error");
      return;
    }

    if (biometricsEnabled) {
      setBiometricStatus("scanning");
      setShowBiometrics(true);
      setTimeout(() => {
        setBiometricStatus("verified");
        setTimeout(() => {
          setShowBiometrics(false);
          executePayment();
        }, 1000);
      }, 1500);
    } else {
      executePayment();
    }
  };

  const executePayment = () => {
    const amtNum = Number(amount);
    const spaceObj = spaces.find(s => s.id === selectedSpaceId);

    addTransaction({
      title: `Payment to: ${recipient}`,
      amount: -amtNum,
      type: "send",
      category: spaceObj ? "Food & Dining" : "Transfer",
      bankAccountId: fundingAccId,
      allocatedSpaceId: selectedSpaceId || null,
      spaceName: spaceObj ? spaceObj.name : null,
      merchantLogo: "💸",
      description: note || `Transfer to ${recipient} ${spaceObj ? `funded from ${spaceObj.name} Space` : ""}`
    });

    setLastPaymentSummary({
      recipient,
      amount: amtNum,
      source: fundingAcc?.name,
      space: spaceObj ? spaceObj.name : null,
      remainingSpaceBal: spaceObj ? Math.max(0, spaceObj.balance - amtNum) : null
    });

    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
      colors: ["#00a86b", "#2563eb"]
    });

    setShowSuccessModal(true);
    setAmount("");
    setRecipient("");
    setNote("");
  };

  // QR Scan handler
  const handleStartScan = () => {
    setIsScanning(true);
    setScannedInvoice(null);
    setTimeout(() => {
      setScannedInvoice({
        merchant: "Shoppers Masaki Point of Sale",
        invoiceNo: "INV-99201-TZ",
        amount: 85000,
        item: "Supermarket Groceries"
      });
      setIsScanning(false);
    }, 2200);
  };

  const handlePayScannedInvoice = () => {
    if (!scannedInvoice) return;
    const spaceObj = spaces.find(s => s.id === selectedSpaceId);
    
    addTransaction({
      title: scannedInvoice.merchant,
      amount: -scannedInvoice.amount,
      type: "send",
      category: "Food & Dining",
      bankAccountId: fundingAccId,
      allocatedSpaceId: selectedSpaceId || null,
      spaceName: spaceObj ? spaceObj.name : null,
      merchantLogo: "🛒",
      description: `QR Settlement for ${scannedInvoice.item} (${scannedInvoice.invoiceNo})`
    });

    triggerToast("QR Invoice Paid", `Settled ${formatMoney(scannedInvoice.amount)} successfully.`, "success");
    setScannedInvoice(null);
  };

  // Handle Airtime Submit
  const handleAirtimeSubmit = (e) => {
    e.preventDefault();
    const amtNum = Number(airtimeAmount);
    addTransaction({
      title: `${airtimeNetwork} Airtime Topup`,
      amount: -amtNum,
      type: "bill",
      category: "Utilities",
      bankAccountId: fundingAccId,
      allocatedSpaceId: null,
      merchantLogo: "📱",
      description: `Instant airtime recharge for ${airtimePhone}`
    });
    triggerToast("Airtime Loaded", `Recharged ${formatMoney(amtNum)} to ${airtimePhone}.`, "success");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      
      {/* Header */}
      <div>
        <h1 style={{ fontSize: "1.5rem", fontWeight: "800", color: "var(--text-primary)" }}>
          Payments & Transfers
        </h1>
        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
          Send funds, scan QR codes, or pay directly from your designated Zavo Spaces.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "0.5rem", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "0.5rem", overflowX: "auto" }}>
        <button
          onClick={() => setActiveTab("send")}
          className={`btn ${activeTab === "send" ? "btn-primary" : "btn-ghost"}`}
          style={{ fontSize: "0.825rem", padding: "0.5rem 1rem" }}
        >
          <Send size={15} /> Send / Transfer
        </button>
        <button
          onClick={() => setActiveTab("scan")}
          className={`btn ${activeTab === "scan" ? "btn-primary" : "btn-ghost"}`}
          style={{ fontSize: "0.825rem", padding: "0.5rem 1rem" }}
        >
          <ScanLine size={15} /> Scan & Pay QR
        </button>
        <button
          onClick={() => setActiveTab("bills")}
          className={`btn ${activeTab === "bills" ? "btn-primary" : "btn-ghost"}`}
          style={{ fontSize: "0.825rem", padding: "0.5rem 1rem" }}
        >
          <Zap size={15} /> Pay Utility Bills ({bills.length})
        </button>
        <button
          onClick={() => setActiveTab("airtime")}
          className={`btn ${activeTab === "airtime" ? "btn-primary" : "btn-ghost"}`}
          style={{ fontSize: "0.825rem", padding: "0.5rem 1rem" }}
        >
          <Smartphone size={15} /> Airtime & Data
        </button>
      </div>

      {/* 1. SEND MONEY TAB */}
      {activeTab === "send" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
          
          {/* Main Payment Form */}
          <div className="zavo-card">
            <h2 style={{ fontSize: "1.15rem", fontWeight: "700", color: "var(--text-primary)", marginBottom: "0.25rem" }}>
              Send Money
            </h2>
            <p style={{ fontSize: "0.775rem", color: "var(--text-muted)", marginBottom: "1.25rem" }}>
              Direct transfer to mobile money, bank accounts, or contacts
            </p>

            <form onSubmit={handleInitiatePayment}>
              {/* Recipient */}
              <div className="form-group">
                <label>Recipient / Phone / Account</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. +255 754 ••• ••• or Neema Mwangi"
                  className="input-control"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                />
              </div>

              {/* Amount */}
              <div className="form-group">
                <label>Amount ({currency})</label>
                <input
                  type="number"
                  required
                  min="100"
                  step="100"
                  placeholder="e.g. 50000"
                  className="input-control"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              {/* Funding Wallet */}
              <div className="form-group">
                <label>Funding Account / Wallet</label>
                <select
                  className="input-control"
                  value={fundingAccId}
                  onChange={(e) => setFundingAccId(e.target.value)}
                >
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name} — Balance: {formatMoney(acc.balance)}
                    </option>
                  ))}
                </select>
              </div>

              {/* KEY DIFFERENTIATOR: Payment Source Space */}
              <div className="form-group">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                    <Layers size={14} color="var(--zavo-green)" />
                    <span>Pay from Zavo Space (Optional)</span>
                  </label>
                  <span className="badge badge-green" style={{ fontSize: "0.65rem" }}>Smart Expense</span>
                </div>
                <select
                  className="input-control"
                  value={selectedSpaceId}
                  onChange={(e) => setSelectedSpaceId(e.target.value)}
                >
                  <option value="">None (General Spending)</option>
                  {spaces.map((sp) => (
                    <option key={sp.id} value={sp.id}>
                      {sp.icon} {sp.name} — Available: {formatMoney(sp.balance)}
                    </option>
                  ))}
                </select>
                {chosenSpace && (
                  <p style={{ fontSize: "0.725rem", color: "var(--zavo-green)", marginTop: "0.25rem" }}>
                    ✓ This payment will automatically deduct from your "{chosenSpace.name}" budget space.
                  </p>
                )}
              </div>

              {/* Note */}
              <div className="form-group">
                <label>Note / Purpose (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Lunch, Supplies, Lease"
                  className="input-control"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: "100%", marginTop: "1rem", padding: "0.75rem" }}
                id="btn-confirm-send"
              >
                <Lock size={15} /> Authorize & Send Payment
              </button>
            </form>
          </div>

          {/* Quick Contacts & Summary Card */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            
            {/* Quick Contacts */}
            <div className="zavo-card">
              <h3 style={{ fontSize: "0.95rem", fontWeight: "700", color: "var(--text-primary)", marginBottom: "0.75rem" }}>
                Quick Contacts
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {contacts.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => setRecipient(c.name)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0.6rem 0.75rem",
                      borderRadius: "var(--radius-md)",
                      backgroundColor: recipient === c.name ? "var(--zavo-green-light)" : "var(--bg-surface)",
                      border: recipient === c.name ? "1px solid var(--zavo-green-border)" : "1px solid transparent",
                      cursor: "pointer",
                      transition: "all 0.15s ease"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                      <span style={{ fontSize: "1.25rem" }}>{c.avatar}</span>
                      <div>
                        <div style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-primary)" }}>
                          {c.name}
                        </div>
                        <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                          {c.phone}
                        </span>
                      </div>
                    </div>
                    <ChevronRight size={14} color="var(--text-muted)" />
                  </div>
                ))}
              </div>
            </div>

            {/* Smart Safety Info */}
            <div className="zavo-card-subtle" style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start" }}>
              <Info size={16} color="var(--zavo-green)" style={{ flexShrink: 0, marginTop: "0.1rem" }} />
              <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", lineHeight: 1.4, margin: 0 }}>
                Zavo verifies recipient details across M-Pesa, Airtel Money, and banks before routing. Real-time balance updates across both the funding wallet and selected Space.
              </p>
            </div>

          </div>
        </div>
      )}

      {/* 2. SCAN & PAY QR TAB */}
      {activeTab === "scan" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
          <div className="zavo-card" style={{ textAlign: "center", padding: "2rem" }}>
            <h3 style={{ fontSize: "1.15rem", fontWeight: "700", color: "var(--text-primary)", marginBottom: "0.35rem" }}>
              Camera QR Scanner
            </h3>
            <p style={{ fontSize: "0.775rem", color: "var(--text-muted)", marginBottom: "1.5rem" }}>
              Scan Tanzanian EMV / LIPA QR codes at retail checkouts
            </p>

            {/* Viewfinder simulation */}
            <div
              style={{
                width: "220px",
                height: "220px",
                margin: "0 auto 1.5rem auto",
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
              <Camera size={44} color={isScanning ? "var(--zavo-green)" : "var(--text-muted)"} />
              <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: "600" }}>
                {isScanning ? "Scanning Point of Sale..." : "Optical Sensor Ready"}
              </span>
            </div>

            <button
              onClick={handleStartScan}
              disabled={isScanning}
              className="btn btn-primary"
              style={{ width: "100%", maxWidth: "260px" }}
            >
              {isScanning ? "Scanning..." : "Simulate Merchant Scan"}
            </button>
          </div>

          {/* Detected Scanned Invoice Details */}
          <div className="zavo-card">
            <h3 style={{ fontSize: "1.15rem", fontWeight: "700", color: "var(--text-primary)", marginBottom: "0.5rem" }}>
              Detected Merchant Payload
            </h3>
            
            {scannedInvoice ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
                <div style={{ padding: "1rem", backgroundColor: "var(--zavo-green-light)", borderRadius: "var(--radius-lg)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Merchant</span>
                    <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--text-primary)" }}>{scannedInvoice.merchant}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Invoice No</span>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{scannedInvoice.invoiceNo}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--zavo-green-border)", paddingTop: "0.5rem", marginTop: "0.5rem" }}>
                    <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--text-primary)" }}>Amount Due</span>
                    <span style={{ fontSize: "1.25rem", fontWeight: "800", color: "var(--zavo-green)" }}>
                      {formatMoney(scannedInvoice.amount)}
                    </span>
                  </div>
                </div>

                <div className="form-group">
                  <label>Pay from Zavo Space</label>
                  <select
                    className="input-control"
                    value={selectedSpaceId}
                    onChange={(e) => setSelectedSpaceId(e.target.value)}
                  >
                    <option value="">None (Primary Wallet)</option>
                    {spaces.map((sp) => (
                      <option key={sp.id} value={sp.id}>{sp.icon} {sp.name} ({formatMoney(sp.balance)})</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handlePayScannedInvoice}
                  className="btn btn-primary"
                  style={{ width: "100%", padding: "0.75rem" }}
                >
                  <Lock size={15} /> Authorize & Pay Merchant
                </button>
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--text-muted)" }}>
                <QrCode size={36} style={{ marginBottom: "0.5rem", opacity: 0.5 }} />
                <p style={{ fontSize: "0.825rem" }}>
                  Click "Simulate Merchant Scan" to emulate scanning a supermarket or fuel station QR code.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. UTILITY BILLS TAB */}
      {activeTab === "bills" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
          {bills.length === 0 ? (
            <div className="zavo-card" style={{ gridColumn: "1 / -1", textAlign: "center", padding: "3rem" }}>
              <CheckCircle2 size={40} color="var(--zavo-green)" style={{ marginBottom: "0.5rem" }} />
              <h3 style={{ fontSize: "1.1rem", fontWeight: "700" }}>All Bills Settled</h3>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>You have no pending utility obligations for this period.</p>
            </div>
          ) : (
            bills.map((bill) => (
              <div key={bill.id} className="zavo-card" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{ width: "42px", height: "42px", borderRadius: "var(--radius-md)", backgroundColor: "var(--bg-surface)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem" }}>
                    {bill.merchantLogo}
                  </div>
                  <div>
                    <h3 style={{ fontSize: "0.95rem", fontWeight: "700", color: "var(--text-primary)" }}>{bill.title}</h3>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Due: {bill.dueDate} • {bill.category}</span>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-subtle)", paddingTop: "0.75rem" }}>
                  <span style={{ fontSize: "1.2rem", fontWeight: "800", color: "var(--text-primary)" }}>
                    {formatMoney(bill.amount)}
                  </span>
                  <button
                    onClick={() => payBill(bill.id)}
                    className="btn btn-primary"
                    style={{ padding: "0.45rem 1rem", fontSize: "0.8rem" }}
                  >
                    Pay Bill
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 4. AIRTIME & DATA TAB */}
      {activeTab === "airtime" && (
        <div className="zavo-card" style={{ maxWidth: "540px" }}>
          <h3 style={{ fontSize: "1.15rem", fontWeight: "700", color: "var(--text-primary)", marginBottom: "0.25rem" }}>
            Instant Airtime & Bundles
          </h3>
          <p style={{ fontSize: "0.775rem", color: "var(--text-muted)", marginBottom: "1.25rem" }}>
            Recharge prepaid airtime across Vodacom, Airtel, Tigo, and Halotel
          </p>

          <form onSubmit={handleAirtimeSubmit}>
            <div className="form-group">
              <label>Mobile Network</label>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {["Vodacom", "Airtel", "Tigo", "Halotel"].map((net) => (
                  <button
                    key={net}
                    type="button"
                    onClick={() => setAirtimeNetwork(net)}
                    className={`btn ${airtimeNetwork === net ? "btn-primary" : "btn-secondary"}`}
                    style={{ flex: 1, padding: "0.45rem", fontSize: "0.775rem" }}
                  >
                    {net}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Recipient Mobile Number</label>
              <input
                type="tel"
                required
                className="input-control"
                value={airtimePhone}
                onChange={(e) => setAirtimePhone(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Airtime Amount ({currency})</label>
              <div style={{ display: "flex", gap: "0.4rem", marginBottom: "0.5rem" }}>
                {["2000", "5000", "10000", "25000"].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAirtimeAmount(amt)}
                    className={`btn ${airtimeAmount === amt ? "btn-primary" : "btn-ghost"}`}
                    style={{ flex: 1, padding: "0.35rem", fontSize: "0.75rem", border: "1px solid var(--border-subtle)" }}
                  >
                    {formatMoney(Number(amt))}
                  </button>
                ))}
              </div>
              <input
                type="number"
                required
                className="input-control"
                value={airtimeAmount}
                onChange={(e) => setAirtimeAmount(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "1rem" }}>
              Recharge Airtime Now
            </button>
          </form>
        </div>
      )}

      {/* BIOMETRICS AUTHORIZATION SIMULATOR */}
      {showBiometrics && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: "340px", textAlign: "center" }}>
            <div style={{ padding: "1.5rem 0" }}>
              <div
                style={{
                  width: "68px",
                  height: "68px",
                  borderRadius: "50%",
                  backgroundColor: "var(--zavo-green-light)",
                  color: "var(--zavo-green)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1rem auto"
                }}
              >
                <Lock size={32} />
              </div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "var(--text-primary)", marginBottom: "0.25rem" }}>
                {biometricStatus === "scanning" ? "Verifying Face ID..." : "Identity Authenticated"}
              </h3>
              <p style={{ fontSize: "0.775rem", color: "var(--text-secondary)", margin: 0 }}>
                {biometricStatus === "scanning" ? "Simulating secure biometric handshake" : "Signing transaction on Zavo mesh"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* PAYMENT SUCCESS RECEIPT MODAL */}
      {showSuccessModal && lastPaymentSummary && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ textAlign: "center" }}>
            <div
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                backgroundColor: "var(--zavo-green-light)",
                color: "var(--zavo-green)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1rem auto"
              }}
            >
              <CheckCircle2 size={36} />
            </div>

            <h2 style={{ fontSize: "1.35rem", fontWeight: "800", color: "var(--text-primary)", marginBottom: "0.25rem" }}>
              Payment Outbound Cleared
            </h2>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "1.5rem" }}>
              Funds transferred instantly with zero settlement latency.
            </p>

            <div style={{ padding: "1rem", backgroundColor: "var(--bg-surface)", borderRadius: "var(--radius-lg)", textAlign: "left", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Amount</span>
                <span style={{ fontSize: "1.15rem", fontWeight: "800", color: "var(--text-primary)" }}>
                  {formatMoney(lastPaymentSummary.amount)}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Recipient</span>
                <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-primary)" }}>
                  {lastPaymentSummary.recipient}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Funding Source</span>
                <span style={{ fontSize: "0.85rem", color: "var(--text-primary)" }}>{lastPaymentSummary.source}</span>
              </div>
              {lastPaymentSummary.space && (
                <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--border-subtle)", paddingTop: "0.5rem" }}>
                  <span style={{ fontSize: "0.8rem", color: "var(--zavo-green)", fontWeight: "600" }}>Paid from Space</span>
                  <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--zavo-green)" }}>
                    {lastPaymentSummary.space} (New Bal: {formatMoney(lastPaymentSummary.remainingSpaceBal)})
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowSuccessModal(false)}
              className="btn btn-primary"
              style={{ width: "100%", marginTop: "1.5rem" }}
            >
              Done
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
