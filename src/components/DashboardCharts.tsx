"use client";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend
} from 'recharts';

export default function DashboardCharts({ transactions }: { transactions: any[] }) {
  // Process data for Monthly Expenses Chart
  const monthlyData = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc: any, t) => {
      const month = new Date(t.date).toLocaleString('en-US', { month: 'short' });
      if (!acc[month]) acc[month] = { name: month, total: 0 };
      acc[month].total += t.amount;
      return acc;
    }, {});
    
  // Sort months properly or just use the last few months (simplifying for now by just Object.values)
  const barData = Object.values(monthlyData).reverse();

  // Process data for Category Pie Chart
  const categoryData = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc: any, t) => {
      if (!acc[t.category]) acc[t.category] = { name: t.category, value: 0 };
      acc[t.category].value += t.amount;
      return acc;
    }, {});
    
  const pieData: any[] = Object.values(categoryData);
  
  const COLORS = ['#A3E635', '#38BDF8', '#F87171', '#FBBF24', '#C084FC', '#F472B6', '#34D399', '#94A3B8'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="bg-[#171A21] border border-gray-800 rounded-xl p-6 lg:col-span-2 min-h-[350px]">
        <h3 className="text-lg font-semibold text-white mb-6">Monthly Expenses</h3>
        {barData.length > 0 ? (
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2D323E" vertical={false} />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                <Tooltip 
                  cursor={{ fill: '#252A36' }} 
                  contentStyle={{ backgroundColor: '#252A36', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#A3E635' }}
                />
                <Bar dataKey="total" fill="#A3E635" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex items-center justify-center h-[250px] text-gray-500">
            Not enough data to display chart.
          </div>
        )}
      </div>
      
      <div className="bg-[#171A21] border border-gray-800 rounded-xl p-6 min-h-[350px]">
        <h3 className="text-lg font-semibold text-white mb-6">Expense by Category</h3>
        {pieData.length > 0 ? (
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#252A36', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#94A3B8' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex items-center justify-center h-[250px] text-gray-500">
            Not enough data to display chart.
          </div>
        )}
      </div>
    </div>
  );
}
