"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Save, User, Mail, ShieldAlert, Moon, Sun } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SettingsClient({ 
  user 
}: { 
  user: { name: string | null, email: string, currency: string }
}) {
  const router = useRouter();
  const [name, setName] = useState(user.name || "");
  const [currency, setCurrency] = useState(user.currency || "INR");
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, currency }),
      });
      
      if (res.ok) {
        toast.success("Profile updated successfully!");
        router.refresh();
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    if (newTheme === "light") {
      document.documentElement.classList.add("theme-light");
      toast("Light mode is in Beta. Some components might still be dark.", { icon: "⚠️" });
    } else {
      document.documentElement.classList.remove("theme-light");
    }
  };

  const handleDeleteAccount = () => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="font-semibold text-white text-sm">Are you ABSOLUTELY sure? This will delete all your data and cannot be undone.</p>
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
              proceedWithDeleteAccount();
            }}
            className="bg-red-500 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-red-600 transition"
          >
            Yes, Delete Account
          </button>
        </div>
      </div>
    ), { duration: Infinity, style: { background: "#252A36", color: "#fff", border: "1px solid #374151" } });
  };

  const proceedWithDeleteAccount = async () => {

    try {
      const res = await fetch("/api/user", {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Account deleted successfully");
        signOut({ callbackUrl: "/register" });
      } else {
        toast.error("Failed to delete account");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      {/* Profile Section */}
      <div className="bg-[#171A21] border border-gray-800 rounded-xl p-6 transition-colors">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-6">
          <User className="w-5 h-5 text-[#A3E635]" />
          Profile Information
        </h3>
        
        <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-md">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-5 h-5 text-gray-500" />
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full pl-10 px-4 py-2 bg-[#252A36] border border-gray-700 rounded-md text-gray-500 cursor-not-allowed"
              />
            </div>
            <p className="text-xs text-gray-500">Email cannot be changed.</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Display Name</label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full pl-10 px-4 py-2 bg-[#252A36] border border-gray-700 rounded-md text-white focus:outline-none focus:border-[#A3E635] focus:ring-1 focus:ring-[#A3E635]"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading || (name === (user.name || "") && currency === user.currency)}
            className="flex items-center gap-2 bg-[#A3E635] text-black px-4 py-2 rounded-md font-semibold hover:bg-[#86c924] disabled:opacity-50 transition-colors"
          >
            <Save className="w-4 h-4" />
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>

      {/* Preferences Section */}
      <div className="bg-[#171A21] border border-gray-800 rounded-xl p-6 transition-colors">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-6">
          Preferences
        </h3>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-white">Currency</h4>
              <p className="text-sm text-gray-400 mt-1">Select your preferred currency for transactions.</p>
            </div>
            <select 
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="px-3 py-1.5 bg-[#252A36] border border-gray-700 rounded-md text-white font-medium focus:outline-none focus:border-[#A3E635]"
            >
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="BDT">BDT (৳)</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t border-gray-800">
            <div>
              <h4 className="font-medium text-white">Theme</h4>
              <p className="text-sm text-gray-400 mt-1">Choose between dark and light mode.</p>
            </div>
            <div className="flex items-center gap-2 bg-[#252A36] p-1 rounded-lg border border-gray-700">
              <button
                onClick={() => handleThemeChange("light")}
                className={`p-2 rounded-md flex items-center justify-center transition-colors ${
                  theme === "light" ? "bg-[#171A21] text-[#A3E635] shadow-sm" : "text-gray-400 hover:text-white"
                }`}
              >
                <Sun className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleThemeChange("dark")}
                className={`p-2 rounded-md flex items-center justify-center transition-colors ${
                  theme === "dark" ? "bg-[#171A21] text-[#A3E635] shadow-sm" : "text-gray-400 hover:text-white"
                }`}
              >
                <Moon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-[#171A21] border border-red-900/50 rounded-xl p-6 transition-colors">
        <h3 className="text-lg font-semibold text-red-400 flex items-center gap-2 mb-4">
          <ShieldAlert className="w-5 h-5" />
          Danger Zone
        </h3>
        <p className="text-sm text-gray-400 mb-4">
          Once you delete your account, there is no going back. All your transactions, budgets, and data will be permanently wiped.
        </p>
        <button 
          onClick={handleDeleteAccount}
          className="bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-2 rounded-md font-medium hover:bg-red-500/20 transition-colors"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}
