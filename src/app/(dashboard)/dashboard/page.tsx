import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ArrowDownRight, ArrowUpRight, Wallet } from "lucide-react";
import SummaryCard from "@/components/SummaryCard";
import TransactionActions from "@/components/TransactionActions";
import Link from "next/link";
import DashboardCharts from "@/components/DashboardCharts";
import { formatCurrency } from "@/lib/formatCurrency";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { currency: true, name: true }
  });

  const currency = user?.currency || "INR";

  // Fetch transactions
  const transactions = await prisma.transaction.findMany({
    where: { userId: session.user.id },
    orderBy: { date: 'desc' },
  });

  // Calculate summaries
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Welcome back, {user?.name?.split(' ')[0] || 'User'}!</h2>
        <p className="text-gray-400 text-sm mt-1">Here's what's happening with your finances today.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard 
          title="Total Balance" 
          amount={balance} 
          icon={<Wallet className="w-5 h-5" />} 
          trend="+2.5%"
          isPositive={true}
          currency={currency}
        />
        <SummaryCard 
          title="Total Income" 
          amount={totalIncome} 
          icon={<ArrowUpRight className="w-5 h-5 text-emerald-400" />} 
          trend="+12.5%"
          isPositive={true}
          currency={currency}
        />
        <SummaryCard 
          title="Total Expense" 
          amount={totalExpense} 
          icon={<ArrowDownRight className="w-5 h-5 text-red-400" />} 
          trend="-4.2%"
          isPositive={true}
          currency={currency}
        />
      </div>

      <DashboardCharts transactions={transactions} />

      {/* Recent Transactions */}
      <div className="bg-[#171A21] border border-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
          <Link href="/transactions" className="text-sm text-[#A3E635] hover:underline font-medium">
            View All
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          {recentTransactions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 mb-4">No transactions found.</p>
              <Link href="/transactions/new?type=expense" className="bg-[#A3E635] text-black px-4 py-2 rounded-md font-semibold hover:bg-[#86c924] transition-colors">
                Add Your First Expense
              </Link>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-800 text-sm font-medium text-gray-400">
                  <th className="pb-3 px-4">Date</th>
                  <th className="pb-3 px-4">Title</th>
                  <th className="pb-3 px-4 text-right">Amount</th>
                  <th className="pb-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {recentTransactions.map((t) => (
                  <tr key={t.id} className="border-b border-gray-800/50 hover:bg-[#252A36]/50 transition-colors">
                    <td className="py-3 px-4 text-gray-300">
                      {t.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </td>
                    <td className="py-3 px-4 font-medium text-white flex items-center gap-2">
                      {t.title}
                      {t.receiptUrl && (
                        <a href={t.receiptUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#A3E635]" title="View Receipt">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                        </a>
                      )}
                      {t.isRecurring && (
                        <span className="text-[#A3E635]" title={`Recurring ${t.recurrenceInterval}`}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 21v-5h5"/></svg>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-white">
                      <span className={t.type === 'income' ? 'text-emerald-400' : 'text-red-400'}>
                        {t.type === 'income' ? '+' : '-'}
                      </span>
                      {formatCurrency(t.amount, currency)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <TransactionActions transactionId={t.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
