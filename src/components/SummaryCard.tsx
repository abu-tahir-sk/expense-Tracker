import { ReactNode } from 'react';
import clsx from 'clsx';
import { formatCurrency } from '@/lib/formatCurrency';

interface SummaryCardProps {
  title: string;
  amount: number;
  icon: ReactNode;
  trend?: string;
  isPositive?: boolean;
  className?: string;
  currency?: string;
}

export default function SummaryCard({ title, amount, icon, trend, isPositive, className, currency = 'INR' }: SummaryCardProps) {
  const formattedAmount = formatCurrency(amount, currency);


  return (
    <div className={clsx("bg-[#171A21] rounded-xl border border-gray-800 p-6 shadow-sm", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-400">{title}</h3>
        <div className="w-10 h-10 rounded-full bg-[#252A36] flex items-center justify-center text-gray-300">
          {icon}
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <h2 className="text-3xl font-bold text-white">{formattedAmount}</h2>
      </div>
      {trend && (
        <div className="mt-2 text-xs flex items-center gap-1">
          <span className={isPositive ? "text-emerald-400" : "text-red-400"}>
            {trend}
          </span>
          <span className="text-gray-500">vs last month</span>
        </div>
      )}
    </div>
  );
}
