import React from "react";
import { useApp } from "../context/AppContext";
import ZavoLogo from "./ZavoLogo";
import {
  Home,
  Boxes,
  Target,
  ArrowUpRight,
  Wallet,
  PieChart,
  ShieldCheck,
  User,
  Sparkles,
  Info
} from "lucide-react";

export default function Sidebar() {
  const { currentView, setCurrentView, spaces, accounts, goals } = useApp();

  const navItems = [
    { id: "Home", label: "Home", icon: Home },
    { id: "Spaces", label: "Zavo Spaces", icon: Boxes, badge: spaces.length },
    { id: "Goals", label: "Financial Goals", icon: Target, badge: goals.length },
    { id: "Payments", label: "Payments", icon: ArrowUpRight },
    { id: "Accounts", label: "My Accounts", icon: Wallet, badge: accounts.length },
    { id: "Insights", label: "Insights & Reports", icon: PieChart },
    { id: "Security", label: "Security & Privacy", icon: ShieldCheck },
    { id: "Profile", label: "Profile", icon: User }
  ];

  return (
    <aside className="zavo-sidebar">
      {/* Brand Header */}
      <div style={{ marginBottom: "2rem", paddingLeft: "0.5rem" }}>
        <ZavoLogo size={30} />
        <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.35rem", fontWeight: "500" }}>
          One Place. Every Wallet.
        </p>
      </div>

      {/* Navigation List */}
      <nav style={{ display: "flex", flexDirection: "column", gap: "0.35rem", flex: 1 }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.7rem 0.85rem",
                borderRadius: "var(--radius-md)",
                border: "none",
                background: isActive ? "var(--zavo-green-light)" : "transparent",
                color: isActive ? "var(--zavo-green)" : "var(--text-secondary)",
                fontWeight: isActive ? "700" : "500",
                fontSize: "0.875rem",
                cursor: "pointer",
                transition: "all 0.15s ease",
                textAlign: "left"
              }}
              className="zavo-nav-btn"
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <Icon size={18} color={isActive ? "var(--zavo-green)" : "var(--text-muted)"} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: "700",
                    padding: "0.15rem 0.45rem",
                    borderRadius: "var(--radius-full)",
                    background: isActive ? "var(--zavo-green)" : "var(--bg-surface)",
                    color: isActive ? "#ffffff" : "var(--text-muted)"
                  }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Reassuring Security / Prototype footer card */}
      <div
        style={{
          padding: "0.85rem",
          borderRadius: "var(--radius-md)",
          background: "var(--bg-surface)",
          border: "1px solid var(--border-subtle)",
          marginTop: "auto"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.25rem" }}>
          <ShieldCheck size={14} color="var(--zavo-green)" />
          <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "var(--text-primary)" }}>
            Bank-Grade Safety
          </span>
        </div>
        <p style={{ fontSize: "0.7rem", color: "var(--text-secondary)", lineHeight: 1.35, margin: 0 }}>
          Your money, your privacy. Simulated prototype.
        </p>
      </div>
    </aside>
  );
}
