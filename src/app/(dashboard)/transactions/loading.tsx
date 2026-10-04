export default function TransactionsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gray-800 rounded-full"></div>
          <div>
            <div className="h-8 bg-gray-800 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-800 rounded w-64"></div>
          </div>
        </div>
        <div className="h-10 bg-gray-800 rounded w-28"></div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 h-10 bg-gray-800 rounded"></div>
        <div className="flex gap-4">
          <div className="w-32 h-10 bg-gray-800 rounded"></div>
          <div className="w-32 h-10 bg-gray-800 rounded"></div>
        </div>
      </div>

      <div className="bg-[#171A21] border border-gray-800 rounded-xl p-6 h-96"></div>
    </div>
  );
}
