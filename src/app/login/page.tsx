"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TrendingUp } from "lucide-react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    
    const toastId = toast.loading("Logging in...");
    
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    
    if (result?.error) {
      toast.error("Invalid email or password", { id: toastId });
      setLoading(false);
    } else {
      toast.success("Welcome back!", { id: toastId });
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1115] flex flex-col items-center justify-center p-4">
      <Link href="/" className="flex items-center gap-2 font-bold text-2xl text-[#A3E635] mb-8">
        <TrendingUp className="w-8 h-8" />
        <span>Spendly</span>
      </Link>
      
      <div className="bg-[#171A21] p-8 rounded-2xl border border-gray-800 w-full max-w-md shadow-xl">
        <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
        <p className="text-gray-400 mb-6">Log in to your account to continue</p>
        

        
        <form onSubmit={handleSubmit} className="space-y-4">
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
              className="w-full px-4 py-2 bg-[#252A36] border border-gray-700 rounded-md text-white focus:outline-none focus:border-[#A3E635] focus:ring-1 focus:ring-[#A3E635]"
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#A3E635] text-black font-bold py-3 rounded-md hover:bg-[#86c924] transition-colors mt-2 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        
        <p className="text-gray-400 text-center text-sm mt-6">
          Don't have an account? <Link href="/register" className="text-[#A3E635] hover:underline">Register here</Link>
        </p>
      </div>
    </div>
  );
}
