"use client";

import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { formatCurrency } from "@/lib/formatCurrency";

type Transaction = {
  id: string;
  amount: number;
  type: string;
  category: string;
  date: Date;
};

const COLORS = ['#A3E635', '#3B82F6', '#EF4444', '#F59E0B', '#8B5CF6', '#EC4899', '#14B8A6'];

export default function AnalyticsClient({ 
  transactions, 
  currency 
}: { 
  transactions: Transaction[], 
  currency: string 
}) {
  const { expensesByCategory, incomeVsExpense } = useMemo(() => {
    // Expense by category
    const expByCategory = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, curr) => {
        acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
        return acc;
      }, {} as Record<string, number>);

    const expensesByCategoryData = Object.entries(expByCategory)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    // Income vs Expense by month (last 6 months)
    const monthlyData: Record<string, { income: number, expense: number }> = {};
    
    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const monthStr = d.toLocaleString('default', { month: 'short', year: '2-digit' });
      monthlyData[monthStr] = { income: 0, expense: 0 };
    }

    transactions.forEach(t => {
      const monthStr = new Date(t.date).toLocaleString('default', { month: 'short', year: '2-digit' });
      if (monthlyData[monthStr]) {
        if (t.type === 'income') {
          monthlyData[monthStr].income += t.amount;
        } else {
          monthlyData[monthStr].expense += t.amount;
        }
      }
    });

    const incomeVsExpenseData = Object.entries(monthlyData).map(([month, data]) => ({
      name: month,
      Income: data.income,
      Expense: data.expense
    }));

    return { 
      expensesByCategory: expensesByCategoryData,
      incomeVsExpense: incomeVsExpenseData
    };
  }, [transactions]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#252A36] border border-gray-700 p-3 rounded-lg shadow-xl">
          <p className="text-white font-medium mb-1">{payload[0].name || payload[0].payload.name}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm font-semibold">
              {entry.name === payload[0].name ? 'Amount' : entry.name}: {formatCurrency(entry.value, currency)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Expense Breakdown */}
      <div className="bg-[#171A21] border border-gray-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold text-white mb-6">Expense Breakdown</h2>
        {expensesByCategory.length > 0 ? (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expensesByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {expensesByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value) => <span className="text-gray-300">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-gray-500">
            No expense data available
          </div>
        )}
      </div>

      {/* Income vs Expense */}
      <div className="bg-[#171A21] border border-gray-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold text-white mb-6">Income vs Expense (6 Months)</h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={incomeVsExpense}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2e39" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="#6b7280" 
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#6b7280"
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value >= 1000 ? (value/1000) + 'k' : value}`}
              />
              <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: '#252A36' }} />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value) => <span className="text-gray-300">{value}</span>}
              />
              <Bar dataKey="Income" fill="#A3E635" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Expense" fill="#EF4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
