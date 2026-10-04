import { FileQuestion } from "lucide-react";
import Link from "next/link";

export default function EmptyState({ 
  message = "No transactions found", 
  actionLink = "/transactions/new",
  actionText = "Add Transaction"
}: { 
  message?: string,
  actionLink?: string,
  actionText?: string
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 bg-[#252A36] rounded-full flex items-center justify-center mb-4">
        <FileQuestion className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-white mb-2">{message}</h3>
      <p className="text-gray-400 text-sm max-w-sm mb-6">
        Looks like you haven't added any transactions here yet. Start tracking your finances by adding one now.
      </p>
      {actionLink && (
        <Link 
          href={actionLink} 
          className="bg-[#252A36] hover:bg-[#333a4a] text-white px-6 py-2 rounded-md font-medium transition-colors border border-gray-700"
        >
          {actionText}
        </Link>
      )}
    </div>
  );
}
