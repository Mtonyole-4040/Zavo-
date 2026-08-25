import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Plus,
  ArrowUpRight,
  QrCode,
  Layers,
  Wallet,
  Eye,
  EyeOff,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Target,
  Sparkles,
  ArrowDownLeft
} from "lucide-react";

export default function Home({ onOpenAddMoneyModal, onOpenSendModal, onOpenScanModal }) {
  const {
    netWorth,
    accounts,
    spaces,
    goals,
    transactions,
    formatMoney,
    currency,
    anonymousMode,
    setAnonymousMode,
    setCurrentView,
    triggerToast
  } = useApp();

  const primaryGoal = goals[0] || {
    name: "Buy M3 MacBook Pro",
    currentAmount: 2400000,
    targetAmount: 3500000,
    estimatedCompletion: "4 weeks remaining"
  };

  const goalPercent = Math.min(100, Math.round((primaryGoal.currentAmount / primaryGoal.targetAmount) * 100));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      
      {/* Demo notice banner */}
      <div className="demo-banner">
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <ShieldCheck size={14} color="var(--zavo-green)" />
          <span><strong>Simulated Prototype</strong> — No real funds are moved. Experience Zavo multi-wallet aggregation.</span>
        </div>
        <span className="badge badge-green" style={{ fontSize: "0.65rem" }}>Beta Preview</span>
      </div>

      {/* 1. HERO FINANCIAL CARD: TOTAL BALANCE & QUICK ACTIONS */}
      <div className="zavo-card" style={{ background: "#ffffff", padding: "2rem 1.75rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
          <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-secondary)" }}>
            Total Balance
          </span>
          <button
            onClick={() => setAnonymousMode(!anonymousMode)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-muted)",
              display: "flex",
              alignItems: "center",
              gap: "0.3rem",
              fontSize: "0.75rem"
            }}
          >
            {anonymousMode ? <EyeOff size={15} /> : <Eye size={15} />}
            <span>{anonymousMode ? "Show" : "Hide"}</span>
          </button>
        </div>

        {/* Large Balance Display */}
        <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem", marginBottom: "0.35rem" }}>
          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: "800",
              color: "var(--text-primary)",
              letterSpacing: "-0.03em",
              lineHeight: 1.1
            }}
            className={anonymousMode ? "privacy-blur" : ""}
          >
            {formatMoney(netWorth)}
          </h1>
        </div>

        <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "1.75rem" }}>
          Across {accounts.length} connected accounts & mobile wallets
        </p>

        {/* 4 Quick Actions */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1rem",
            paddingTop: "1.25rem",
            borderTop: "1px solid var(--border-subtle)"
          }}
        >
          <button
            onClick={() => onOpenAddMoneyModal()}
            className="quick-action-item"
            id="btn-quick-add"
          >
            <div className="quick-action-circle">
              <Plus size={22} />
            </div>
            <span className="quick-action-label">Add Money</span>
          </button>

          <button
            onClick={() => setCurrentView("Payments")}
            className="quick-action-item"
            id="btn-quick-send"
          >
            <div className="quick-action-circle">
              <ArrowUpRight size={22} />
            </div>
            <span className="quick-action-label">Send</span>
          </button>

          <button
            onClick={() => onOpenScanModal()}
            className="quick-action-item"
            id="btn-quick-scan"
          >
            <div className="quick-action-circle">
              <QrCode size={20} />
            </div>
            <span className="quick-action-label">Scan QR</span>
          </button>

          <button
            onClick={() => setCurrentView("Spaces")}
            className="quick-action-item"
            id="btn-quick-spaces"
          >
            <div className="quick-action-circle" style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-secondary)" }}>
              <Layers size={20} />
            </div>
            <span className="quick-action-label">Spaces</span>
          </button>
        </div>
      </div>

      {/* 2. ZAVO SPACES (SIGNATURE FEATURE PREVIEW) */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <div>
            <h2 style={{ fontSize: "1.15rem", fontWeight: "700", color: "var(--text-primary)" }}>
              My Spaces
            </h2>
            <p style={{ fontSize: "0.775rem", color: "var(--text-muted)" }}>
              Money organized for specific purposes
            </p>
          </div>
          <button
            onClick={() => setCurrentView("Spaces")}
            style={{
              background: "none",
              border: "none",
              color: "var(--zavo-green)",
              fontSize: "0.825rem",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
              cursor: "pointer"
            }}
          >
            <span>View all ({spaces.length})</span>
            <ChevronRight size={14} />
          </button>
        </div>

        {/* Spaces Grid (3-4 cards) */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
          {spaces.slice(0, 4).map((space) => {
            const pct = space.target > 0 ? Math.min(100, Math.round((space.balance / space.target) * 100)) : 0;
            return (
              <div
                key={space.id}
                onClick={() => setCurrentView("Spaces")}
                className="zavo-card zavo-card-hover"
                style={{ padding: "1.25rem" }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                  <div
                    style={{
                      width: "38px",
                      height: "38px",
                      borderRadius: "var(--radius-md)",
                      backgroundColor: "var(--bg-surface)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.25rem"
                    }}
                  >
                    {space.icon}
                  </div>
                  <span className="badge badge-gray">{pct}%</span>
                </div>

                <h3 style={{ fontSize: "0.95rem", fontWeight: "700", color: "var(--text-primary)", marginBottom: "0.15rem" }}>
                  {space.name}
                </h3>
                <p style={{ fontSize: "0.725rem", color: "var(--text-muted)", marginBottom: "0.75rem", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                  {space.purpose}
                </p>

                <div style={{ display: "flex", alignItems: "baseline", gap: "0.35rem", marginBottom: "0.6rem" }}>
                  <span
                    style={{ fontSize: "1.1rem", fontWeight: "800", color: "var(--text-primary)" }}
                    className={anonymousMode ? "privacy-blur" : ""}
                  >
                    {formatMoney(space.balance)}
                  </span>
                  <span style={{ fontSize: "0.725rem", color: "var(--text-muted)" }}>
                    / {formatMoney(space.target)}
                  </span>
                </div>

                {/* Progress Bar */}
                <div
                  style={{
                    width: "100%",
                    height: "6px",
                    borderRadius: "var(--radius-full)",
                    backgroundColor: "var(--bg-surface)",
                    overflow: "hidden"
                  }}
                >
                  <div
                    style={{
                      width: `${pct}%`,
                      height: "100%",
                      borderRadius: "var(--radius-full)",
                      backgroundColor: space.color || "var(--zavo-green)",
                      transition: "width 0.4s ease"
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. MY ACCOUNTS & WALLETS (MULTI-WALLET AGGREGATION PREVIEW) */}
      <div className="zavo-card" style={{ padding: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
          <div>
            <h2 style={{ fontSize: "1.15rem", fontWeight: "700", color: "var(--text-primary)" }}>
              Connected Accounts & Wallets
            </h2>
            <p style={{ fontSize: "0.775rem", color: "var(--text-muted)" }}>
              All your balances synced in one single place
            </p>
          </div>
          <button
            onClick={() => setCurrentView("Accounts")}
            className="btn btn-secondary"
            style={{ padding: "0.4rem 0.85rem", fontSize: "0.775rem" }}
          >
            <Plus size={14} /> Connect Account
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          {accounts.map((acc) => (
            <div
              key={acc.id}
              onClick={() => setCurrentView("Accounts")}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.85rem 1rem",
                borderRadius: "var(--radius-lg)",
                backgroundColor: "var(--bg-card-subtle)",
                border: "1px solid var(--border-subtle)",
                cursor: "pointer",
                transition: "background-color 0.15s ease"
              }}
              className="account-row-hover"
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "var(--radius-md)",
                    backgroundColor: "#ffffff",
                    border: "1px solid var(--border-subtle)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.1rem"
                  }}
                >
                  {acc.logo}
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <span style={{ fontSize: "0.875rem", fontWeight: "700", color: "var(--text-primary)" }}>
                      {acc.name}
                    </span>
                    {acc.isDefault && <span className="badge badge-green" style={{ fontSize: "0.65rem", padding: "0.1rem 0.4rem" }}>Primary</span>}
                  </div>
                  <span style={{ fontSize: "0.725rem", color: "var(--text-muted)" }}>
                    {acc.type} • {acc.accountNumber}
                  </span>
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <span
                  style={{ fontSize: "0.95rem", fontWeight: "700", color: "var(--text-primary)", display: "block" }}
                  className={anonymousMode ? "privacy-blur" : ""}
                >
                  {formatMoney(acc.balance)}
                </span>
                <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                  Synced {acc.lastSynced}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. ACTIVE FINANCIAL GOAL SPOTLIGHT & QUICK FUNDING */}
      <div className="zavo-card" style={{ padding: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <div>
            <h2 style={{ fontSize: "1.15rem", fontWeight: "700", color: "var(--text-primary)" }}>
              Active Goal Target
            </h2>
            <p style={{ fontSize: "0.775rem", color: "var(--text-muted)" }}>
              Track milestones and deposit contributions
            </p>
          </div>
          <button
            onClick={() => setCurrentView("Goals")}
            style={{
              background: "none",
              border: "none",
              color: "var(--zavo-green)",
              fontSize: "0.825rem",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
              cursor: "pointer"
            }}
          >
            <span>All Goals ({goals.length})</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div
          style={{
            background: "linear-gradient(135deg, #ffffff 0%, var(--zavo-green-light) 100%)",
            border: "1px solid var(--zavo-green-border)",
            borderRadius: "var(--radius-lg)",
            padding: "1.25rem"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.35rem",
                  boxShadow: "var(--shadow-sm)"
                }}
              >
                {primaryGoal.icon || "💻"}
              </div>
              <div>
                <span className="badge badge-green" style={{ fontSize: "0.65rem", marginBottom: "0.15rem" }}>
                  {primaryGoal.category || "Hardware"}
                </span>
                <h3 style={{ fontSize: "1.05rem", fontWeight: "700", color: "var(--text-primary)" }}>
                  {primaryGoal.name}
                </h3>
              </div>
            </div>
            <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--zavo-green)" }}>
              {goalPercent}%
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "baseline", gap: "0.4rem", margin: "0.75rem 0 0.5rem 0" }}>
            <span
              style={{ fontSize: "1.3rem", fontWeight: "800", color: "var(--text-primary)" }}
              className={anonymousMode ? "privacy-blur" : ""}
            >
              {formatMoney(primaryGoal.currentAmount)}
            </span>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              saved of {formatMoney(primaryGoal.targetAmount)} target
            </span>
          </div>

          {/* Progress Bar */}
          <div
            style={{
              width: "100%",
              height: "8px",
              borderRadius: "var(--radius-full)",
              backgroundColor: "rgba(0, 168, 107, 0.15)",
              overflow: "hidden",
              marginBottom: "0.75rem"
            }}
          >
            <div
              style={{
                width: `${goalPercent}%`,
                height: "100%",
                borderRadius: "var(--radius-full)",
                backgroundColor: "var(--zavo-green)",
                transition: "width 0.4s ease"
              }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.5rem" }}>
            <span style={{ fontSize: "0.725rem", color: "var(--text-secondary)" }}>
              Estimated completion: <strong>{primaryGoal.estimatedCompletion}</strong>
            </span>
            <button
              onClick={() => setCurrentView("Goals")}
              className="btn btn-primary"
              style={{ padding: "0.4rem 0.85rem", fontSize: "0.775rem" }}
            >
              <Plus size={13} /> Fund Goal Now
            </button>
          </div>
        </div>
      </div>

      {/* 5. RECENT ACTIVITY LEDGER */}
      <div className="zavo-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
          <div>
            <h2 style={{ fontSize: "1.15rem", fontWeight: "700", color: "var(--text-primary)" }}>
              Recent Activity
            </h2>
            <p style={{ fontSize: "0.775rem", color: "var(--text-muted)" }}>
              Latest transactions across all connected sources
            </p>
          </div>
          <button
            onClick={() => setCurrentView("Insights")}
            style={{
              background: "none",
              border: "none",
              color: "var(--zavo-green)",
              fontSize: "0.825rem",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
              cursor: "pointer"
            }}
          >
            <span>See Reports</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {transactions.slice(0, 5).map((tx) => {
            const isIncome = tx.amount > 0 || tx.type === "receive";
            const absAmt = Math.abs(tx.amount);
            return (
              <div
                key={tx.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.75rem 0.5rem",
                  borderBottom: "1px solid var(--border-subtle)"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "var(--radius-full)",
                      backgroundColor: isIncome ? "var(--zavo-green-light)" : "var(--bg-surface)",
                      color: isIncome ? "var(--zavo-green)" : "var(--text-secondary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1rem"
                    }}
                  >
                    {tx.merchantLogo || (isIncome ? "↓" : "↑")}
                  </div>

                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <span style={{ fontSize: "0.875rem", fontWeight: "600", color: "var(--text-primary)" }}>
                        {tx.title}
                      </span>
                      {tx.spaceName && (
                        <span className="badge badge-green" style={{ fontSize: "0.65rem", padding: "0.1rem 0.4rem" }}>
                          {tx.spaceName}
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: "0.725rem", color: "var(--text-muted)" }}>
                      {tx.date} • {tx.category}
                    </span>
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <span
                    style={{
                      fontSize: "0.925rem",
                      fontWeight: "700",
                      color: isIncome ? "var(--zavo-green)" : "var(--text-primary)"
                    }}
                    className={anonymousMode ? "privacy-blur" : ""}
                  >
                    {isIncome ? "+" : "-"}{formatMoney(absAmt)}
                  </span>
                  <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", display: "block" }}>
                    Completed
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
