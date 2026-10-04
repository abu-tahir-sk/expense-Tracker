"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center bg-[#171A21] border border-gray-800 rounded-xl">
      <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
        <AlertCircle className="w-8 h-8 text-red-500" />
      </div>
      <h2 className="text-xl font-bold text-white mb-2">Something went wrong!</h2>
      <p className="text-gray-400 mb-6 max-w-md">
        We encountered an error while loading your dashboard data. Please try again.
      </p>
      <button
        onClick={() => reset()}
        className="bg-[#252A36] hover:bg-gray-700 text-white px-6 py-2 rounded-md font-medium transition-colors border border-gray-700"
      >
        Try again
      </button>
    </div>
  );
}
