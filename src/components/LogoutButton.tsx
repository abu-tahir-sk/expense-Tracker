"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="flex items-center gap-3 px-3 py-2 w-full rounded-md hover:bg-red-900/30 text-gray-300 hover:text-red-400 transition-colors text-left"
    >
      <LogOut className="w-5 h-5" />
      Logout
    </button>
  );
}
