"use client";

import { useState } from "react";
import { Menu, X, LayoutDashboard, Receipt, TrendingUp, Settings, Target, BarChart2, Bot } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "./LogoutButton";

export default function MobileSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="md:hidden">
      <button 
        onClick={() => setIsOpen(true)}
        className="text-gray-300 hover:text-white"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed top-0 left-0 h-screen w-64 bg-[#171A21] text-white border-r border-gray-800 z-50 transform transition-transform duration-300 flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-6 border-b border-gray-800">
          <div className="flex items-center gap-2 font-bold text-xl text-[#A3E635]">
            <TrendingUp className="w-6 h-6" />
            <span>Spendly</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-3">
            <Link 
              href="/dashboard" 
              onClick={() => setIsOpen(false)}
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
              onClick={() => setIsOpen(false)}
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
              onClick={() => setIsOpen(false)}
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
              onClick={() => setIsOpen(false)}
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
              onClick={() => setIsOpen(false)}
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
              onClick={() => setIsOpen(false)}
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
    </div>
  );
}
