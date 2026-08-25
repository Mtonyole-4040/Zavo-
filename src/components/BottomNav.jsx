import React from "react";
import { useApp } from "../context/AppContext";
import {
  Home,
  Boxes,
  Target,
  ArrowUpRight,
  Wallet,
  PieChart,
  User
} from "lucide-react";

export default function BottomNav() {
  const { currentView, setCurrentView } = useApp();

  const navItems = [
    { id: "Home", label: "Home", icon: Home },
    { id: "Spaces", label: "Spaces", icon: Boxes },
    { id: "Goals", label: "Goals", icon: Target },
    { id: "Payments", label: "Pay", icon: ArrowUpRight },
    { id: "Insights", label: "Insights", icon: PieChart }
  ];

  return (
    <nav className="zavo-bottom-nav">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`bottom-nav-item ${isActive ? "active" : ""}`}
            aria-label={item.label}
          >
            <Icon size={20} color={isActive ? "var(--zavo-green)" : "var(--text-muted)"} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
