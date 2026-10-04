"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useCallback, useState, useRef } from "react";

export default function TransactionFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [q, setQ] = useState(searchParams.get("q") || "");
  const [type, setType] = useState(searchParams.get("type") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQ(val);
    
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(() => {
      router.push(`?${createQueryString("q", val)}`);
    }, 500);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setType(val);
    router.push(`?${createQueryString("type", val)}`);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setCategory(val);
    router.push(`?${createQueryString("category", val)}`);
  };

  const categories = [
    "Food", "Transport", "Shopping", "Bills", "Education", "Health", 
    "Entertainment", "Salary", "Freelance", "Bonus", "Investment", "Other"
  ];

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search transactions..."
          value={q}
          onChange={handleSearchChange}
          className="w-full pl-10 pr-4 py-2 bg-[#252A36] border border-gray-700 rounded-md text-white focus:outline-none focus:border-[#A3E635] focus:ring-1 focus:ring-[#A3E635]"
        />
      </div>
      
      <div className="flex gap-4">
        <select
          value={type}
          onChange={handleTypeChange}
          className="px-4 py-2 bg-[#252A36] border border-gray-700 rounded-md text-white focus:outline-none focus:border-[#A3E635]"
        >
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        
        <select
          value={category}
          onChange={handleCategoryChange}
          className="px-4 py-2 bg-[#252A36] border border-gray-700 rounded-md text-white focus:outline-none focus:border-[#A3E635]"
        >
          <option value="">All Categories</option>
          {categories.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
