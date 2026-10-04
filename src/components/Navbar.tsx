'use client';

import { Bell } from 'lucide-react';
import MobileSidebar from './MobileSidebar';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function Navbar() {
  const { data: session } = useSession();

  // Get initials
  const name = session?.user?.name || session?.user?.email || "US";
  const initials = name !== "US" 
    ? name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : "US";

  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-6 bg-[#0F1115]/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-30">
      <div className="flex items-center gap-4 md:hidden">
        <MobileSidebar />
        <Link href="/" className="font-bold text-xl text-[#A3E635]">Spendly</Link>
      </div>
      
      <div className="hidden md:block">
        <h1 className="text-lg font-medium text-white">Dashboard</h1>
      </div>

      <div className="flex items-center gap-4 relative">
        <button className="relative text-gray-300 hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#A3E635] rounded-full"></span>
        </button>
        
        <Link 
          href="/settings"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          title="Profile / Settings"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#A3E635] to-emerald-500 border-2 border-gray-800 flex items-center justify-center text-xs font-bold text-black">
            {initials}
          </div>
        </Link>
      </div>
    </header>
  );
}
