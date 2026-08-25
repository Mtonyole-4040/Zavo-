import React, { useState, useRef, useEffect } from "react";
import { useApp } from "../context/AppContext";
import ZavoLogo from "./ZavoLogo";
import {
  Bell,
  Eye,
  EyeOff,
  ChevronDown,
  Check,
  X,
  ShieldCheck,
  User,
  Sparkles
} from "lucide-react";

export default function Header() {
  const {
    currentView,
    setCurrentView,
    currency,
    setCurrency,
    currencies,
    anonymousMode,
    setAnonymousMode,
    notifications,
    markNotificationRead,
    clearAllNotifications
  } = useApp();

  const [showCurrencyMenu, setShowCurrencyMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const currencyRef = useRef(null);
  const notifRef = useRef(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (currencyRef.current && !currencyRef.current.contains(e.target)) {
        setShowCurrencyMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header
      style={{
        height: "var(--header-height)",
        backgroundColor: "#ffffff",
        borderBottom: "1px solid var(--border-subtle)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 2rem",
        position: "sticky",
        top: 0,
        zIndex: 40
      }}
    >
      {/* Left Column: Mobile Logo / Greeting */}
      <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
        {/* On small screens, display Zavo logo */}
        <div className="mobile-only-logo" style={{ display: "none" }}>
          <ZavoLogo size={26} />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "1rem", fontWeight: "700", color: "var(--text-primary)" }}>
              Hello, Alex
            </span>
            <span style={{ fontSize: "0.9rem" }}>👋</span>
          </div>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
            Welcome to your financial home
          </span>
        </div>
      </div>

      {/* Right Column: Actions & Profile */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        {/* Privacy Toggle (Hide/Show Balance) */}
        <button
          onClick={() => setAnonymousMode(!anonymousMode)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.35rem",
            padding: "0.45rem 0.75rem",
            borderRadius: "var(--radius-full)",
            border: "1px solid var(--border-subtle)",
            background: anonymousMode ? "var(--bg-surface)" : "#ffffff",
            color: "var(--text-secondary)",
            fontSize: "0.75rem",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.15s ease"
          }}
          title={anonymousMode ? "Show balances" : "Hide sensitive numbers"}
        >
          {anonymousMode ? <EyeOff size={14} color="var(--accent-red)" /> : <Eye size={14} />}
          <span style={{ display: "none" }} className="header-btn-text">
            {anonymousMode ? "Hidden" : "Visible"}
          </span>
        </button>

        {/* Currency Switcher Popover */}
        <div style={{ position: "relative" }} ref={currencyRef}>
          <button
            onClick={() => setShowCurrencyMenu(!showCurrencyMenu)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.45rem 0.75rem",
              borderRadius: "var(--radius-full)",
              border: "1px solid var(--border-subtle)",
              background: "#ffffff",
              color: "var(--text-primary)",
              fontSize: "0.8rem",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            <span>{currencies[currency]?.flag}</span>
            <span>{currency}</span>
            <ChevronDown size={12} color="var(--text-muted)" />
          </button>

          {showCurrencyMenu && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                right: 0,
                width: "200px",
                background: "#ffffff",
                borderRadius: "var(--radius-lg)",
                boxShadow: "var(--shadow-dropdown)",
                border: "1px solid var(--border-subtle)",
                padding: "0.5rem",
                zIndex: 100
              }}
            >
              <div style={{ padding: "0.35rem 0.5rem", fontSize: "0.7rem", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase" }}>
                Select Display Currency
              </div>
              {Object.values(currencies).map((c) => (
                <button
                  key={c.code}
                  onClick={() => {
                    setCurrency(c.code);
                    setShowCurrencyMenu(false);
                  }}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.5rem 0.6rem",
                    borderRadius: "var(--radius-md)",
                    border: "none",
                    background: currency === c.code ? "var(--zavo-green-light)" : "transparent",
                    color: currency === c.code ? "var(--zavo-green)" : "var(--text-primary)",
                    fontSize: "0.8rem",
                    fontWeight: currency === c.code ? "700" : "500",
                    cursor: "pointer",
                    textAlign: "left"
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span>{c.flag}</span>
                    <span>{c.code} ({c.symbol})</span>
                  </span>
                  {currency === c.code && <Check size={14} />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Popover */}
        <div style={{ position: "relative" }} ref={notifRef}>
          <button
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "var(--radius-full)",
              border: "1px solid var(--border-subtle)",
              background: "#ffffff",
              color: "var(--text-secondary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              position: "relative"
            }}
            aria-label="Notifications"
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "2px",
                  right: "2px",
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: "var(--zavo-green)",
                  border: "2px solid #ffffff"
                }}
              />
            )}
          </button>

          {showNotifMenu && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                right: 0,
                width: "320px",
                background: "#ffffff",
                borderRadius: "var(--radius-xl)",
                boxShadow: "var(--shadow-dropdown)",
                border: "1px solid var(--border-subtle)",
                padding: "1rem",
                zIndex: 100
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem", paddingBottom: "0.5rem", borderBottom: "1px solid var(--border-subtle)" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--text-primary)" }}>
                  Activity & Alerts
                </span>
                {notifications.length > 0 && (
                  <button
                    onClick={clearAllNotifications}
                    style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "0.75rem", cursor: "pointer" }}
                  >
                    Clear all
                  </button>
                )}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxHeight: "280px", overflowY: "auto" }}>
                {notifications.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "1.5rem 0", color: "var(--text-muted)", fontSize: "0.8rem" }}>
                    No unread notifications
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      style={{
                        padding: "0.6rem 0.75rem",
                        borderRadius: "var(--radius-md)",
                        backgroundColor: n.read ? "transparent" : "var(--zavo-green-light)",
                        border: "1px solid var(--border-subtle)",
                        cursor: "pointer"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", fontWeight: "700", color: "var(--text-primary)", marginBottom: "0.15rem" }}>
                        <span>{n.title}</span>
                        <span style={{ fontSize: "0.65rem", color: "var(--text-muted)", fontWeight: "normal" }}>{n.time}</span>
                      </div>
                      <p style={{ fontSize: "0.725rem", color: "var(--text-secondary)", margin: 0, lineHeight: 1.3 }}>
                        {n.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar Shortcut */}
        <button
          onClick={() => setCurrentView("Profile")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.3rem 0.6rem 0.3rem 0.3rem",
            borderRadius: "var(--radius-full)",
            border: "1px solid var(--border-subtle)",
            background: "#ffffff",
            cursor: "pointer"
          }}
        >
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              backgroundColor: "var(--zavo-green)",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "700",
              fontSize: "0.75rem"
            }}
          >
            AM
          </div>
          <span style={{ fontSize: "0.8rem", fontWeight: "600", color: "var(--text-primary)" }}>
            Alex
          </span>
        </button>
      </div>
    </header>
  );
}
