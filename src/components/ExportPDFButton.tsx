"use client";

import { FileDown } from "lucide-react";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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

import { formatCurrency } from "@/lib/formatCurrency";

export default function ExportPDFButton({ transactions, currency = "INR" }: { transactions: Transaction[], currency?: string }) {
  const handleExport = () => {
    if (transactions.length === 0) {
      toast.error("No transactions to export");
      return;
    }

    try {
      const doc = new jsPDF();
      
      // Title
      doc.setFontSize(20);
      doc.text("Spendly - Transactions Report", 14, 22);
      
      // Subtitle with date
      doc.setFontSize(11);
      doc.setTextColor(100);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

      // Data formatting
      const tableData = transactions.map(t => [
        t.date.toLocaleDateString(),
        t.title,
        t.category,
        t.type === 'income' ? 'Income' : 'Expense',
        formatCurrency(t.amount, currency),
        t.paymentMethod || "-"
      ]);

      autoTable(doc, {
        head: [["Date", "Title", "Category", "Type", "Amount", "Method"]],
        body: tableData,
        startY: 40,
        theme: "striped",
        headStyles: { fillColor: [163, 230, 53], textColor: [0, 0, 0] }, // #A3E635 header
        styles: { fontSize: 10, cellPadding: 3 },
        columnStyles: {
          4: { halign: 'right' } // Amount right aligned
        },
      });

      doc.save(`spendly_transactions_${new Date().toISOString().split("T")[0]}.pdf`);
      toast.success("PDF Exported successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to export PDF");
    }
  };

  return (
    <button 
      onClick={handleExport}
      className="flex items-center gap-2 bg-[#252A36] text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-gray-700 transition-colors border border-gray-700 shadow-sm"
    >
      <FileDown className="w-4 h-4" />
      Export PDF
    </button>
  );
}
