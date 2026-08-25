import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Target,
  Plus,
  TrendingUp,
  Sparkles,
  Calendar,
  Wallet,
  CheckCircle2,
  Trash2,
  X,
  History,
  ArrowRight,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import confetti from "canvas-confetti";

export default function Goals() {
  const {
    goals,
    accounts,
    createGoal,
    fundGoal,
    deleteGoal,
    formatMoney,
    currency,
    anonymousMode,
    triggerToast
  } = useApp();

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFundModal, setShowFundModal] = useState(false);
  const [selectedGoalForFund, setSelectedGoalForFund] = useState(null);
  const [selectedGoalForHistory, setSelectedGoalForHistory] = useState(null);

  // Create Goal Form
  const [goalName, setGoalName] = useState("");
  const [goalTarget, setGoalTarget] = useState("");
  const [goalCategory, setGoalCategory] = useState("Hardware");
  const [goalIcon, setGoalIcon] = useState("💻");
  const [goalTargetDate, setGoalTargetDate] = useState("Dec 2026");
  const [initialDeposit, setInitialDeposit] = useState("");
  const [fundingAccId, setFundingAccId] = useState(accounts[0]?.id || "acc-1");

  // Fund Goal Form
  const [fundAmount, setFundAmount] = useState("50000");
  const [fundSourceAccId, setFundSourceAccId] = useState(accounts[0]?.id || "acc-1");

  // Icon and category presets
  const iconPresets = [
    { icon: "💻", name: "Laptop / Tech", cat: "Hardware" },
    { icon: "🛡️", name: "Emergency Cushion", cat: "Safety" },
    { icon: "🏖️", name: "Vacation / Safari", cat: "Travel" },
    { icon: "🎓", name: "School / Tuition", cat: "Education" },
    { icon: "📱", name: "New Smartphone", cat: "Gadgets" },
    { icon: "🚗", name: "Car / Vehicle", cat: "Transport" },
    { icon: "🏠", name: "House Downpayment", cat: "Property" },
    { icon: "🌱", name: "Farm / Agribusiness", cat: "Venture" }
  ];

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!goalName.trim()) {
      triggerToast("Name Required", "Please enter a title for your goal.", "error");
      return;
    }
    const success = createGoal({
      name: goalName,
      targetAmount: goalTarget,
      icon: goalIcon,
      category: goalCategory,
      targetDate: goalTargetDate,
      initialDeposit,
      fromAccId: fundingAccId
    });

    if (success) {
      setShowCreateModal(false);
      setGoalName("");
      setGoalTarget("");
      setInitialDeposit("");
    }
  };

  const handleFundSubmit = (e) => {
    e.preventDefault();
    if (!selectedGoalForFund) return;
    const success = fundGoal(selectedGoalForFund.id, fundAmount, fundSourceAccId);
    if (success) {
      setShowFundModal(false);
      setFundAmount("50000");
    }
  };

  const totalSavedInGoals = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const totalTargetInGoals = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const overallProgress = totalTargetInGoals > 0 ? Math.round((totalSavedInGoals / totalTargetInGoals) * 100) : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <h1 style={{ fontSize: "1.5rem", fontWeight: "800", color: "var(--text-primary)" }}>
              Financial Goals
            </h1>
            <span className="badge badge-green">Future Wealth</span>
          </div>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
            Set meaningful targets, automate funding, and achieve milestone dreams.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary"
          id="btn-create-goal"
        >
          <Plus size={16} /> Set New Goal
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div
        className="zavo-card"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1.5rem",
          background: "#ffffff"
        }}
      >
        <div>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase" }}>
            Total Saved in Goals
          </span>
          <div
            style={{ fontSize: "1.5rem", fontWeight: "800", color: "var(--zavo-green)", marginTop: "0.15rem" }}
            className={anonymousMode ? "privacy-blur" : ""}
          >
            {formatMoney(totalSavedInGoals)}
          </div>
          <span style={{ fontSize: "0.725rem", color: "var(--text-muted)" }}>
            of {formatMoney(totalTargetInGoals)} cumulative targets
          </span>
        </div>

        <div>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase" }}>
            Active Goals
          </span>
          <div style={{ fontSize: "1.5rem", fontWeight: "800", color: "var(--text-primary)", marginTop: "0.15rem" }}>
            {goals.length} Targets
          </div>
          <span style={{ fontSize: "0.725rem", color: "var(--text-muted)" }}>
            Overall {overallProgress}% completed
          </span>
        </div>

        <div>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase" }}>
            Savings Velocity
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginTop: "0.25rem" }}>
            <Sparkles size={16} color="var(--zavo-green)" />
            <span style={{ fontSize: "0.95rem", fontWeight: "700", color: "var(--text-primary)" }}>
              On Pace for 2026
            </span>
          </div>
          <span style={{ fontSize: "0.725rem", color: "var(--zavo-green)", fontWeight: "600" }}>
            +TZS 250,000 saved this month
          </span>
        </div>
      </div>

      {/* Goals Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.25rem" }}>
        {goals.map((goal) => {
          const pct = goal.targetAmount > 0 ? Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100)) : 0;
          const isCompleted = pct >= 100;
          const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);

          return (
            <div
              key={goal.id}
              className="zavo-card"
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "1.5rem",
                position: "relative"
              }}
            >
              {/* Top Row */}
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
                  {goal.icon}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span className={`badge ${isCompleted ? "badge-green" : "badge-gray"}`} style={{ fontSize: "0.75rem" }}>
                    {isCompleted ? "Completed! 🎉" : `${pct}%`}
                  </span>
                  <button
                    onClick={() => deleteGoal(goal.id, goal.name)}
                    style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "0.25rem" }}
                    title="Remove Goal"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Title & Category */}
              <div style={{ marginBottom: "0.75rem" }}>
                <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase" }}>
                  {goal.category}
                </span>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "var(--text-primary)", marginTop: "0.1rem" }}>
                  {goal.name}
                </h3>
              </div>

              {/* Balance & Target */}
              <div style={{ display: "flex", alignItems: "baseline", gap: "0.4rem", marginBottom: "0.5rem" }}>
                <span
                  style={{ fontSize: "1.35rem", fontWeight: "800", color: isCompleted ? "var(--zavo-green)" : "var(--text-primary)" }}
                  className={anonymousMode ? "privacy-blur" : ""}
                >
                  {formatMoney(goal.currentAmount)}
                </span>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  / {formatMoney(goal.targetAmount)}
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
                  marginBottom: "0.5rem"
                }}
              >
                <div
                  style={{
                    width: `${pct}%`,
                    height: "100%",
                    borderRadius: "var(--radius-full)",
                    backgroundColor: isCompleted ? "var(--zavo-green)" : "var(--zavo-green)",
                    transition: "width 0.4s ease"
                  }}
                />
              </div>

              {/* Remaining / Timeline */}
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.725rem", color: "var(--text-muted)", marginBottom: "1.25rem" }}>
                <span>{isCompleted ? "Target Achieved" : `${formatMoney(remaining)} left`}</span>
                <span>{goal.estimatedCompletion || "Target: Dec 2026"}</span>
              </div>

              {/* Action: Fund Goal */}
              <div style={{ marginTop: "auto", display: "flex", gap: "0.5rem" }}>
                <button
                  onClick={() => {
                    setSelectedGoalForFund(goal);
                    setShowFundModal(true);
                  }}
                  className="btn btn-primary"
                  style={{ flex: 1, padding: "0.55rem", fontSize: "0.8rem" }}
                >
                  <Plus size={14} /> Fund Goal
                </button>
                <button
                  onClick={() => setSelectedGoalForHistory(goal)}
                  className="btn btn-secondary"
                  style={{ padding: "0.55rem 0.75rem", fontSize: "0.8rem" }}
                  title="View Contribution History"
                >
                  <History size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* SET NEW GOAL MODAL */}
      {showCreateModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: "1.15rem", fontWeight: "700", color: "var(--text-primary)" }}>
                  Set a New Financial Goal
                </h3>
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  Define what you want to achieve and set a target
                </p>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="modal-close">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit}>
              {/* Preset selector */}
              <div className="form-group">
                <label>Choose Goal Type or Preset</label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.5rem", margin: "0.25rem 0" }}>
                  {iconPresets.map((p) => (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => {
                        setGoalIcon(p.icon);
                        setGoalCategory(p.cat);
                        if (!goalName) setGoalName(p.name);
                      }}
                      style={{
                        padding: "0.5rem 0.6rem",
                        borderRadius: "var(--radius-md)",
                        border: goalIcon === p.icon ? "2px solid var(--zavo-green)" : "1px solid var(--border-subtle)",
                        background: goalIcon === p.icon ? "var(--zavo-green-light)" : "var(--bg-surface)",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.4rem",
                        cursor: "pointer",
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        color: "var(--text-primary)",
                        textAlign: "left"
                      }}
                    >
                      <span style={{ fontSize: "1.1rem" }}>{p.icon}</span>
                      <span>{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div className="form-group">
                <label>Goal Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Buy M3 MacBook Pro, Emergency Cushion"
                  className="input-control"
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                />
              </div>

              {/* Target Amount */}
              <div className="form-group">
                <label>Target Amount ({currency})</label>
                <input
                  type="number"
                  required
                  min="10000"
                  step="10000"
                  placeholder="e.g. 3500000"
                  className="input-control"
                  value={goalTarget}
                  onChange={(e) => setGoalTarget(e.target.value)}
                />
              </div>

              {/* Target Date / Timeline */}
              <div className="form-group">
                <label>Target Timeline / Date</label>
                <input
                  type="text"
                  placeholder="e.g. November 2026 or 8 weeks"
                  className="input-control"
                  value={goalTargetDate}
                  onChange={(e) => setGoalTargetDate(e.target.value)}
                />
              </div>

              {/* Initial Deposit (Optional) */}
              <div className="form-group">
                <label>Initial Deposit (Optional)</label>
                <input
                  type="number"
                  min="0"
                  placeholder="0.00"
                  className="input-control"
                  value={initialDeposit}
                  onChange={(e) => setInitialDeposit(e.target.value)}
                />
              </div>

              {Number(initialDeposit) > 0 && (
                <div className="form-group">
                  <label>Fund Initial Deposit From</label>
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
              )}

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
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FUND GOAL MODAL */}
      {showFundModal && selectedGoalForFund && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <span style={{ fontSize: "1.5rem" }}>{selectedGoalForFund.icon}</span>
                <div>
                  <h3 style={{ fontSize: "1.15rem", fontWeight: "700", color: "var(--text-primary)" }}>
                    Fund "{selectedGoalForFund.name}"
                  </h3>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    Current: {formatMoney(selectedGoalForFund.currentAmount)} / {formatMoney(selectedGoalForFund.targetAmount)}
                  </p>
                </div>
              </div>
              <button onClick={() => setShowFundModal(false)} className="modal-close">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFundSubmit}>
              {/* Quick Preset Buttons */}
              <div className="form-group">
                <label>Quick Preset Amounts</label>
                <div style={{ display: "flex", gap: "0.4rem", margin: "0.25rem 0" }}>
                  {["20000", "50000", "100000", "250000"].map((pAmt) => (
                    <button
                      key={pAmt}
                      type="button"
                      onClick={() => setFundAmount(pAmt)}
                      className={`btn ${fundAmount === pAmt ? "btn-primary" : "btn-ghost"}`}
                      style={{ flex: 1, padding: "0.35rem", fontSize: "0.75rem", border: "1px solid var(--border-subtle)" }}
                    >
                      +{formatMoney(Number(pAmt))}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount */}
              <div className="form-group">
                <label>Amount to Contribute ({currency})</label>
                <input
                  type="number"
                  required
                  min="100"
                  className="input-control"
                  value={fundAmount}
                  onChange={(e) => setFundAmount(e.target.value)}
                  autoFocus
                />
              </div>

              {/* Source Account */}
              <div className="form-group">
                <label>Funding Source Wallet</label>
                <select
                  className="input-control"
                  value={fundSourceAccId}
                  onChange={(e) => setFundSourceAccId(e.target.value)}
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
                  onClick={() => setShowFundModal(false)}
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
                  Confirm Contribution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GOAL CONTRIBUTION HISTORY MODAL */}
      {selectedGoalForHistory && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <span style={{ fontSize: "1.5rem" }}>{selectedGoalForHistory.icon}</span>
                <div>
                  <h3 style={{ fontSize: "1.15rem", fontWeight: "700", color: "var(--text-primary)" }}>
                    {selectedGoalForHistory.name}
                  </h3>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    Contribution History & Milestones
                  </span>
                </div>
              </div>
              <button onClick={() => setSelectedGoalForHistory(null)} className="modal-close">
                <X size={18} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxHeight: "250px", overflowY: "auto" }}>
              {(!selectedGoalForHistory.history || selectedGoalForHistory.history.length === 0) ? (
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", textAlign: "center", padding: "1.5rem" }}>
                  No previous contributions logged yet.
                </p>
              ) : (
                selectedGoalForHistory.history.map((h, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "0.6rem 0.75rem",
                      backgroundColor: "var(--bg-surface)",
                      borderRadius: "var(--radius-md)"
                    }}
                  >
                    <div>
                      <span style={{ fontSize: "0.8rem", fontWeight: "600", color: "var(--text-primary)", display: "block" }}>
                        {h.type || "Contribution"}
                      </span>
                      <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                        {h.date}
                      </span>
                    </div>
                    <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--zavo-green)" }}>
                      +{formatMoney(h.amount)}
                    </span>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => setSelectedGoalForHistory(null)}
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
