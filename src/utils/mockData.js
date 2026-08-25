/**
 * Realistic Tanzanian consumer fintech demo data for Zavo.
 * Total initial liquid assets: TZS 8,580,500 across 5 connected accounts.
 */

export const initialAccounts = [
  {
    id: "acc-1",
    name: "Zavo Wallet",
    institution: "Zavo Core",
    type: "Digital Wallet",
    balance: 5430500,
    accountNumber: "ZV-9920-8812",
    lastSynced: "Just now",
    color: "#00a86b",
    logo: "⚡",
    isDefault: true
  },
  {
    id: "acc-2",
    name: "Vodacom M-Pesa",
    institution: "M-Pesa",
    type: "Mobile Money",
    balance: 850000,
    accountNumber: "+255 754 ••• •89",
    lastSynced: "5 mins ago",
    color: "#e11d48",
    logo: "🔴",
    isDefault: false
  },
  {
    id: "acc-3",
    name: "Airtel Money",
    institution: "Airtel",
    type: "Mobile Money",
    balance: 320000,
    accountNumber: "+255 784 ••• •12",
    lastSynced: "12 mins ago",
    color: "#dc2626",
    logo: "📱",
    isDefault: false
  },
  {
    id: "acc-4",
    name: "NMB Bank",
    institution: "NMB Bank Plc",
    type: "Bank Checking",
    balance: 1200000,
    accountNumber: "NMB-2019-••••-4011",
    lastSynced: "1 hour ago",
    color: "#d97706",
    logo: "🏦",
    isDefault: false
  },
  {
    id: "acc-5",
    name: "CRDB Bank",
    institution: "CRDB Bank Plc",
    type: "Bank Savings",
    balance: 780000,
    accountNumber: "CRDB-0150-••••-8821",
    lastSynced: "2 hours ago",
    color: "#059669",
    logo: "🌿",
    isDefault: false
  }
];

export const initialSpaces = [
  {
    id: "space-1",
    name: "Food & Groceries",
    purpose: "Money reserved for food and household meals",
    balance: 850000,
    target: 1000000,
    icon: "🛒",
    color: "#00a86b",
    dateCreated: "2026-08-01",
    history: [
      { id: "sp-h-1", date: "2026-08-24", title: "Shoppers Supermarket", amount: 65000, type: "withdrawal" },
      { id: "sp-h-2", date: "2026-08-20", title: "Weekly Allocation", amount: 250000, type: "deposit" }
    ]
  },
  {
    id: "space-2",
    name: "Rent & House",
    purpose: "Apartment lease reserve and upkeep",
    balance: 1200000,
    target: 1500000,
    icon: "🏠",
    color: "#2563eb",
    dateCreated: "2026-08-01",
    history: [
      { id: "sp-h-3", date: "2026-08-15", title: "Monthly Rent Allocation", amount: 600000, type: "deposit" }
    ]
  },
  {
    id: "space-3",
    name: "Business Operations",
    purpose: "Freelance projects & inventory expenses",
    balance: 700000,
    target: 1000000,
    icon: "💼",
    color: "#d97706",
    dateCreated: "2026-08-05",
    history: [
      { id: "sp-h-4", date: "2026-08-22", title: "Client Invoice Settle", amount: 45000, type: "withdrawal" }
    ]
  },
  {
    id: "space-4",
    name: "Emergency Cushion",
    purpose: "3 months backup safety fund",
    balance: 600000,
    target: 1200000,
    icon: "🛡️",
    color: "#7c3aed",
    dateCreated: "2026-08-10",
    history: [
      { id: "sp-h-5", date: "2026-08-18", title: "Auto Round-Up Deposit", amount: 15000, type: "deposit" }
    ]
  }
];

