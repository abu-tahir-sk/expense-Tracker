"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TrendingUp } from "lucide-react";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    const toastId = toast.loading("Creating account...");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (res.ok) {
        toast.success("Account created successfully!", { id: toastId });
        router.push("/login");
      } else {
        const data = await res.json();
        toast.error(data.message || "Registration failed", { id: toastId });
      }
    } catch (err) {
      toast.error("An error occurred. Please try again.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1115] flex flex-col items-center justify-center p-4">
      <Link href="/" className="flex items-center gap-2 font-bold text-2xl text-[#A3E635] mb-8">
        <TrendingUp className="w-8 h-8" />
        <span>Spendly</span>
      </Link>
      
      <div className="bg-[#171A21] p-8 rounded-2xl border border-gray-800 w-full max-w-md shadow-xl">
        <h1 className="text-2xl font-bold text-white mb-2">Create an Account</h1>
        <p className="text-gray-400 mb-6">Join Spendly to manage your finances</p>
        

        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300" htmlFor="name">Name</label>
            <input 
              id="name" 
              name="name" 
              type="text" 
              required 
              className="w-full px-4 py-2 bg-[#252A36] border border-gray-700 rounded-md text-white focus:outline-none focus:border-[#A3E635] focus:ring-1 focus:ring-[#A3E635]"
              placeholder="John Doe"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300" htmlFor="email">Email</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              required 
              className="w-full px-4 py-2 bg-[#252A36] border border-gray-700 rounded-md text-white focus:outline-none focus:border-[#A3E635] focus:ring-1 focus:ring-[#A3E635]"
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300" htmlFor="password">Password</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              required 
              minLength={6}
              className="w-full px-4 py-2 bg-[#252A36] border border-gray-700 rounded-md text-white focus:outline-none focus:border-[#A3E635] focus:ring-1 focus:ring-[#A3E635]"
              placeholder="••••••••"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300" htmlFor="confirmPassword">Confirm Password</label>
            <input 
              id="confirmPassword" 
              name="confirmPassword" 
              type="password" 
              required 
              minLength={6}
              className="w-full px-4 py-2 bg-[#252A36] border border-gray-700 rounded-md text-white focus:outline-none focus:border-[#A3E635] focus:ring-1 focus:ring-[#A3E635]"
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#A3E635] text-black font-bold py-3 rounded-md hover:bg-[#86c924] transition-colors mt-2 disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>
        
        <p className="text-gray-400 text-center text-sm mt-6">
          Already have an account? <Link href="/login" className="text-[#A3E635] hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
