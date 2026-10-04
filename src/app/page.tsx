"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  LayoutDashboard,
  PieChart,
  User,
  CreditCard,
  Settings,
  HelpCircle,
  Moon,
  Search,
  Bell,
  Plus,
  Activity,
  ChevronDown,
  TrendingUp,
  Target,
  Bot,
  CheckCircle2,
  Zap,
  Shield,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { useSession } from "next-auth/react";

// FAQ Data
const faqs = [
  {
    question: "How secure is Spendly?",
    answer: "Your security is our top priority. Spendly uses bank-level 256-bit encryption to ensure your data is always safe and completely private. We never sell your data to third parties.",
  },
  {
    question: "Can I connect my bank accounts directly?",
    answer: "Yes! You can securely link your bank accounts and credit cards to automatically sync your transactions in real-time.",
  },
  {
    question: "Is there a mobile app available?",
    answer: "Absolutely. Spendly is fully responsive on mobile browsers, and our dedicated iOS and Android apps will be launching very soon.",
  },
  {
    question: "How does the AI Assistant work?",
    answer: "Our AI Assistant analyzes your spending patterns and provides personalized tips on how to save money, stick to your budgets, and reach your financial goals faster.",
  },
];

export default function Home() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const { data: session } = useSession();

  return (
    <div className="flex flex-col min-h-screen bg-[#0F1115] text-white font-sans overflow-x-hidden relative selection:bg-[#A3E635] selection:text-black">
      {/* Background Glowing Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[30vw] h-[30vw] rounded-full bg-[#A3E635]/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[25vw] h-[25vw] rounded-full bg-[#A3E635]/5 blur-[100px] pointer-events-none" />
      <div className="absolute top-[70%] left-1/2 -translate-x-1/2 w-[50vw] h-[20vw] rounded-[100%] bg-[#A3E635]/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[40vw] h-[40vw] rounded-[100%] bg-[#A3E635]/5 blur-[150px] pointer-events-none" />

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 px-6 py-5 md:px-12 flex items-center justify-between max-w-7xl mx-auto backdrop-blur-md bg-[#0F1115]/80 border-b border-gray-800"
      >
        <div className="flex items-center gap-2 font-bold text-2xl text-[#A3E635]">
          <TrendingUp className="w-8 h-8" />
          <span className="text-white hidden sm:block">Spendly</span>
        </div>

        <nav className="hidden md:flex items-center gap-10 text-sm font-medium text-gray-300">
          <Link href="#features" className="hover:text-[#A3E635] transition-colors">
            Features
          </Link>
          <Link href="#pricing" className="hover:text-[#A3E635] transition-colors">
            Pricing
          </Link>
          <Link href="#faq" className="hover:text-[#A3E635] transition-colors">
            FAQ
          </Link>
        </nav>

        <div className="flex items-center gap-4 sm:gap-6 text-sm font-semibold">
          {session ? (
            <Link
              href="/dashboard"
              className="bg-[#A3E635] hover:bg-[#86c924] text-black px-4 sm:px-5 py-2.5 rounded-lg transition-all shadow-[0_0_15px_rgba(163,230,53,0.3)] hover:shadow-[0_0_25px_rgba(163,230,53,0.5)] flex items-center gap-2"
            >
              Go to Dashboard <ArrowUpRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-[#A3E635] hover:text-[#86c924] transition-colors">
                Sign In
              </Link>
              <Link
                href="/register"
                className="bg-[#A3E635] hover:bg-[#86c924] text-black px-4 sm:px-5 py-2.5 rounded-lg transition-all shadow-[0_0_15px_rgba(163,230,53,0.3)] hover:shadow-[0_0_25px_rgba(163,230,53,0.5)]"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </motion.header>

      <main className="flex-1 pt-40 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center relative z-10 w-full">
        
        {/* === HERO SECTION === */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-center max-w-4xl mx-auto mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#171A21] border border-gray-800 text-sm font-medium text-gray-300 mb-8 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#A3E635]"></span>
            The #1 Expense Tracking App
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
            Take Control of Your Money
            <br />
            <span className="relative inline-block mt-2">
              <span className="text-[#A3E635] drop-shadow-[0_0_20px_rgba(163,230,53,0.4)]">
                Easily.
              </span>
              <svg
                className="absolute -left-16 top-2 w-14 h-14 text-[#A3E635] transform -rotate-12 opacity-80"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 5l7 7-7 7M5 5l7 7-7 7"
                  style={{ strokeDasharray: "40", strokeDashoffset: "0" }}
                />
              </svg>
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10">
            Stay on top of your finances, track your spending, set savings goals, and reach them faster with smart budgets, clear insights, and simple tools.
          </p>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <Link
              href={session ? "/dashboard" : "/register"}
              className="group flex items-center gap-2 bg-[#A3E635]/10 border border-[#A3E635]/50 text-[#A3E635] px-6 py-3 rounded-xl font-medium text-lg hover:bg-[#A3E635] hover:text-black transition-all"
            >
              {session ? "Go to Dashboard" : "Start Tracking for Free"}
              <ArrowUpRight className="w-5 h-5 group-hover:rotate-45 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Dashboard Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="w-full max-w-5xl rounded-2xl bg-[#0F1115] border border-gray-800 shadow-2xl overflow-hidden mt-8 mb-32"
        >
          <div className="flex items-center px-4 py-3 bg-[#171A21] border-b border-gray-800">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <div className="mx-auto flex items-center bg-[#252A36] px-4 py-1.5 rounded-md text-xs text-gray-400">
              <span className="mr-2">🔒</span> spendly.com/dashboard
            </div>
          </div>

          <div className="flex">
            <div className="w-64 bg-[#171A21] border-r border-gray-800 flex flex-col hidden md:flex">
              <div className="flex h-16 items-center px-6 border-b border-gray-800">
                <div className="flex items-center gap-2 font-bold text-xl text-[#A3E635]">
                  <TrendingUp className="w-6 h-6" />
                  <span className="text-white">Spendly</span>
                </div>
              </div>

              <div className="flex flex-col gap-1 p-3 flex-1">
                <div className="flex items-center gap-3 bg-[#252A36] text-[#A3E635] px-3 py-2 rounded-md font-medium text-sm">
                  <LayoutDashboard className="w-5 h-5" /> Dashboard
                </div>
                <div className="flex items-center gap-3 text-gray-300 px-3 py-2 rounded-md font-medium text-sm">
                  <PieChart className="w-5 h-5" /> Analytics
                </div>
                <div className="flex items-center gap-3 text-gray-300 px-3 py-2 rounded-md font-medium text-sm">
                  <User className="w-5 h-5" /> Account
                </div>
                <div className="flex items-center gap-3 text-gray-300 px-3 py-2 rounded-md font-medium text-sm">
                  <Activity className="w-5 h-5" /> Transactions
                </div>
              </div>
            </div>

            <div className="flex-1 p-6 md:p-8 bg-[#0F1115]">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold">Welcome Back, Alex!</h2>
                </div>
                <div className="flex items-center gap-4 hidden sm:flex">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Search"
                      className="bg-[#171A21] border border-gray-800 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none w-48 text-white"
                      readOnly
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-6 mb-8">
                <div className="flex-1">
                  <p className="text-gray-400 text-sm mb-1">Total Balance</p>
                  <div className="flex items-baseline gap-3">
                    <h3 className="text-3xl md:text-4xl font-bold">$128,345<span className="text-gray-400 text-xl md:text-2xl">.67</span></h3>
                    <span className="text-[#A3E635] text-xs md:text-sm bg-[#A3E635]/10 px-2 py-0.5 rounded-full">+23.49%</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-[#171A21] p-4 rounded-xl border border-gray-800">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-[#A3E635]" />
                    <p className="text-gray-400 text-xs">Monthly Income</p>
                  </div>
                  <p className="text-xl font-bold mb-1">$64,865<span className="text-gray-400 text-sm">.36</span></p>
                </div>
                <div className="bg-[#171A21] p-4 rounded-xl border border-gray-800">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <p className="text-gray-400 text-xs">Monthly Expenses</p>
                  </div>
                  <p className="text-xl font-bold mb-1">$23,647<span className="text-gray-400 text-sm">.52</span></p>
                </div>
                <div className="bg-[#171A21] p-4 rounded-xl border border-gray-800">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <p className="text-gray-400 text-xs">Savings Rate</p>
                  </div>
                  <p className="text-xl font-bold mb-1">$41,218<span className="text-gray-400 text-sm">.24</span></p>
                </div>
              </div>

              <div className="bg-[#171A21] p-5 rounded-xl border border-gray-800 relative overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="font-semibold text-sm">Cashflow</h4>
                </div>
                <div className="h-32 w-full relative">
                    <svg viewBox="0 0 500 150" className="w-full h-full overflow-visible">
                      <line x1="0" y1="150" x2="500" y2="150" stroke="#ffffff10" strokeWidth="1" />
                      <line x1="0" y1="100" x2="500" y2="100" stroke="#ffffff10" strokeWidth="1" />
                      <line x1="0" y1="50" x2="500" y2="50" stroke="#ffffff10" strokeWidth="1" />
                      
                      <path d="M0 130 C 50 120, 100 80, 150 90 C 200 100, 250 20, 300 40 C 350 60, 400 110, 450 100 L 500 80" fill="none" stroke="#A3E635" strokeWidth="3" className="drop-shadow-[0_4px_8px_rgba(163,230,53,0.5)]" />
                      <path d="M0 140 C 50 130, 100 110, 150 120 C 200 130, 250 80, 300 90 C 350 100, 400 130, 450 120 L 500 130" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="4" />
                      <circle cx="250" cy="20" r="4" fill="#171A21" stroke="#A3E635" strokeWidth="2" />
                      <text x="250" y="10" fill="#fff" fontSize="10" textAnchor="middle" fontWeight="bold">$23,647</text>
                    </svg>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* === FEATURES SECTION === */}
        <section id="features" className="w-full pt-16 pb-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything you need to <span className="text-[#A3E635]">succeed</span></h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Spendly combines powerful analytics with intuitive tools to help you manage your wealth without the headache.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-[#171A21] p-8 rounded-2xl border border-gray-800 hover:border-[#A3E635]/50 transition-colors group">
              <div className="w-12 h-12 bg-[#252A36] rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#A3E635]/20 transition-colors">
                <PieChart className="w-6 h-6 text-[#A3E635]" />
              </div>
              <h3 className="text-xl font-bold mb-3">Smart Analytics</h3>
              <p className="text-gray-400 leading-relaxed">Visualize your spending patterns with beautiful, interactive charts. Understand exactly where your money goes every month.</p>
            </div>

            <div className="bg-[#171A21] p-8 rounded-2xl border border-gray-800 hover:border-[#A3E635]/50 transition-colors group">
              <div className="w-12 h-12 bg-[#252A36] rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#A3E635]/20 transition-colors">
                <Target className="w-6 h-6 text-[#A3E635]" />
              </div>
              <h3 className="text-xl font-bold mb-3">Custom Budgets</h3>
              <p className="text-gray-400 leading-relaxed">Set dynamic limits for different categories. Get alerted before you overspend and stay completely on track with your goals.</p>
            </div>

            <div className="bg-[#171A21] p-8 rounded-2xl border border-gray-800 hover:border-[#A3E635]/50 transition-colors group">
              <div className="w-12 h-12 bg-[#252A36] rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#A3E635]/20 transition-colors">
                <Bot className="w-6 h-6 text-[#A3E635]" />
              </div>
              <h3 className="text-xl font-bold mb-3">AI Assistant</h3>
              <p className="text-gray-400 leading-relaxed">Our AI analyzes your transactions to give you personalized financial advice, helping you discover new ways to save money.</p>
            </div>
            
            <div className="bg-[#171A21] p-8 rounded-2xl border border-gray-800 hover:border-[#A3E635]/50 transition-colors group">
              <div className="w-12 h-12 bg-[#252A36] rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#A3E635]/20 transition-colors">
                <Shield className="w-6 h-6 text-[#A3E635]" />
              </div>
              <h3 className="text-xl font-bold mb-3">Bank-grade Security</h3>
              <p className="text-gray-400 leading-relaxed">Your data is encrypted using AES-256 standards. We never sell your personal information or transaction history.</p>
            </div>
            
            <div className="bg-[#171A21] p-8 rounded-2xl border border-gray-800 hover:border-[#A3E635]/50 transition-colors group">
              <div className="w-12 h-12 bg-[#252A36] rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#A3E635]/20 transition-colors">
                <Zap className="w-6 h-6 text-[#A3E635]" />
              </div>
              <h3 className="text-xl font-bold mb-3">Lightning Fast</h3>
              <p className="text-gray-400 leading-relaxed">Built on modern architecture, Spendly loads instantly and syncs your transactions across all your devices in real-time.</p>
            </div>

            <div className="bg-[#171A21] p-8 rounded-2xl border border-gray-800 hover:border-[#A3E635]/50 transition-colors group flex flex-col items-center justify-center text-center">
              <h3 className="text-xl font-bold mb-4">And much more...</h3>
              <Link href="/register" className="text-[#A3E635] flex items-center gap-1 hover:underline">
                Start exploring today <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* === PRICING SECTION === */}
        <section id="pricing" className="w-full pt-16 pb-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Simple, <span className="text-[#A3E635]">transparent</span> pricing</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Start for free, upgrade when you need more power. No hidden fees ever.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Tier */}
            <div className="bg-[#171A21] p-8 rounded-2xl border border-gray-800 flex flex-col">
              <h3 className="text-2xl font-bold mb-2">Basic</h3>
              <p className="text-gray-400 mb-6">Perfect for getting started with tracking.</p>
              <div className="mb-8">
                <span className="text-5xl font-bold">$0</span>
                <span className="text-gray-400">/forever</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-[#A3E635]" /> Manual transaction entry</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-[#A3E635]" /> Up to 3 custom budgets</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-[#A3E635]" /> Basic analytics & charts</li>
                <li className="flex items-center gap-3 text-gray-500"><CheckCircle2 className="w-5 h-5 text-gray-700" /> Bank account syncing</li>
                <li className="flex items-center gap-3 text-gray-500"><CheckCircle2 className="w-5 h-5 text-gray-700" /> AI Assistant insights</li>
              </ul>
              <Link href="/register" className="w-full block text-center py-3 rounded-xl border border-gray-700 hover:bg-[#252A36] transition-colors font-medium">
                Get Started
              </Link>
            </div>

            {/* Pro Tier */}
            <div className="bg-gradient-to-b from-[#1a251c] to-[#171A21] p-8 rounded-2xl border border-[#A3E635]/50 flex flex-col relative transform md:-translate-y-4 shadow-[0_10px_40px_rgba(163,230,53,0.1)]">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#A3E635] text-black px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                Most Popular
              </div>
              <h3 className="text-2xl font-bold mb-2 text-[#A3E635]">Pro</h3>
              <p className="text-gray-400 mb-6">For power users who want complete control.</p>
              <div className="mb-8">
                <span className="text-5xl font-bold">$8</span>
                <span className="text-gray-400">/month</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-[#A3E635]" /> Automatic bank syncing</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-[#A3E635]" /> Unlimited budgets & goals</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-[#A3E635]" /> Advanced AI financial insights</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-[#A3E635]" /> Export data to CSV/PDF</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-[#A3E635]" /> Priority customer support</li>
              </ul>
              <Link href="/register" className="w-full block text-center py-3 rounded-xl bg-[#A3E635] text-black hover:bg-[#86c924] transition-colors font-bold shadow-lg">
                Start 14-Day Free Trial
              </Link>
            </div>
          </div>
        </section>

        {/* === FAQ SECTION === */}
        <section id="faq" className="w-full pt-16 pb-24 border-t border-gray-800">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Frequently Asked <span className="text-[#A3E635]">Questions</span></h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Got questions? We've got answers. If you need anything else, our support team is always here to help.</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="bg-[#171A21] border border-gray-800 rounded-xl overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left font-semibold hover:bg-[#252A36] transition-colors"
                >
                  {faq.question}
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${activeFaq === index ? "rotate-180 text-[#A3E635]" : ""}`} />
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: activeFaq === index ? "auto" : 0, opacity: activeFaq === index ? 1 : 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-5 pt-2 text-gray-400 leading-relaxed">
                    {faq.answer}
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-[#0c0e11] py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 font-bold text-xl text-[#A3E635]">
            <TrendingUp className="w-6 h-6" />
            <span className="text-white">Spendly</span>
          </div>
          
          <div className="flex gap-8 text-sm text-gray-400">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-white transition-colors">Contact Us</Link>
          </div>
          
          <div className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Spendly. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
