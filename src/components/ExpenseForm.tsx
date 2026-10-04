"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ExpenseForm({ 
  defaultType = "expense",
  initialData
}: { 
  defaultType?: "income" | "expense",
  initialData?: any 
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    amount: initialData?.amount?.toString() || "",
    type: initialData?.type || defaultType,
    category: initialData?.category || "",
    date: initialData?.date ? new Date(initialData.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
    paymentMethod: initialData?.paymentMethod || "UPI",
    description: initialData?.description || "",
    receiptUrl: initialData?.receiptUrl || "",
    isRecurring: initialData?.isRecurring || false,
    recurrenceInterval: initialData?.recurrenceInterval || "monthly",
  });
  const [uploading, setUploading] = useState(false);

  const categories = {
    expense: ["Food", "Transport", "Shopping", "Bills", "Education", "Health", "Entertainment", "Travel", "Other"],
    income: ["Salary", "Freelance", "Business", "Investment", "Bonus", "Gift", "Other"],
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const data = new FormData();
    data.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });

      if (res.ok) {
        const json = await res.json();
        setFormData((prev) => ({ ...prev, receiptUrl: json.url }));
        toast.success("Receipt uploaded successfully!");
      } else {
        const errorData = await res.json().catch(() => ({}));
        toast.error(errorData.error || "Failed to upload receipt.");
      }
    } catch (error) {
      toast.error("Something went wrong during upload.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const url = initialData ? `/api/transactions/${initialData.id}` : "/api/transactions";
      const method = initialData ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success(initialData ? "Transaction updated!" : "Transaction added!");
        router.push("/transactions");
        router.refresh(); // Refresh to show new data
      } else {
        toast.error("Failed to save transaction.");
      }
    } catch (error) {
      toast.error("Something went wrong.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Transaction Type</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="type"
                value="expense"
                checked={formData.type === "expense"}
                onChange={handleChange}
                className="w-4 h-4 text-[#A3E635] bg-gray-700 border-gray-600 focus:ring-[#A3E635]"
              />
              <span className="text-gray-300">Expense</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="type"
                value="income"
                checked={formData.type === "income"}
                onChange={handleChange}
                className="w-4 h-4 text-[#A3E635] bg-gray-700 border-gray-600 focus:ring-[#A3E635]"
              />
              <span className="text-gray-300">Income</span>
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="date" className="text-sm font-medium text-gray-300">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-[#252A36] border border-gray-700 rounded-md text-white focus:outline-none focus:border-[#A3E635] focus:ring-1 focus:ring-[#A3E635]"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label htmlFor="title" className="text-sm font-medium text-gray-300">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Grocery Shopping"
            required
            className="w-full px-4 py-2 bg-[#252A36] border border-gray-700 rounded-md text-white focus:outline-none focus:border-[#A3E635] focus:ring-1 focus:ring-[#A3E635]"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="amount" className="text-sm font-medium text-gray-300">Amount (₹)</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            min="0.01"
            step="0.01"
            required
            className="w-full px-4 py-2 bg-[#252A36] border border-gray-700 rounded-md text-white focus:outline-none focus:border-[#A3E635] focus:ring-1 focus:ring-[#A3E635]"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="category" className="text-sm font-medium text-gray-300">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-[#252A36] border border-gray-700 rounded-md text-white focus:outline-none focus:border-[#A3E635] focus:ring-1 focus:ring-[#A3E635]"
          >
            <option value="" disabled>Select a category</option>
            {categories[formData.type as keyof typeof categories].map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="paymentMethod" className="text-sm font-medium text-gray-300">Payment Method</label>
          <select
            id="paymentMethod"
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-[#252A36] border border-gray-700 rounded-md text-white focus:outline-none focus:border-[#A3E635] focus:ring-1 focus:ring-[#A3E635]"
          >
            <option value="Cash">Cash</option>
            <option value="UPI">UPI</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Debit Card">Debit Card</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        <div className="space-y-2 md:col-span-2">
          <label htmlFor="description" className="text-sm font-medium text-gray-300">Description (Optional)</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 bg-[#252A36] border border-gray-700 rounded-md text-white focus:outline-none focus:border-[#A3E635] focus:ring-1 focus:ring-[#A3E635]"
          />
        </div>

        <div className="space-y-2 md:col-span-2 border-t border-gray-800 pt-6 mt-2">
          <h3 className="text-lg font-medium text-white mb-4">Advanced Settings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Receipt Image (Optional)</label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#A3E635]/10 file:text-[#A3E635] hover:file:bg-[#A3E635]/20 cursor-pointer disabled:opacity-50"
                />
              </div>
              {formData.receiptUrl && (
                <p className="text-xs text-[#A3E635] mt-1">Receipt attached successfully!</p>
              )}
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="isRecurring"
                  checked={formData.isRecurring}
                  onChange={handleChange}
                  className="w-5 h-5 text-[#A3E635] bg-gray-700 border-gray-600 rounded focus:ring-[#A3E635]"
                />
                <span className="text-sm font-medium text-gray-300">Recurring Transaction</span>
              </label>

              {formData.isRecurring && (
                <div className="mt-2">
                  <label htmlFor="recurrenceInterval" className="text-xs text-gray-400 block mb-1">Interval</label>
                  <select
                    id="recurrenceInterval"
                    name="recurrenceInterval"
                    value={formData.recurrenceInterval}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-[#252A36] border border-gray-700 rounded-md text-white focus:outline-none focus:border-[#A3E635] focus:ring-1 focus:ring-[#A3E635]"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 rounded-md text-gray-300 hover:text-white mr-4 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="bg-[#A3E635] hover:bg-[#86c924] text-black px-8 py-2 rounded-md font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : "Save Transaction"}
        </button>
      </div>
    </form>
  );
}