export const initialGoals = [
  {
    id: "goal-1",
    name: "Buy M3 MacBook Pro",
    currentAmount: 2400000,
    targetAmount: 3500000,
    category: "Hardware",
    icon: "💻",
    estimatedCompletion: "4 weeks remaining",
    color: "#00a86b"
  },
  {
    id: "goal-2",
    name: "Zanzibar Weekend Trip",
    currentAmount: 350000,
    targetAmount: 800000,
    category: "Travel",
    icon: "🏖️",
    estimatedCompletion: "6 weeks remaining",
    color: "#2563eb"
  },
  {
    id: "goal-3",
    name: "Emergency Fund Goal",
    currentAmount: 600000,
    targetAmount: 1200000,
    category: "Safety",
    icon: "🛡️",
    estimatedCompletion: "8 weeks remaining",
    color: "#7c3aed"
  }
];

export const initialTransactions = [
  {
    id: "tx-1",
    date: "2026-08-25",
    title: "Shoppers Supermarket Masaki",
    amount: -65000,
    type: "send",
    category: "Food & Dining",
    bankAccountId: "acc-1",
    allocatedSpaceId: "space-1",
    spaceName: "Food & Groceries",
    merchantLogo: "🛒",
    status: "completed",
    description: "Weekly family groceries paid from Food Space"
  },
  {
    id: "tx-2",
    date: "2026-08-24",
    title: "Salary Direct Deposit",
    amount: 3200000,
    type: "receive",
    category: "Income",
    bankAccountId: "acc-1",
    allocatedSpaceId: null,
    merchantLogo: "💼",
    status: "completed",
    description: "Monthly consulting payroll from TechWorks Ltd"
  },
  {
    id: "tx-3",
    date: "2026-08-23",
    title: "TANESCO LUKU Electricity",
    amount: -45000,
    type: "bill",
    category: "Utilities",
    bankAccountId: "acc-2",
    allocatedSpaceId: null,
    merchantLogo: "⚡",
    status: "completed",
    description: "50 kWh prepaid electricity token"
  },
  {
    id: "tx-4",
    date: "2026-08-22",
    title: "Transfer to Neema Mwangi",
    amount: -120000,
    type: "send",
    category: "Transfer",
    bankAccountId: "acc-2",
    allocatedSpaceId: null,
    merchantLogo: "👤",
    status: "completed",
    description: "M-Pesa payment for shared project materials"
  },
  {
    id: "tx-5",
    date: "2026-08-21",
    title: "Kibo Cafe & Roasters",
    amount: -18500,
    type: "send",
    category: "Food & Dining",
    bankAccountId: "acc-1",
    allocatedSpaceId: "space-1",
    spaceName: "Food & Groceries",
    merchantLogo: "☕",
    status: "completed",
    description: "Espresso & lunch meeting"
  },
  {
    id: "tx-6",
    date: "2026-08-20",
    title: "Vodacom Airtime & Data Bundle",
    amount: -25000,
    type: "bill",
    category: "Utilities",
    bankAccountId: "acc-2",
    allocatedSpaceId: null,
    merchantLogo: "📱",
    status: "completed",
    description: "Monthly 30GB 5G High Speed Data Pack"
  }
];

export const initialBills = [
  {
    id: "bill-1",
    title: "TANESCO Electricity (LUKU)",
    amount: 50000,
    dueDate: "Aug 30, 2026",
    category: "Utilities",
    merchantLogo: "⚡"
  },
  {
    id: "bill-2",
    title: "DAWASA Water Utility",
    amount: 28000,
    dueDate: "Sep 02, 2026",
    category: "Utilities",
    merchantLogo: "💧"
  },
  {
    id: "bill-3",
    title: "Zuku Home Fiber Internet",
    amount: 75000,
    dueDate: "Sep 05, 2026",
    category: "Internet",
    merchantLogo: "🌐"
  }
];

export const initialAiInsights = [
  {
    id: "in-1",
    type: "success",
    title: "Food Space On Track",
    message: "Your Food Space is 85% funded for this month with 6 days remaining. Spending velocity is balanced."
  },
  {
    id: "in-2",
    type: "tip",
    title: "Accelerate MacBook Goal",
    message: "You could reach your MacBook goal 2 weeks earlier by saving TZS 40,000 more per week from M-Pesa."
  },
  {
    id: "in-3",
    type: "info",
    title: "Transport Spending Down 18%",
    message: "You spent 18% less on city rides and transport this week compared to last month."
  }
];
