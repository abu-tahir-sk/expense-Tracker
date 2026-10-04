"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import EmptyState from "@/components/EmptyState";
import { formatCurrency } from "@/lib/formatCurrency";

type Budget = {
  id: string;
  category: string;
  amount: number;
  spent: number;
};

export default function BudgetClient({ 
  initialBudgets, 
  availableCategories,
  month,
  year,
  currency = "INR"
}: { 
  initialBudgets: Budget[],
  availableCategories: string[],
  month: number,
  year: number,
  currency?: string
}) {
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState(availableCategories[0] || "");
  const [amount, setAmount] = useState("");

  const handleAddBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/budgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, amount, month, year }),
      });
      
      if (res.ok) {
        toast.success("Budget added!");
        setIsAdding(false);
        setAmount("");
        router.refresh();
      } else {
        toast.error("Failed to add budget");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="font-semibold text-white text-sm">Are you sure you want to delete this budget?</p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="bg-gray-700 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              proceedWithDelete(id);
            }}
            className="bg-red-500 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-red-600 transition"
          >
            Delete
          </button>
        </div>
      </div>
    ), { duration: Infinity, style: { background: "#252A36", color: "#fff", border: "1px solid #374151" } });
  };

  const proceedWithDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/budgets/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Budget deleted!");
        router.refresh();
      } else {
        toast.error("Failed to delete budget");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="space-y-6">
      {availableCategories.length > 0 && !isAdding && (
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 text-sm font-medium text-[#A3E635] hover:text-[#86c924]"
        >
          <Plus className="w-4 h-4" /> Add Budget
        </button>
      )}

      {isAdding && (
        <form onSubmit={handleAddBudget} className="bg-[#171A21] p-4 rounded-xl border border-gray-800 flex gap-4 items-end">
          <div className="flex-1 space-y-2">
            <label className="text-xs font-medium text-gray-400">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full px-3 py-2 bg-[#252A36] border border-gray-700 rounded-md text-white focus:outline-none focus:border-[#A3E635]"
            >
              <option value="" disabled>Select category</option>
              {availableCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div className="flex-1 space-y-2">
            <label className="text-xs font-medium text-gray-400">Budget Amount (₹)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              min="1"
              step="1"
              placeholder="e.g. 5000"
              className="w-full px-3 py-2 bg-[#252A36] border border-gray-700 rounded-md text-white focus:outline-none focus:border-[#A3E635]"
            />
          </div>
          <div className="flex gap-2 pb-0.5">
            <button 
              type="button" 
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 text-gray-400 hover:text-white"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="bg-[#A3E635] text-black px-4 py-2 rounded-md font-semibold hover:bg-[#86c924] disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add"}
            </button>
          </div>
        </form>
      )}

      {initialBudgets.length === 0 ? (
        <EmptyState message="No budgets set for this month" actionLink="" actionText="" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {initialBudgets.map(budget => {
            const percentage = Math.min((budget.spent / budget.amount) * 100, 100);
            const isOverBudget = budget.spent > budget.amount;
            
            return (
              <div key={budget.id} className="bg-[#171A21] border border-gray-800 rounded-xl p-5 group relative">
                <button 
                  onClick={() => handleDelete(budget.id)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <h3 className="font-semibold text-white">{budget.category}</h3>
                    <p className="text-sm text-gray-400 mt-1">
                      {formatCurrency(budget.spent, currency)} 
                      <span className="text-gray-600 mx-1">/</span> 
                      {formatCurrency(budget.amount, currency)}
                    </p>
                  </div>
                  <div className="text-sm font-medium">
                    <span className={isOverBudget ? "text-red-400" : "text-[#A3E635]"}>
                      {percentage.toFixed(0)}%
                    </span>
                  </div>
                </div>
                
                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all ${isOverBudget ? "bg-red-400" : percentage > 85 ? "bg-orange-400" : "bg-[#A3E635]"}`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                {isOverBudget && (
                  <p className="text-xs text-red-400 mt-3 text-center">
                    You've exceeded your budget by {formatCurrency(budget.spent - budget.amount, currency)}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
