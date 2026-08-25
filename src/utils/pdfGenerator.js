import { jsPDF } from "jspdf";
import { formatCurrency, convertCurrency, CURRENCIES } from "./currencies";

export const downloadCSV = (transactions, currency = "TZS") => {
  const curr = CURRENCIES[currency] || CURRENCIES.TZS;
  const headers = ["Date", "Description", "Category", "Funding Space / Source", `Amount (${curr.code})`, "Status"];
  const rows = transactions.map(tx => [
    tx.date,
    `"${(tx.title || "").replace(/"/g, '""')}"`,
    tx.category || "General",
    `"${tx.spaceName || "Primary Wallet"}"`,
    convertCurrency(tx.amount, currency),
    tx.status || "completed"
  ]);
  
  const csvContent = "data:text/csv;charset=utf-8," 
    + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `Zavo_Statement_${currency}_${new Date().toISOString().split("T")[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const downloadPDF = (transactions, spaces, netWorth, accounts, currency = "TZS") => {
  const doc = new jsPDF();
  const curr = CURRENCIES[currency] || CURRENCIES.TZS;
  
  // Header with clean styling
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(15, 23, 42); // Deep Navy #0f172a
  doc.text("ZAVO", 20, 22);
  
  doc.setFontSize(10);
  doc.setFont("Helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text("One Place. Every Wallet. | Consolidated Financial Statement", 20, 29);
  doc.text(`Generated: ${new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })} (Demo Simulation)`, 20, 35);
  
  doc.setLineWidth(0.5);
  doc.setDrawColor(226, 232, 240);
  doc.line(20, 40, 190, 40);
  
  // Financial Overview Section
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text("Total Consolidated Balance", 20, 50);
  
  doc.setFontSize(16);
  doc.setTextColor(0, 168, 107); // Zavo Green #00a86b
  doc.text(formatCurrency(netWorth, currency), 20, 59);
  
  doc.setFontSize(9);
  doc.setFont("Helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text(`Aggregated across ${accounts?.length || 5} connected accounts & mobile wallets`, 20, 66);
  
  // Connected Accounts summary
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text("Connected Accounts & Wallets", 20, 78);
  
  let accY = 85;
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  
  (accounts || []).forEach(acc => {
    doc.text(`${acc.name} (${acc.type}): ${formatCurrency(acc.balance, currency)}`, 20, accY);
    accY += 5.5;
  });

  // Zavo Spaces summary
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text("Zavo Spaces Breakdown", 20, accY + 6);
  
  let spaceY = accY + 13;
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  
  (spaces || []).forEach(sp => {
    const pct = sp.target > 0 ? Math.round((sp.balance / sp.target) * 100) : 0;
    doc.text(`${sp.name}: ${formatCurrency(sp.balance, currency)} / ${formatCurrency(sp.target, currency)} (${pct}%)`, 20, spaceY);
    spaceY += 5.5;
  });
  
  // Recent Activity Ledger
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text("Recent Activity Ledger", 20, spaceY + 8);
  
  let txY = spaceY + 16;
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text("Date", 20, txY);
  doc.text("Description", 45, txY);
  doc.text("Category", 115, txY);
  doc.text("Amount", 160, txY);
  
  doc.setLineWidth(0.2);
  doc.line(20, txY + 2, 190, txY + 2);
  txY += 6;
  
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(8.5);
  
  transactions.slice(0, 12).forEach((tx) => {
    if (txY > 265) {
      doc.addPage();
      txY = 20;
    }
    const isExpense = tx.amount < 0;
    const amtStr = formatCurrency(tx.amount, currency, { showPositiveSign: true });
    
    doc.setTextColor(71, 85, 105);
    doc.text(tx.date, 20, txY);
    
    const desc = tx.title.length > 28 ? tx.title.substring(0, 25) + "..." : tx.title;
    doc.text(desc, 45, txY);
    doc.text(tx.category || "General", 115, txY);
    
    if (isExpense) {
      doc.setTextColor(225, 29, 72); // Rose Red
    } else {
      doc.setTextColor(0, 168, 107); // Zavo Green
    }
    doc.text(amtStr, 160, txY);
    txY += 5.5;
  });
  
  // Footer notice
  doc.setLineWidth(0.5);
  doc.setDrawColor(226, 232, 240);
  doc.line(20, 275, 190, 275);
  doc.setFont("Helvetica", "italic");
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text("Simulated product demonstration statement generated securely by Zavo client prototype.", 20, 281);
  
  doc.save(`Zavo_Financial_Statement_${currency}.pdf`);
};
