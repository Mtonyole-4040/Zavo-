import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { downloadCSV, downloadPDF } from "../utils/pdfGenerator";
import {
  Download,
  FileText,
  PieChart as PieIcon,
  TrendingUp,
  Sparkles,
  Layers,
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  Filter,
  CheckCircle2,
  Lightbulb
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";

export default function Insights() {
  const {
    transactions,
    spaces,
    accounts,
    netWorth,
    insights,
    formatMoney,
    convertMoney,
    currency,
    triggerToast
  } = useApp();

  const [dateRange, setDateRange] = useState("Month"); // Week, Month, Year
  const [reportTab, setReportTab] = useState("overview"); // overview, spaces, wallets

  // Cash Flow History Data (in TZS)
  const cashFlowData = [
    { period: "May", Inflow: 2800000, Outflow: 2100000 },
    { period: "Jun", Inflow: 3100000, Outflow: 2400000 },
    { period: "Jul", Inflow: 3000000, Outflow: 2200000 },
    { period: "Aug", Inflow: 3200000, Outflow: 2350000 } // Current month
  ];

  // Category breakdown
  const categoryData = [
    { name: "Rent & Housing", value: 1200000, color: "#2563eb" },
    { name: "Food & Groceries", value: 850000, color: "#00a86b" },
    { name: "Business Operations", value: 450000, color: "#d97706" },
    { name: "Utilities & Bills", value: 200000, color: "#7c3aed" },
    { name: "Transport & Rides", value: 150000, color: "#f97316" }
  ];

  // Spending by Account
  const accountSpendingData = accounts.map(acc => ({
    name: acc.name.split(" ")[0],
    balance: acc.balance,
    color: acc.color
  }));

  // Spending by Space
  const spaceSpendingData = spaces.map(sp => ({
    name: sp.name,
    allocated: sp.balance,
    target: sp.target,
    color: sp.color
  }));

  const handleExportCSV = () => {
    downloadCSV(transactions, currency);
    triggerToast("CSV Downloaded", `Transactions exported in ${currency}.`, "success");
  };

  const handleExportPDF = () => {
    downloadPDF(transactions, spaces, netWorth, accounts, currency);
    triggerToast("PDF Generated", `Zavo Financial statement generated in ${currency}.`, "success");
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ backgroundColor: "#ffffff", padding: "0.75rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)", boxShadow: "var(--shadow-dropdown)" }}>
          <p style={{ fontWeight: "700", fontSize: "0.8rem", color: "var(--text-primary)", marginBottom: "0.25rem" }}>{label}</p>
          {payload.map((p, idx) => (
            <p key={idx} style={{ color: p.color, fontSize: "0.75rem", fontWeight: "600", margin: 0 }}>
              {p.name}: {formatMoney(p.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      
      {/* Header & Export Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: "800", color: "var(--text-primary)" }}>
            Insights & Reports
          </h1>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
            Understand your money flow, space allocations, and spending patterns.
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button onClick={handleExportCSV} className="btn btn-secondary" id="btn-report-csv">
            <Download size={14} /> Export CSV
          </button>
          <button onClick={handleExportPDF} className="btn btn-primary" id="btn-report-pdf">
            <FileText size={14} /> Download PDF Statement
          </button>
        </div>
      </div>

      {/* Date Range Selector */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "0.5rem" }}>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {["overview", "spaces", "wallets"].map((tab) => (
            <button
              key={tab}
              onClick={() => setReportTab(tab)}
              className={`btn ${reportTab === tab ? "btn-primary" : "btn-ghost"}`}
              style={{ textTransform: "capitalize", fontSize: "0.825rem", padding: "0.45rem 1rem" }}
            >
              {tab === "overview" ? "Overview & Cash Flow" : tab === "spaces" ? "Spaces Activity" : "Wallets Breakdown"}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: "0.3rem", backgroundColor: "var(--bg-surface)", padding: "0.2rem", borderRadius: "var(--radius-full)" }}>
          {["Week", "Month", "Year"].map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              style={{
                padding: "0.25rem 0.65rem",
                borderRadius: "var(--radius-full)",
                border: "none",
                background: dateRange === range ? "#ffffff" : "transparent",
                color: dateRange === range ? "var(--text-primary)" : "var(--text-muted)",
                fontSize: "0.75rem",
                fontWeight: "600",
                cursor: "pointer",
                boxShadow: dateRange === range ? "var(--shadow-sm)" : "none"
              }}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metric Tiles */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
        <div className="zavo-card" style={{ padding: "1.25rem" }}>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase" }}>Total Inflow (Aug)</span>
          <div style={{ fontSize: "1.35rem", fontWeight: "800", color: "var(--zavo-green)", marginTop: "0.25rem" }}>
            {formatMoney(3200000)}
          </div>
          <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>+6.4% from last month</span>
        </div>

        <div className="zavo-card" style={{ padding: "1.25rem" }}>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase" }}>Total Outflow (Aug)</span>
          <div style={{ fontSize: "1.35rem", fontWeight: "800", color: "var(--text-primary)", marginTop: "0.25rem" }}>
            {formatMoney(2350000)}
          </div>
          <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Within planned budget</span>
        </div>

        <div className="zavo-card" style={{ padding: "1.25rem" }}>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase" }}>Net Monthly Savings</span>
          <div style={{ fontSize: "1.35rem", fontWeight: "800", color: "var(--accent-blue)", marginTop: "0.25rem" }}>
            {formatMoney(850000)}
          </div>
          <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>26.5% savings rate</span>
        </div>
      </div>

      {/* 1. OVERVIEW & CASH FLOW TAB */}
      {reportTab === "overview" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "1.5rem" }}>
          {/* Cash Flow Area Chart */}
          <div className="zavo-card">
            <h3 style={{ fontSize: "1rem", fontWeight: "700", color: "var(--text-primary)", marginBottom: "0.2rem" }}>
              Cash Flow Trends
            </h3>
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
              Monthly money in vs money out
            </p>

            <div style={{ height: "240px", width: "100%" }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={cashFlowData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorInflow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00a86b" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#00a86b" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorOutflow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="period" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: "0.8rem" }} />
                  <Area name="Money In" type="monotone" dataKey="Inflow" stroke="#00a86b" strokeWidth={2.5} fill="url(#colorInflow)" />
                  <Area name="Money Out" type="monotone" dataKey="Outflow" stroke="#2563eb" strokeWidth={2} fill="url(#colorOutflow)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Spending by Category Pie Chart */}
          <div className="zavo-card">
            <h3 style={{ fontSize: "1rem", fontWeight: "700", color: "var(--text-primary)", marginBottom: "0.2rem" }}>
              Spending by Category
            </h3>
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
              Distribution across lifestyle & utility buckets
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ width: "50%", height: "200px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div style={{ width: "50%", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                {categoryData.map((item, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.75rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: item.color }} />
                      <span style={{ color: "var(--text-secondary)" }}>{item.name}</span>
                    </div>
                    <span style={{ fontWeight: "700", color: "var(--text-primary)" }}>{formatMoney(item.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. SPACES ACTIVITY TAB */}
      {reportTab === "spaces" && (
        <div className="zavo-card">
          <h3 style={{ fontSize: "1rem", fontWeight: "700", color: "var(--text-primary)", marginBottom: "0.25rem" }}>
            Zavo Spaces Funding Status
          </h3>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "1.25rem" }}>
            Current allocation balance vs target reserve for each Space
          </p>

          <div style={{ height: "260px", width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={spaceSpendingData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: "0.8rem" }} />
                <Bar name="Current Space Balance" dataKey="allocated" fill="#00a86b" radius={[6, 6, 0, 0]} />
                <Bar name="Target Goal" dataKey="target" fill="#e2e8f0" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* 3. WALLETS BREAKDOWN TAB */}
      {reportTab === "wallets" && (
        <div className="zavo-card">
          <h3 style={{ fontSize: "1rem", fontWeight: "700", color: "var(--text-primary)", marginBottom: "0.25rem" }}>
            Liquid Distribution Across Connected Wallets
          </h3>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "1.25rem" }}>
            Relative holding balances across your accounts
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {accounts.map((acc) => {
              const share = Math.round((acc.balance / netWorth) * 100);
              return (
                <div key={acc.id} style={{ padding: "0.75rem", backgroundColor: "var(--bg-surface)", borderRadius: "var(--radius-md)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                    <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-primary)" }}>{acc.name}</span>
                    <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--text-primary)" }}>{formatMoney(acc.balance)} ({share}%)</span>
                  </div>
                  <div style={{ width: "100%", height: "6px", backgroundColor: "#ffffff", borderRadius: "var(--radius-full)", overflow: "hidden" }}>
                    <div style={{ width: `${share}%`, height: "100%", backgroundColor: acc.color || "var(--zavo-green)" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. USEFUL AI FINANCIAL INSIGHTS */}
      <div className="zavo-card">
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
          <Sparkles size={18} color="var(--zavo-green)" />
          <h3 style={{ fontSize: "1.05rem", fontWeight: "700", color: "var(--text-primary)" }}>
            Zavo Financial Insights
          </h3>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
          {insights.map((ins) => (
            <div
              key={ins.id}
              style={{
                padding: "1rem",
                borderRadius: "var(--radius-lg)",
                backgroundColor: "var(--zavo-green-light)",
                border: "1px solid var(--zavo-green-border)",
                display: "flex",
                flexDirection: "column",
                gap: "0.4rem"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <Lightbulb size={16} color="var(--zavo-green)" />
                <h4 style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--text-primary)" }}>{ins.title}</h4>
              </div>
              <p style={{ fontSize: "0.775rem", color: "var(--text-secondary)", lineHeight: 1.4, margin: 0 }}>
                {ins.message}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
