import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  ShieldCheck,
  Lock,
  Smartphone,
  Laptop,
  CheckCircle2,
  AlertTriangle,
  Key,
  Eye,
  EyeOff,
  Bell,
  RefreshCw
} from "lucide-react";

export default function Security() {
  const {
    biometricsEnabled,
    setBiometricsEnabled,
    trustedDevices,
    anonymousMode,
    setAnonymousMode,
    triggerToast
  } = useApp();

  const [pinEnabled, setPinEnabled] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      
      {/* Header */}
      <div>
        <h1 style={{ fontSize: "1.5rem", fontWeight: "800", color: "var(--text-primary)" }}>
          Security & Privacy Hub
        </h1>
        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
          Your money, your privacy. Manage authentication, trusted devices, and safety controls.
        </p>
      </div>

      {/* Safety Banner */}
      <div
        className="zavo-card"
        style={{
          backgroundColor: "var(--zavo-green-light)",
          border: "1px solid var(--zavo-green-border)",
          display: "flex",
          alignItems: "center",
          gap: "1rem"
        }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "var(--radius-full)",
            backgroundColor: "#ffffff",
            color: "var(--zavo-green)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "var(--shadow-sm)",
            flexShrink: 0
          }}
        >
          <ShieldCheck size={24} />
        </div>
        <div>
          <h3 style={{ fontSize: "1rem", fontWeight: "700", color: "var(--text-primary)", marginBottom: "0.15rem" }}>
            Zavo Bank-Grade Protection Active
          </h3>
          <p style={{ fontSize: "0.775rem", color: "var(--text-secondary)", margin: 0, lineHeight: 1.4 }}>
            All outgoing transactions require biometric confirmation. Wallet sync runs through zero-knowledge encrypted tokens.
          </p>
        </div>
      </div>

      {/* Security Options Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.25rem" }}>
        
        {/* Authentication Controls */}
        <div className="zavo-card">
          <h3 style={{ fontSize: "1rem", fontWeight: "700", color: "var(--text-primary)", marginBottom: "1rem" }}>
            Authentication & Biometrics
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {/* Biometric Toggle */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ fontSize: "0.875rem", fontWeight: "600", color: "var(--text-primary)", display: "block" }}>
                  Face ID / Fingerprint Auth
                </span>
                <span style={{ fontSize: "0.725rem", color: "var(--text-muted)" }}>
                  Prompt for biometric sensor on payments
                </span>
              </div>
              <button
                onClick={() => {
                  setBiometricsEnabled(!biometricsEnabled);
                  triggerToast("Setting Updated", `Biometrics ${!biometricsEnabled ? "enabled" : "disabled"}.`, "info");
                }}
                className={`btn ${biometricsEnabled ? "btn-primary" : "btn-secondary"}`}
                style={{ padding: "0.35rem 0.75rem", fontSize: "0.75rem" }}
              >
                {biometricsEnabled ? "Enabled" : "Disabled"}
              </button>
            </div>

            {/* PIN Code */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-subtle)", paddingTop: "0.75rem" }}>
              <div>
                <span style={{ fontSize: "0.875rem", fontWeight: "600", color: "var(--text-primary)", display: "block" }}>
                  6-Digit Security PIN
                </span>
                <span style={{ fontSize: "0.725rem", color: "var(--text-muted)" }}>
                  Required for emergency account recovery
                </span>
              </div>
              <span className="badge badge-green" style={{ fontSize: "0.7rem" }}>Configured</span>
            </div>

            {/* 2-Factor Auth */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-subtle)", paddingTop: "0.75rem" }}>
              <div>
                <span style={{ fontSize: "0.875rem", fontWeight: "600", color: "var(--text-primary)", display: "block" }}>
                  SMS / Authenticator 2FA
                </span>
                <span style={{ fontSize: "0.725rem", color: "var(--text-muted)" }}>
                  Sent to verified phone: +255 754 ••• •89
                </span>
              </div>
              <span className="badge badge-green" style={{ fontSize: "0.7rem" }}>Active</span>
            </div>
          </div>
        </div>

        {/* Privacy & Visibility */}
        <div className="zavo-card">
          <h3 style={{ fontSize: "1rem", fontWeight: "700", color: "var(--text-primary)", marginBottom: "1rem" }}>
            Privacy & Screen Masking
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {/* Screen Masking / Privacy Mode */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ fontSize: "0.875rem", fontWeight: "600", color: "var(--text-primary)", display: "block" }}>
                  Discreet Balance Masking
                </span>
                <span style={{ fontSize: "0.725rem", color: "var(--text-muted)" }}>
                  Blur balances when in public or recording
                </span>
              </div>
              <button
                onClick={() => {
                  setAnonymousMode(!anonymousMode);
                  triggerToast("Privacy Updated", `Privacy mode ${!anonymousMode ? "activated" : "deactivated"}.`, "info");
                }}
                className={`btn ${anonymousMode ? "btn-primary" : "btn-secondary"}`}
                style={{ padding: "0.35rem 0.75rem", fontSize: "0.75rem" }}
              >
                {anonymousMode ? "Active" : "Off"}
              </button>
            </div>

            {/* Instant Session Timeout */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-subtle)", paddingTop: "0.75rem" }}>
              <div>
                <span style={{ fontSize: "0.875rem", fontWeight: "600", color: "var(--text-primary)", display: "block" }}>
                  Inactivity Auto-Lock
                </span>
                <span style={{ fontSize: "0.725rem", color: "var(--text-muted)" }}>
                  Locks interface after 5 minutes idle
                </span>
              </div>
              <span className="badge badge-gray" style={{ fontSize: "0.7rem" }}>5 Minutes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trusted Devices Card */}
      <div className="zavo-card">
        <h3 style={{ fontSize: "1.05rem", fontWeight: "700", color: "var(--text-primary)", marginBottom: "0.25rem" }}>
          Authorized Trusted Devices
        </h3>
        <p style={{ fontSize: "0.775rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
          Hardware endpoints with authorized session tokens
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          {trustedDevices.map((dev) => (
            <div
              key={dev.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.75rem 1rem",
                backgroundColor: "var(--bg-surface)",
                borderRadius: "var(--radius-md)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                {dev.name.includes("iPhone") ? <Smartphone size={20} color="var(--zavo-green)" /> : <Laptop size={20} color="var(--accent-blue)" />}
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <span style={{ fontSize: "0.875rem", fontWeight: "700", color: "var(--text-primary)" }}>{dev.name}</span>
                    {dev.isCurrent && <span className="badge badge-green" style={{ fontSize: "0.6rem" }}>This Device</span>}
                  </div>
                  <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{dev.location} • Added {dev.dateAdded}</span>
                </div>
              </div>

              {!dev.isCurrent && (
                <button
                  onClick={() => triggerToast("Session Revoked", `Revoked access from ${dev.name}.`, "warning")}
                  className="btn btn-ghost"
                  style={{ fontSize: "0.75rem", color: "var(--accent-red)" }}
                >
                  Revoke
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
