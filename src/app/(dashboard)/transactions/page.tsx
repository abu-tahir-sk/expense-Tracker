import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import TransactionActions from "@/components/TransactionActions";
import TransactionFilters from "@/components/TransactionFilters";
import EmptyState from "@/components/EmptyState";
import ExportCSVButton from "@/components/ExportCSVButton";
import ExportPDFButton from "@/components/ExportPDFButton";
import { formatCurrency } from "@/lib/formatCurrency";

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string; category?: string; page?: string }>;
}) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { currency: true }
  });

  const currency = user?.currency || "INR";

  // Build Prisma where clause
  const where: any = { userId: session.user.id };
  const params = await searchParams;
  
  if (params.q) {
    where.title = {
      contains: params.q,
      mode: 'insensitive' // Requires Prisma Postgres, works nicely
    };
  }
  
  if (params.type) {
    where.type = params.type;
  }
  
  if (params.category) {
    where.category = params.category;
  }

  const page = parseInt(params.page || "1");
  const limit = 10;
  const skip = (page - 1) * limit;

  const [transactions, totalCount] = await Promise.all([
    prisma.transaction.findMany({
      where,
      orderBy: { date: 'desc' },
      skip,
      take: limit,
    }),
    prisma.transaction.count({ where })
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 rounded-full hover:bg-[#252A36] text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">All Transactions</h2>
            <p className="text-gray-400 text-sm mt-1">View and manage your transaction history.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <ExportCSVButton transactions={transactions} currency={currency} />
          <ExportPDFButton transactions={transactions} currency={currency} />
          <Link href="/transactions/new?type=expense" className="bg-[#A3E635] text-black px-4 py-2 rounded-md text-sm font-semibold hover:bg-[#86c924] transition-colors">
            Add New
          </Link>
        </div>
      </div>

      <TransactionFilters />

      <div className="bg-[#171A21] border border-gray-800 rounded-xl p-6">
        <div className="overflow-x-auto">
          {transactions.length === 0 ? (
            <EmptyState />
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-800 text-sm font-medium text-gray-400">
                  <th className="pb-3 px-4">Date</th>
                  <th className="pb-3 px-4">Title</th>
                  <th className="pb-3 px-4">Category</th>
                  <th className="pb-3 px-4 text-right">Amount</th>
                  <th className="pb-3 px-4 text-center">Type</th>
                  <th className="pb-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {transactions.map((t) => (
                  <tr key={t.id} className="border-b border-gray-800/50 hover:bg-[#252A36]/50 transition-colors">
                    <td className="py-3 px-4 text-gray-300">
                      {t.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
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
                    <td className="py-3 px-4 text-gray-400">{t.category}</td>
                    <td className="py-3 px-4 text-right font-medium text-white">
                      {formatCurrency(t.amount, currency)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {t.type === 'income' ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-400/10 text-emerald-400">Income</span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-400/10 text-red-400">Expense</span>
                      )}
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

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-800 pt-4 mt-4">
            <p className="text-sm text-gray-400">
              Showing {skip + 1} to {Math.min(skip + limit, totalCount)} of {totalCount} transactions
            </p>
            <div className="flex gap-2">
              <Link
                href={`?${new URLSearchParams({ ...(params as any), page: Math.max(page - 1, 1).toString() }).toString()}`}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${page === 1 ? 'bg-gray-800 text-gray-500 pointer-events-none' : 'bg-[#252A36] text-white hover:bg-gray-700'}`}
              >
                Previous
              </Link>
              <Link
                href={`?${new URLSearchParams({ ...(params as any), page: Math.min(page + 1, totalPages).toString() }).toString()}`}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${page === totalPages ? 'bg-gray-800 text-gray-500 pointer-events-none' : 'bg-[#252A36] text-white hover:bg-gray-700'}`}
              >
                Next
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
