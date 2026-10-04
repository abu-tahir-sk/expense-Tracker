"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0F1115] flex flex-col items-center justify-center p-4">
      <div className="bg-[#171A21] p-8 rounded-2xl border border-gray-800 w-full max-w-md shadow-xl text-center">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Application Error</h1>
        <p className="text-gray-400 mb-8">
          An unexpected error occurred. We have been notified and are looking into it.
        </p>
        
        <div className="flex flex-col gap-3">
          <button 
            onClick={() => reset()}
            className="w-full bg-[#A3E635] text-black font-bold py-3 rounded-md hover:bg-[#86c924] transition-colors"
          >
            Try Again
          </button>
          <Link 
            href="/dashboard"
            className="w-full bg-[#252A36] text-white font-medium py-3 rounded-md hover:bg-gray-700 transition-colors border border-gray-700"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
