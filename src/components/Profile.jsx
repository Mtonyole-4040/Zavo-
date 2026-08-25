import React from "react";
import { useApp } from "../context/AppContext";
import {
  User,
  Mail,
  MapPin,
  Calendar,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Download,
  CreditCard,
  HelpCircle,
  LogOut
} from "lucide-react";

export default function Profile() {
  const { netWorth, accounts, spaces, formatMoney, triggerToast } = useApp();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem", maxWidth: "800px" }}>
      
      {/* Header */}
      <div>
        <h1 style={{ fontSize: "1.5rem", fontWeight: "800", color: "var(--text-primary)" }}>
          Profile & Account
        </h1>
        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
          Manage your personal identity, subscription tier, and export data.
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="zavo-card" style={{ display: "flex", alignItems: "center", gap: "1.5rem", padding: "1.75rem" }}>
        <div
          style={{
            width: "68px",
            height: "68px",
            borderRadius: "50%",
            backgroundColor: "var(--zavo-green)",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.5rem",
            fontWeight: "800",
            flexShrink: 0
          }}
        >
          AM
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: "800", color: "var(--text-primary)" }}>
              Alex Mercer
            </h2>
            <span className="badge badge-green">Verified</span>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", fontSize: "0.775rem", color: "var(--text-muted)" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <Mail size={13} /> alex@mercer.co
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <MapPin size={13} /> Dar es Salaam, Tanzania
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <Calendar size={13} /> Joined August 2026
            </span>
          </div>
        </div>
      </div>

      {/* Plan Card */}
      <div className="zavo-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Sparkles size={18} color="var(--zavo-green)" />
            <h3 style={{ fontSize: "1.05rem", fontWeight: "700", color: "var(--text-primary)" }}>
              Zavo Free Beta Tier
            </h3>
          </div>
          <span className="badge badge-green">Current Plan</span>
        </div>

        <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "1rem", lineHeight: 1.4 }}>
          Full access to multi-wallet aggregation, unlimited Zavo Spaces, direct Space payments, and automated financial insights.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.5rem", backgroundColor: "var(--bg-surface)", padding: "1rem", borderRadius: "var(--radius-lg)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.75rem", color: "var(--text-primary)" }}>
            <CheckCircle2 size={14} color="var(--zavo-green)" /> Unlimited Connected Wallets
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.75rem", color: "var(--text-primary)" }}>
            <CheckCircle2 size={14} color="var(--zavo-green)" /> Direct Pay from Zavo Spaces
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.75rem", color: "var(--text-primary)" }}>
            <CheckCircle2 size={14} color="var(--zavo-green)" /> Multi-Currency Converter
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.75rem", color: "var(--text-primary)" }}>
            <CheckCircle2 size={14} color="var(--zavo-green)" /> PDF Audit Statement Exports
          </div>
        </div>
      </div>

      {/* Account Settings & Quick Links */}
      <div className="zavo-card" style={{ padding: "1rem 1.25rem" }}>
        <h3 style={{ fontSize: "0.95rem", fontWeight: "700", color: "var(--text-primary)", marginBottom: "0.75rem" }}>
          Preferences & Support
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <button
            onClick={() => triggerToast("Customer Concierge", "Zavo Support chat initialized.", "info")}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0.75rem 0.5rem",
              background: "none",
              border: "none",
              borderBottom: "1px solid var(--border-subtle)",
              cursor: "pointer",
              textAlign: "left"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <HelpCircle size={16} color="var(--text-muted)" />
              <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-primary)" }}>Help Center & Concierge</span>
            </div>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>24/7 Priority</span>
          </button>

          <button
            onClick={() => triggerToast("Demo Reset", "Simulated demo state reset to baseline.", "success")}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0.75rem 0.5rem",
              background: "none",
              border: "none",
              cursor: "pointer",
              textAlign: "left"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <LogOut size={16} color="var(--accent-red)" />
              <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--accent-red)" }}>Reset Prototype Demo State</span>
            </div>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Re-initialize data</span>
          </button>
        </div>
      </div>

    </div>
  );
}
