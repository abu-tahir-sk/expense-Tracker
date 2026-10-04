"use client";

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ExpenseForm from '@/components/ExpenseForm';

export default function NewTransactionPage() {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get('type');
  const defaultType = typeParam === 'income' ? 'income' : 'expense';

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard" className="p-2 rounded-full hover:bg-[#252A36] text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h2 className="text-2xl font-bold text-white">Add New Transaction</h2>
      </div>
      
      <div className="bg-[#171A21] border border-gray-800 rounded-xl p-6 shadow-sm">
        <ExpenseForm defaultType={defaultType} />
      </div>
    </div>
  );
}
