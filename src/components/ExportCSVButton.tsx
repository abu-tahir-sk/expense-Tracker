"use client";

import { Download } from "lucide-react";
import toast from "react-hot-toast";

type Transaction = {
  id: string;
  title: string;
  amount: number;
  type: string;
  category: string;
  date: Date;
  paymentMethod: string | null;
  description: string | null;
};

export default function ExportCSVButton({ transactions, currency = "INR" }: { transactions: Transaction[], currency?: string }) {
  const handleExport = () => {
    if (transactions.length === 0) {
      toast.error("No transactions to export");
      return;
    }

    try {
      const headers = ["Date", "Title", "Type", "Category", `Amount (${currency})`, "Payment Method", "Description"];
      const rows = transactions.map(t => [
        t.date.toISOString().split("T")[0],
        `"${t.title.replace(/"/g, '""')}"`, // escape quotes
        t.type,
        t.category,
        t.amount.toString(),
        t.paymentMethod || "N/A",
        `"${(t.description || "").replace(/"/g, '""')}"`
      ]);

      const csvContent = [
        headers.join(","),
        ...rows.map(r => r.join(","))
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `spendly_transactions_${new Date().toISOString().split("T")[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Exported successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to export data");
    }
  };

  return (
    <button 
      onClick={handleExport}
      className="flex items-center gap-2 bg-[#252A36] text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-gray-700 transition-colors border border-gray-700 shadow-sm"
    >
      <Download className="w-4 h-4" />
      Export CSV
    </button>
  );
}
