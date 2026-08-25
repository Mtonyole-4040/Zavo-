import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Plus,
  ArrowUpRight,
  Target,
  Edit2,
  Trash2,
  CheckCircle2,
  Layers,
  ChevronRight,
  TrendingUp,
  X,
  History,
  Send,
  Sparkles
} from "lucide-react";

export default function Spaces({ onOpenPayFromSpace }) {
  const {
    spaces,
    accounts,
    createSpace,
    renameSpace,
    updateSpaceTarget,
    deleteSpace,
    allocateMoneyToSpace,
    formatMoney,
    currency,
    anonymousMode,
    triggerToast
  } = useApp();

  // Selected space for detail drawer / modal
  const [selectedSpace, setSelectedSpace] = useState(null);

  // Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
  const [activeSpaceForAdd, setActiveSpaceForAdd] = useState(null);
  
  // Create Space Form
  const [newSpaceName, setNewSpaceName] = useState("");
  const [newSpaceTarget, setNewSpaceTarget] = useState("");
  const [newSpacePurpose, setNewSpacePurpose] = useState("");
  const [newSpaceIcon, setNewSpaceIcon] = useState("🛒");
  const [newSpaceColor, setNewSpaceColor] = useState("#00a86b");

  // Add Money Form
  const [addAmount, setAddAmount] = useState("");
  const [fundingAccId, setFundingAccId] = useState(accounts[0]?.id || "acc-1");

  // Emoji icon presets
  const emojiIcons = ["🛒", "🏠", "💼", "🛡️", "🎓", "✈️", "🚗", "👶", "🏥", "💡", "🎮", "🎁"];
  const colorPresets = ["#00a86b", "#2563eb", "#d97706", "#7c3aed", "#e11d48", "#0284c7"];

  // Handle create submit
  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newSpaceName.trim()) {
      triggerToast("Name Required", "Please enter a title for your new Space.", "error");
      return;
    }
    createSpace(
      newSpaceName.trim(),
      newSpaceTarget || 500000,
      newSpaceIcon,
      newSpaceColor,
      newSpacePurpose || "Custom money reserve"
    );
    setShowCreateModal(false);
    setNewSpaceName("");
    setNewSpaceTarget("");
    setNewSpacePurpose("");
  };

  // Handle add money submit
  const handleAddMoneySubmit = (e) => {
    e.preventDefault();
    if (!addAmount || Number(addAmount) <= 0) {
      triggerToast("Invalid Amount", "Please enter a valid allocation amount.", "error");
      return;
    }
    const success = allocateMoneyToSpace(activeSpaceForAdd.id, addAmount, fundingAccId);
    if (success) {
      setShowAddMoneyModal(false);
      setAddAmount("");
    }
  };

  // Calculate total allocated in Spaces
  const totalInSpaces = spaces.reduce((sum, s) => sum + s.balance, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      
      {/* Header with Title and Create Button */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <h1 style={{ fontSize: "1.5rem", fontWeight: "800", color: "var(--text-primary)" }}>
              Zavo Spaces
            </h1>
            <span className="badge badge-green">Signature Feature</span>
          </div>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
            Visual pockets of capital. Allocate, protect, and pay directly from purpose-built Spaces.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary"
          id="btn-create-space"
        >
          <Plus size={16} /> Create New Space
        </button>
      </div>

      {/* Overview Stat Strip */}
      <div
        className="zavo-card"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1.5rem",
          padding: "1.25rem 1.5rem",
          background: "#ffffff"
        }}
      >
        <div>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase" }}>
            Total in Spaces
          </span>
          <div
            style={{ fontSize: "1.5rem", fontWeight: "800", color: "var(--zavo-green)", marginTop: "0.15rem" }}
            className={anonymousMode ? "privacy-blur" : ""}
          >
            {formatMoney(totalInSpaces)}
          </div>
        </div>

        <div>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase" }}>
            Active Spaces
          </span>
          <div style={{ fontSize: "1.5rem", fontWeight: "800", color: "var(--text-primary)", marginTop: "0.15rem" }}>
            {spaces.length} Spaces
          </div>
        </div>

        <div>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase" }}>
            Direct Pay Status
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginTop: "0.25rem" }}>
            <CheckCircle2 size={16} color="var(--zavo-green)" />
            <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--text-primary)" }}>
              Enabled on all Spaces
            </span>
          </div>
        </div>
      </div>

      {/* Spaces Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.25rem" }}>
        {spaces.map((space) => {
          const pct = space.target > 0 ? Math.min(100, Math.round((space.balance / space.target) * 100)) : 0;
          return (
            <div
              key={space.id}
              className="zavo-card"
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "1.5rem",
                position: "relative"
              }}
            >
              {/* Top Row: Icon & Actions */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "var(--radius-lg)",
                    backgroundColor: "var(--bg-surface)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.5rem"
                  }}
                >
                  {space.icon}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span className="badge badge-gray" style={{ fontSize: "0.75rem" }}>
                    {pct}% funded
                  </span>
                  <button
                    onClick={() => deleteSpace(space.id, space.name)}
                    style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "0.25rem" }}
                    title="Delete Space"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Title & Purpose */}
              <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "var(--text-primary)", marginBottom: "0.2rem" }}>
                {space.name}
              </h3>
              <p style={{ fontSize: "0.775rem", color: "var(--text-secondary)", marginBottom: "1rem", lineHeight: 1.35 }}>
                {space.purpose}
              </p>

              {/* Balance & Target */}
              <div style={{ display: "flex", alignItems: "baseline", gap: "0.4rem", marginBottom: "0.6rem" }}>
                <span
                  style={{ fontSize: "1.35rem", fontWeight: "800", color: "var(--text-primary)" }}
                  className={anonymousMode ? "privacy-blur" : ""}
                >
                  {formatMoney(space.balance)}
                </span>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  / {formatMoney(space.target)}
                </span>
              </div>

              {/* Progress Bar */}
              <div
                style={{
                  width: "100%",
                  height: "8px",
                  borderRadius: "var(--radius-full)",
                  backgroundColor: "var(--bg-surface)",
                  overflow: "hidden",
                  marginBottom: "1.25rem"
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

              {/* Action Buttons: Add Money & Pay from Space */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginTop: "auto" }}>
                <button
                  onClick={() => {
                    setActiveSpaceForAdd(space);
                    setShowAddMoneyModal(true);
                  }}
                  className="btn btn-secondary"
                  style={{ padding: "0.5rem", fontSize: "0.8rem" }}
                >
                  <Plus size={14} /> Add Money
                </button>

                <button
                  onClick={() => onOpenPayFromSpace(space)}
                  className="btn btn-primary"
                  style={{ padding: "0.5rem", fontSize: "0.8rem" }}
                >
                  <Send size={14} /> Pay from Space
                </button>
              </div>

              {/* Space Activity Drawer Trigger */}
              <button
                onClick={() => setSelectedSpace(space)}
                style={{
                  background: "none",
                  border: "none",
                  marginTop: "0.75rem",
                  color: "var(--text-muted)",
                  fontSize: "0.75rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.25rem",
                  cursor: "pointer",
                  paddingTop: "0.5rem",
                  borderTop: "1px solid var(--border-subtle)"
                }}
              >
                <History size={12} /> View space ledger ({space.history?.length || 0})
              </button>
            </div>
          );
        })}
      </div>

      {/* CREATE SPACE MODAL */}
      {showCreateModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: "1.15rem", fontWeight: "700", color: "var(--text-primary)" }}>
                  Create Zavo Space
                </h3>
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  Organize and ring-fence money for a specific purpose
                </p>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="modal-close">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit}>
              {/* Choose Icon */}
              <div className="form-group">
                <label>Select Icon</label>
                <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", margin: "0.25rem 0" }}>
                  {emojiIcons.map((ic) => (
                    <button
                      key={ic}
                      type="button"
                      onClick={() => setNewSpaceIcon(ic)}
                      style={{
                        width: "38px",
                        height: "38px",
                        borderRadius: "var(--radius-md)",
                        border: newSpaceIcon === ic ? "2px solid var(--zavo-green)" : "1px solid var(--border-subtle)",
                        background: newSpaceIcon === ic ? "var(--zavo-green-light)" : "var(--bg-surface)",
                        fontSize: "1.2rem",
                        cursor: "pointer"
                      }}
                    >
                      {ic}
                    </button>
                  ))}
                </div>
              </div>

              {/* Choose Color */}
              <div className="form-group">
                <label>Theme Color</label>
                <div style={{ display: "flex", gap: "0.5rem", margin: "0.25rem 0" }}>
                  {colorPresets.map((cl) => (
                    <button
                      key={cl}
                      type="button"
                      onClick={() => setNewSpaceColor(cl)}
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        border: newSpaceColor === cl ? "2px solid #0f172a" : "none",
                        backgroundColor: cl,
                        cursor: "pointer",
                        outline: "none"
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Name */}
              <div className="form-group">
                <label>Space Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. School Fees, Safari Trip, Farm Inventory"
                  className="input-control"
                  value={newSpaceName}
                  onChange={(e) => setNewSpaceName(e.target.value)}
                />
              </div>

              {/* Target Amount */}
              <div className="form-group">
                <label>Target Amount ({currency})</label>
                <input
                  type="number"
                  placeholder="e.g. 1000000"
                  className="input-control"
                  value={newSpaceTarget}
                  onChange={(e) => setNewSpaceTarget(e.target.value)}
                />
              </div>

              {/* Purpose description */}
              <div className="form-group">
                <label>Purpose (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Reserved for semester 2 tuition"
                  className="input-control"
                  value={newSpacePurpose}
                  onChange={(e) => setNewSpacePurpose(e.target.value)}
                />
              </div>

              <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
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
                  Save Space
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD MONEY MODAL */}
      {showAddMoneyModal && activeSpaceForAdd && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: "1.15rem", fontWeight: "700", color: "var(--text-primary)" }}>
                  Add Money to {activeSpaceForAdd.name}
                </h3>
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  Move capital from a connected wallet into this Space
                </p>
              </div>
              <button onClick={() => setShowAddMoneyModal(false)} className="modal-close">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddMoneySubmit}>
              <div className="form-group">
                <label>Amount to Allocate ({currency})</label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="0.00"
                  className="input-control"
                  value={addAmount}
                  onChange={(e) => setAddAmount(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label>Source Wallet / Account</label>
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

              <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
                <button
                  type="button"
                  onClick={() => setShowAddMoneyModal(false)}
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
                  Confirm Allocation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SPACE DETAIL & LEDGER MODAL */}
      {selectedSpace && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <span style={{ fontSize: "1.5rem" }}>{selectedSpace.icon}</span>
                <div>
                  <h3 style={{ fontSize: "1.15rem", fontWeight: "700", color: "var(--text-primary)" }}>
                    {selectedSpace.name}
                  </h3>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    Created on {selectedSpace.dateCreated}
                  </span>
                </div>
              </div>
              <button onClick={() => setSelectedSpace(null)} className="modal-close">
                <X size={18} />
              </button>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Balance</span>
                <span style={{ fontSize: "1.1rem", fontWeight: "800", color: "var(--zavo-green)" }}>
                  {formatMoney(selectedSpace.balance)}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Target Goal</span>
                <span style={{ fontSize: "0.95rem", fontWeight: "600", color: "var(--text-primary)" }}>
                  {formatMoney(selectedSpace.target)}
                </span>
              </div>
            </div>

            <h4 style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--text-primary)", marginBottom: "0.75rem" }}>
              Space Activity History
            </h4>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxHeight: "200px", overflowY: "auto" }}>
              {(!selectedSpace.history || selectedSpace.history.length === 0) ? (
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", textAlign: "center", padding: "1rem" }}>
                  No transactions recorded yet in this Space.
                </p>
              ) : (
                selectedSpace.history.map((h) => {
                  const isDeposit = h.type === "deposit";
                  return (
                    <div
                      key={h.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "0.5rem 0.75rem",
                        borderRadius: "var(--radius-md)",
                        backgroundColor: "var(--bg-surface)"
                      }}
                    >
                      <div>
                        <div style={{ fontSize: "0.8rem", fontWeight: "600", color: "var(--text-primary)" }}>
                          {h.title}
                        </div>
                        <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                          {h.date}
                        </span>
                      </div>
                      <span
                        style={{
                          fontSize: "0.85rem",
                          fontWeight: "700",
                          color: isDeposit ? "var(--zavo-green)" : "var(--accent-red)"
                        }}
                      >
                        {isDeposit ? "+" : "-"}{formatMoney(h.amount)}
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            <button
              onClick={() => setSelectedSpace(null)}
              className="btn btn-secondary"
              style={{ width: "100%", marginTop: "1.5rem" }}
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
