export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="h-8 bg-gray-800 rounded w-48 mb-2"></div>
          <div className="h-4 bg-gray-800 rounded w-32"></div>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-10 bg-gray-800 rounded w-28"></div>
          <div className="h-10 bg-gray-800 rounded w-28"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-[#171A21] border border-gray-800 rounded-xl p-6 h-32 flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <div className="h-4 bg-gray-800 rounded w-24"></div>
              <div className="h-8 w-8 bg-gray-800 rounded-full"></div>
            </div>
            <div className="h-8 bg-gray-800 rounded w-32"></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-[#171A21] border border-gray-800 rounded-xl p-6 lg:col-span-2 min-h-[350px]"></div>
        <div className="bg-[#171A21] border border-gray-800 rounded-xl p-6 min-h-[350px]"></div>
      </div>
      
      <div className="bg-[#171A21] border border-gray-800 rounded-xl p-6 h-64"></div>
    </div>
  );
}
