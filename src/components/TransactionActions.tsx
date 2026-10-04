"use client";

import { Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import toast from "react-hot-toast";

export default function TransactionActions({ transactionId }: { transactionId: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="font-semibold text-white text-sm">Are you sure you want to delete this transaction?</p>
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
              proceedWithDelete();
            }}
            className="bg-red-500 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-red-600 transition"
          >
            Delete
          </button>
        </div>
      </div>
    ), { duration: Infinity, style: { background: "#252A36", color: "#fff", border: "1px solid #374151" } });
  };

  const proceedWithDelete = async () => {
    setIsDeleting(true);
    const loadingToast = toast.loading("Deleting...");
    try {
      const res = await fetch(`/api/transactions/${transactionId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Transaction deleted", { id: loadingToast });
        router.refresh(); // Refresh the server component to get updated data
      } else {
        toast.error("Failed to delete transaction.", { id: loadingToast });
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.", { id: loadingToast });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = () => {
    // For now, redirect to a non-existent edit page, or we can handle it via modal.
    // Assuming edit page will be at /transactions/[id]/edit
    router.push(`/transactions/${transactionId}/edit`);
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <button 
        onClick={handleEdit}
        disabled={isDeleting}
        className="p-1.5 text-gray-400 hover:text-white rounded hover:bg-gray-700 transition-colors disabled:opacity-50"
      >
        <Edit className="w-4 h-4" />
      </button>
      <button 
        onClick={handleDelete}
        disabled={isDeleting}
        className="p-1.5 text-gray-400 hover:text-red-400 rounded hover:bg-gray-700 transition-colors disabled:opacity-50"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
