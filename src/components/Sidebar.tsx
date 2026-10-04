"use client";

import Link from 'next/link';
import { LayoutDashboard, Receipt, TrendingUp, Settings, Target, BarChart2, Bot } from 'lucide-react';
import { usePathname } from 'next/navigation';
import LogoutButton from './LogoutButton';

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex h-screen w-64 flex-col bg-[#171A21] text-white border-r border-gray-800 fixed left-0 top-0">
      <Link href="/" className="flex h-16 items-center px-6 border-b border-gray-800 hover:bg-[#252A36] transition-colors cursor-pointer">
        <div className="flex items-center gap-2 font-bold text-xl text-[#A3E635]">
          <TrendingUp className="w-6 h-6" />
          <span>Spendly</span>
        </div>
      </Link>
      
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          <Link 
            href="/dashboard" 
            className={`flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-colors ${
              pathname === "/dashboard" 
                ? "bg-[#252A36] text-[#A3E635]" 
                : "text-gray-300 hover:bg-[#252A36] hover:text-white"
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link 
            href="/transactions" 
            className={`flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-colors ${
              pathname === "/transactions" 
                ? "bg-[#252A36] text-[#A3E635]" 
                : "text-gray-300 hover:bg-[#252A36] hover:text-white"
            }`}
          >
            <Receipt className="w-5 h-5" />
            Transactions
          </Link>
          <Link 
            href="/budgets" 
            className={`flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-colors ${
              pathname === "/budgets" 
                ? "bg-[#252A36] text-[#A3E635]" 
                : "text-gray-300 hover:bg-[#252A36] hover:text-white"
            }`}
          >
            <Target className="w-5 h-5" />
            Budgets
          </Link>
          <Link 
            href="/analytics" 
            className={`flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-colors ${
              pathname === "/analytics" 
                ? "bg-[#252A36] text-[#A3E635]" 
                : "text-gray-300 hover:bg-[#252A36] hover:text-white"
            }`}
          >
            <BarChart2 className="w-5 h-5" />
            Analytics
          </Link>
          <Link 
            href="/assistant" 
            className={`flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-colors ${
              pathname === "/assistant" 
                ? "bg-[#252A36] text-[#A3E635]" 
                : "text-gray-300 hover:bg-[#252A36] hover:text-white"
            }`}
          >
            <Bot className="w-5 h-5" />
            AI Assistant
          </Link>
          <Link 
            href="/settings" 
            className={`flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-colors ${
              pathname === "/settings" 
                ? "bg-[#252A36] text-[#A3E635]" 
                : "text-gray-300 hover:bg-[#252A36] hover:text-white"
            }`}
          >
            <Settings className="w-5 h-5" />
            Settings
          </Link>
        </nav>
      </div>
      
      <div className="p-4 border-t border-gray-800">
        <LogoutButton />
      </div>
    </div>
  );
}
