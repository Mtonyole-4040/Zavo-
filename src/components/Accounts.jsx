import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Plus,
  Wallet,
  ShieldCheck,
  CheckCircle2,
  Unlink,
  ExternalLink,
  RefreshCw,
  X,
  CreditCard,
  Building2,
  Smartphone,
  ChevronRight,
  TrendingUp
} from "lucide-react";

export default function Accounts() {
  const {
    accounts,
    netWorth,
    connectNewAccount,
    disconnectAccount,
    formatMoney,
    currency,
    anonymousMode,
    triggerToast
  } = useApp();

  const [showConnectModal, setShowConnectModal] = useState(false);
  const [selectedInst, setSelectedInst] = useState("M-Pesa");
  const [selectedType, setSelectedType] = useState("Mobile Money");
  const [simBalance, setSimBalance] = useState("650000");

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshAll = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      triggerToast("Wallets Synchronized", "All 5 connected accounts verified with zero discrepancy.", "success");
    }, 1200);
  };

  const handleConnectSubmit = (e) => {
    e.preventDefault();
    connectNewAccount(selectedInst, selectedType, simBalance);
    setShowConnectModal(false);
  };

  const availableInstitutions = [
    { name: "M-Pesa", type: "Mobile Money", logo: "🔴" },
    { name: "Airtel Money", type: "Mobile Money", logo: "📱" },
    { name: "Tigo Pesa", type: "Mobile Money", logo: "🔵" },
    { name: "NMB Bank", type: "Bank Checking", logo: "🏦" },
    { name: "CRDB Bank", type: "Bank Savings", logo: "🌿" },
    { name: "Stanbic Bank", type: "Bank Checking", logo: "💳" }
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <h1 style={{ fontSize: "1.5rem", fontWeight: "800", color: "var(--text-primary)" }}>
              My Accounts & Wallets
            </h1>
            <span className="badge badge-green">Unified Mesh</span>
          </div>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
            Aggregate and synchronize your mobile money and bank balances in real time.
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button
            onClick={handleRefreshAll}
            className="btn btn-secondary"
            disabled={isRefreshing}
          >
            <RefreshCw size={15} className={isRefreshing ? "spin-anim" : ""} /> Sync All
          </button>
          <button
            onClick={() => setShowConnectModal(true)}
            className="btn btn-primary"
          >
            <Plus size={16} /> Connect Account
          </button>
        </div>
      </div>

      {/* Aggregate Balance Card */}
      <div
        className="zavo-card"
        style={{
          background: "#ffffff",
          padding: "1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem"
        }}
      >
        <div>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase" }}>
            Consolidated Liquid Assets
          </span>
          <div
            style={{ fontSize: "2rem", fontWeight: "800", color: "var(--text-primary)", marginTop: "0.15rem" }}
            className={anonymousMode ? "privacy-blur" : ""}
          >
            {formatMoney(netWorth)}
          </div>
          <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
            Total aggregate balance across {accounts.length} linked sources
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.5rem 0.85rem", backgroundColor: "var(--zavo-green-light)", borderRadius: "var(--radius-lg)" }}>
          <ShieldCheck size={16} color="var(--zavo-green)" />
          <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "var(--zavo-green)" }}>
            Bank-Level OAuth Encryption
          </span>
        </div>
      </div>

      {/* Accounts List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {accounts.map((acc) => (
          <div
            key={acc.id}
            className="zavo-card"
            style={{
              padding: "1.25rem 1.5rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1rem"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "var(--bg-surface)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem"
                }}
              >
                {acc.logo}
              </div>

              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <h3 style={{ fontSize: "1rem", fontWeight: "700", color: "var(--text-primary)" }}>
                    {acc.name}
                  </h3>
                  {acc.isDefault && (
                    <span className="badge badge-green" style={{ fontSize: "0.65rem" }}>Primary Wallet</span>
                  )}
                </div>
                <div style={{ display: "flex", gap: "0.5rem", fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>
                  <span>{acc.type}</span>
                  <span>•</span>
                  <span>{acc.accountNumber}</span>
                  <span>•</span>
                  <span>Synced {acc.lastSynced}</span>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
              <div style={{ textAlign: "right" }}>
                <span
                  style={{ fontSize: "1.25rem", fontWeight: "800", color: "var(--text-primary)", display: "block" }}
                  className={anonymousMode ? "privacy-blur" : ""}
                >
                  {formatMoney(acc.balance)}
                </span>
                <span style={{ fontSize: "0.7rem", color: "var(--zavo-green)", fontWeight: "600" }}>
                  Active & Synced
                </span>
              </div>

              {!acc.isDefault && (
                <button
                  onClick={() => disconnectAccount(acc.id, acc.name)}
                  className="btn btn-ghost"
                  style={{ padding: "0.4rem 0.6rem", color: "var(--accent-red)" }}
                  title="Disconnect Account"
                >
                  <Unlink size={16} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* CONNECT NEW ACCOUNT MODAL */}
      {showConnectModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: "1.15rem", fontWeight: "700", color: "var(--text-primary)" }}>
                  Link New Financial Account
                </h3>
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  Connect mobile money or bank checking (Simulated)
                </p>
              </div>
              <button onClick={() => setShowConnectModal(false)} className="modal-close">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleConnectSubmit}>
              <div className="form-group">
                <label>Select Institution</label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.5rem" }}>
                  {availableInstitutions.map((inst) => (
                    <button
                      key={inst.name}
                      type="button"
                      onClick={() => {
                        setSelectedInst(inst.name);
                        setSelectedType(inst.type);
                      }}
                      style={{
                        padding: "0.75rem",
                        borderRadius: "var(--radius-md)",
                        border: selectedInst === inst.name ? "2px solid var(--zavo-green)" : "1px solid var(--border-subtle)",
                        background: selectedInst === inst.name ? "var(--zavo-green-light)" : "var(--bg-surface)",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        cursor: "pointer",
                        fontSize: "0.85rem",
                        fontWeight: "600",
                        color: "var(--text-primary)"
                      }}
                    >
                      <span>{inst.logo}</span>
                      <span>{inst.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Simulated Starting Balance ({currency})</label>
                <input
                  type="number"
                  required
                  min="10000"
                  className="input-control"
                  value={simBalance}
                  onChange={(e) => setSimBalance(e.target.value)}
                />
              </div>

              <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
                <button
                  type="button"
                  onClick={() => setShowConnectModal(false)}
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
                  Confirm & Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
