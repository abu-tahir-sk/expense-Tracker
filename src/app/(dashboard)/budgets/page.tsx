import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import BudgetClient from "./BudgetClient";

export default async function BudgetsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { currency: true }
  });

  const currency = user?.currency || "INR";

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  // Fetch budgets for current month
  const budgets = await prisma.budget.findMany({
    where: { 
      userId: session.user.id,
      month: currentMonth,
      year: currentYear
    }
  });

  // Fetch expenses for current month to calculate progress
  const expenses = await prisma.transaction.findMany({
    where: {
      userId: session.user.id,
      type: "expense",
      date: {
        gte: new Date(currentYear, currentMonth, 1),
        lt: new Date(currentYear, currentMonth + 1, 1),
      }
    }
  });

  const spentByCategory = expenses.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);

  const budgetsWithProgress = budgets.map(b => ({
    ...b,
    spent: spentByCategory[b.category] || 0
  }));

  const expenseCategories = ["Food", "Transport", "Shopping", "Bills", "Education", "Health", "Entertainment", "Travel", "Other"];
  const availableCategories = expenseCategories.filter(
    cat => !budgets.some(b => b.category === cat)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Budgets</h2>
          <p className="text-gray-400 text-sm mt-1">Manage your spending limits for {new Date().toLocaleString('default', { month: 'long' })} {currentYear}.</p>
        </div>
      </div>
      
      <BudgetClient 
        initialBudgets={budgetsWithProgress} 
        availableCategories={availableCategories} 
        month={currentMonth} 
        year={currentYear} 
        currency={currency}
      />
    </div>
  );
}
