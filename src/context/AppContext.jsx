import React, { createContext, useState, useEffect, useContext } from "react";
import {
  initialAccounts,
  initialSpaces,
  initialGoals,
  initialTransactions,
  initialBills,
  initialAiInsights
} from "../utils/mockData";
import { CURRENCIES, formatCurrency, convertCurrency, convertBetweenCurrencies } from "../utils/currencies";
import confetti from "canvas-confetti";

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  // Navigation & Core UI States
  const [currentView, setCurrentView] = useState("Home");
  const [currency, setCurrency] = useState("TZS");
  const [anonymousMode, setAnonymousMode] = useState(false);
  const [toasts, setToasts] = useState([]);
  
  // Data States
  const [accounts, setAccounts] = useState(initialAccounts);
  const [spaces, setSpaces] = useState(initialSpaces);
  const [goals, setGoals] = useState(initialGoals);
  const [transactions, setTransactions] = useState(initialTransactions);
  const [bills, setBills] = useState(initialBills);
  const [insights, setInsights] = useState(initialAiInsights);

  // Security Simulator States
  const [biometricsEnabled, setBiometricsEnabled] = useState(true);
  const [trustedDevices, setTrustedDevices] = useState([
    { id: "dev-1", name: "iPhone 15 Pro", location: "Dar es Salaam, TZ", dateAdded: "Aug 15, 2026", isCurrent: true },
    { id: "dev-2", name: "MacBook Air M2", location: "Dar es Salaam, TZ", dateAdded: "Aug 10, 2026", isCurrent: false }
  ]);
  
  // Notifications Center States
  const [notifications, setNotifications] = useState([
    { id: "not-1", title: "Salary Received", message: "TechWorks Ltd deposited your consulting salary of TZS 3,200,000.", time: "1 day ago", read: false },
    { id: "not-2", title: "Food Space Alert", message: "Your Food Space is 85% funded for this month.", time: "2 days ago", read: false },
    { id: "not-3", title: "M-Pesa Synchronized", message: "Vodacom M-Pesa balance verified via secure instant sync.", time: "3 days ago", read: true }
  ]);

  // Calculate Net Worth dynamically across all accounts (in TZS)
  const [netWorth, setNetWorth] = useState(0);

  useEffect(() => {
    const sum = accounts.reduce((acc, curr) => acc + curr.balance, 0);
    setNetWorth(sum);
  }, [accounts]);

  // Currency helper functions
  const formatMoney = (amountInTZS, customOptions = {}) => {
    return formatCurrency(amountInTZS, currency, customOptions);
  };

  const convertMoney = (amountInTZS, targetCur = currency) => {
    return convertCurrency(amountInTZS, targetCur);
  };

  // Toast alert trigger
  const triggerToast = (title, message, type = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // 1. Transaction Operations (with Pay from Space & Account deductions)
  const addTransaction = (txData) => {
    const newTx = {
      id: `tx-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      status: "completed",
      ...txData
    };

    // Prepend to transaction history
    setTransactions(prev => [newTx, ...prev]);

    // Update Funding Account Balance
    setAccounts(prevAccs =>
      prevAccs.map(acc => {
        if (acc.id === newTx.bankAccountId) {
          const shift = (newTx.type === "receive") ? Math.abs(newTx.amount) : -Math.abs(newTx.amount);
          return { ...acc, balance: Math.max(0, Math.round(acc.balance + shift)) };
        }
        return acc;
      })
    );

    // If transaction is paid from / allocated to a Zavo Space:
    if (newTx.allocatedSpaceId) {
      setSpaces(prevSpaces =>
        prevSpaces.map(sp => {
          if (sp.id === newTx.allocatedSpaceId) {
            let shift = 0;
            if (newTx.type === "transfer" || newTx.type === "deposit") {
              shift = Math.abs(newTx.amount); // Added money to Space
            } else if (newTx.type === "send" || newTx.type === "bill") {
              shift = -Math.abs(newTx.amount); // Paid expense from Space
            }

            const newBal = Math.max(0, Math.round(sp.balance + shift));
            const historyEntry = {
              id: `sp-h-${Date.now()}`,
              date: newTx.date,
              amount: Math.abs(newTx.amount),
              title: newTx.title,
              type: shift >= 0 ? "deposit" : "withdrawal"
            };

            return {
              ...sp,
              balance: newBal,
              history: [historyEntry, ...(sp.history || [])]
            };
          }
          return sp;
        })
      );
    }
  };

  // 2. Visual Money Spaces operations
  const createSpace = (name, target, icon, color, purpose) => {
    const newSpace = {
      id: `space-${Date.now()}`,
      name,
      purpose: purpose || "Allocated capital pocket",
      target: Number(target) || 500000,
      balance: 0,
      icon: icon || "🎯",
      color: color || "#00a86b",
      dateCreated: new Date().toISOString().split("T")[0],
      history: []
    };
    setSpaces(prev => [...prev, newSpace]);
    triggerToast("Space Created", `"${name}" space is ready. You can now allocate funds to it.`, "success");
  };

  const allocateMoneyToSpace = (spaceId, amount, fromAccId = "acc-1") => {
    const amtNum = Number(amount);
    const fundingAccount = accounts.find(a => a.id === fromAccId) || accounts[0];
    
    if (!fundingAccount || fundingAccount.balance < amtNum) {
      triggerToast("Insufficient Balance", `Your ${fundingAccount?.name || "wallet"} balance is too low for this allocation.`, "error");
      return false;
    }

    const space = spaces.find(s => s.id === spaceId);
    if (!space) return false;

    addTransaction({
      title: `Added to: ${space.name}`,
      amount: amtNum,
      type: "transfer",
      category: "Savings",
      bankAccountId: fundingAccount.id,
      allocatedSpaceId: spaceId,
      spaceName: space.name,
      merchantLogo: space.icon,
      description: `Moved ${formatMoney(amtNum)} from ${fundingAccount.name} to "${space.name}" Space.`
    });

    if (space.balance + amtNum >= space.target) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#00a86b", "#2563eb", "#d97706"]
      });
      triggerToast("Target Achieved! 🎉", `Outstanding! You reached your target for "${space.name}".`, "success");
    } else {
      triggerToast("Money Allocated", `Allocated ${formatMoney(amtNum)} to "${space.name}".`, "success");
    }

    return true;
  };

  const renameSpace = (id, newName) => {
    setSpaces(prev => prev.map(s => s.id === id ? { ...s, name: newName } : s));
    triggerToast("Space Updated", `Space updated to "${newName}".`, "info");
  };

  const updateSpaceTarget = (id, targetVal) => {
    setSpaces(prev => prev.map(s => s.id === id ? { ...s, target: Number(targetVal) } : s));
    triggerToast("Target Updated", "Space target amount modified.", "info");
  };

  const deleteSpace = (id, name) => {
    setSpaces(prev => prev.filter(s => s.id !== id));
    triggerToast("Space Removed", `"${name}" has been removed.`, "info");
  };

  // 3. Financial Goals operations
  const createGoal = ({ name, targetAmount, icon, category, targetDate, initialDeposit = 0, fromAccId = "acc-1" }) => {
    const targetNum = Number(targetAmount) || 1000000;
    const initialNum = Number(initialDeposit) || 0;

    if (initialNum > 0) {
      const fundingAccount = accounts.find(a => a.id === fromAccId) || accounts[0];
      if (fundingAccount && fundingAccount.balance >= initialNum) {
        setAccounts(prev => prev.map(acc => {
          if (acc.id === fundingAccount.id) {
            return { ...acc, balance: Math.max(0, acc.balance - initialNum) };
          }
          return acc;
        }));
      }
    }

    const newGoal = {
      id: `goal-${Date.now()}`,
      name: name.trim(),
      currentAmount: initialNum,
      targetAmount: targetNum,
      category: category || "Savings",
      icon: icon || "🎯",
      targetDate: targetDate || "Dec 2026",
      estimatedCompletion: targetDate ? `Target: ${targetDate}` : "Estimated 6 weeks",
      color: "#00a86b",
      history: initialNum > 0 ? [{ date: new Date().toISOString().split("T")[0], amount: initialNum, type: "Initial Deposit" }] : []
    };

    setGoals(prev => [newGoal, ...prev]);

    if (initialNum > 0) {
      addTransaction({
        title: `Goal Initial Deposit: ${name}`,
        amount: initialNum,
        type: "transfer",
        category: "Savings",
        bankAccountId: fromAccId,
        allocatedSpaceId: null,
        merchantLogo: icon || "🎯",
        description: `Initial funding towards goal "${name}".`
      });
    }

    triggerToast("Goal Created", `"${name}" goal created successfully.`, "success");
    return true;
  };

  const fundGoal = (goalId, amount, fromAccId = "acc-1") => {
    const amtNum = Number(amount);
    if (!amtNum || amtNum <= 0) {
      triggerToast("Invalid Amount", "Please input a positive funding amount.", "error");
      return false;
    }

    const fundingAccount = accounts.find(a => a.id === fromAccId) || accounts[0];
    if (!fundingAccount || fundingAccount.balance < amtNum) {
      triggerToast("Insufficient Balance", `Your ${fundingAccount?.name || "wallet"} balance is too low for this goal contribution.`, "error");
      return false;
    }

    const goal = goals.find(g => g.id === goalId);
    if (!goal) return false;

    // Deduct funding account
    setAccounts(prev => prev.map(acc => {
      if (acc.id === fundingAccount.id) {
        return { ...acc, balance: Math.max(0, acc.balance - amtNum) };
      }
      return acc;
    }));

    const newCurrent = goal.currentAmount + amtNum;
    const isReached = newCurrent >= goal.targetAmount;

    // Update goal
    setGoals(prev => prev.map(g => {
      if (g.id === goalId) {
        return {
          ...g,
          currentAmount: newCurrent,
          history: [{ date: new Date().toISOString().split("T")[0], amount: amtNum, type: "Contribution" }, ...(g.history || [])]
        };
      }
      return g;
    }));

    // Add transaction record
    addTransaction({
      title: `Funded Goal: ${goal.name}`,
      amount: amtNum,
      type: "transfer",
      category: "Savings",
      bankAccountId: fundingAccount.id,
      allocatedSpaceId: null,
      merchantLogo: goal.icon || "🎯",
      description: `Contributed ${formatMoney(amtNum)} to "${goal.name}".`
    });

    if (isReached) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#00a86b", "#2563eb", "#d97706"]
      });
      triggerToast("Goal Reached! 🎉", `Incredible achievement! You reached 100% of your "${goal.name}" target!`, "success");
    } else {
      triggerToast("Goal Funded", `Added ${formatMoney(amtNum)} to "${goal.name}".`, "success");
    }

    return true;
  };

  const deleteGoal = (goalId, name) => {
    setGoals(prev => prev.filter(g => g.id !== goalId));
    triggerToast("Goal Removed", `"${name}" goal was removed.`, "info");
  };

  // 4. Multi-Wallet / Account Management operations
  const connectNewAccount = (institutionName, accountType, initialBalStr) => {
    const balNum = Number(initialBalStr) || 500000;
    const colorMap = {
      "M-Pesa": "#e11d48",
      "Airtel Money": "#dc2626",
      "Tigo Pesa": "#0284c7",
      "NMB Bank": "#d97706",
      "CRDB Bank": "#059669",
      "Stanbic Bank": "#1d4ed8"
    };
    const logoMap = {
      "M-Pesa": "🔴",
      "Airtel Money": "📱",
      "Tigo Pesa": "🔵",
      "NMB Bank": "🏦",
      "CRDB Bank": "🌿",
      "Stanbic Bank": "💳"
    };

    const newAcc = {
      id: `acc-${Date.now()}`,
      name: `${institutionName} (${accountType})`,
      institution: institutionName,
      type: accountType,
      balance: balNum,
      accountNumber: `SIM-${Math.floor(1000 + Math.random() * 9000)}-${institutionName.substring(0, 3).toUpperCase()}`,
      lastSynced: "Just now",
      color: colorMap[institutionName] || "#00a86b",
      logo: logoMap[institutionName] || "💳",
      isDefault: false
    };

    setAccounts(prev => [...prev, newAcc]);
    triggerToast("Account Connected", `Successfully linked ${institutionName} to your Zavo money hub.`, "success");
  };

  const disconnectAccount = (id, name) => {
    if (id === "acc-1") {
      triggerToast("Cannot Disconnect", "Primary Zavo Wallet cannot be removed.", "error");
      return;
    }
    setAccounts(prev => prev.filter(a => a.id !== id));
    triggerToast("Account Disconnected", `"${name}" removed from your connected wallets.`, "info");
  };

  // 5. Bill Payment
  const payBill = (billId, fromSpaceId = null) => {
    const bill = bills.find(b => b.id === billId);
    if (!bill) return;

    const zavoWallet = accounts.find(a => a.id === "acc-1") || accounts[0];
    if (!zavoWallet || zavoWallet.balance < bill.amount) {
      triggerToast("Insufficient Funds", "Insufficient funds to settle this bill.", "error");
      return;
    }

    const spaceObj = spaces.find(s => s.id === fromSpaceId);

    addTransaction({
      title: bill.title,
      amount: bill.amount,
      type: "bill",
      category: bill.category,
      bankAccountId: zavoWallet.id,
      allocatedSpaceId: fromSpaceId || null,
      spaceName: spaceObj ? spaceObj.name : null,
      merchantLogo: bill.merchantLogo,
      description: `Settled ${bill.title} ${spaceObj ? `from ${spaceObj.name} Space` : ""}.`
    });

    setBills(prev => prev.filter(b => b.id !== billId));
    triggerToast("Bill Paid Successfully", `Payment for "${bill.title}" completed.`, "success");
  };

  // 6. Notifications
  const markNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <AppContext.Provider
      value={{
        // Navigation / Preferences
        currentView,
        setCurrentView,
        currency,
        setCurrency,
        formatMoney,
        convertMoney,
        currencies: CURRENCIES,
        anonymousMode,
        setAnonymousMode,
        toasts,
        triggerToast,
        removeToast,
        
        // Data States
        accounts,
        spaces,
        goals,
        transactions,
        bills,
        insights,
        netWorth,
        
        // Operations
        addTransaction,
        createSpace,
        renameSpace,
        updateSpaceTarget,
        deleteSpace,
        allocateMoneyToSpace,
        createGoal,
        fundGoal,
        deleteGoal,
        addMoneyToGoal: fundGoal,
        connectNewAccount,
        disconnectAccount,
        payBill,
        
        // Notifications Center
        notifications,
        markNotificationRead,
        clearAllNotifications,

        // Security settings
        biometricsEnabled,
        setBiometricsEnabled,
        trustedDevices
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
