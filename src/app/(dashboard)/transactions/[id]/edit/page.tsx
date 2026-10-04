import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import ExpenseForm from "@/components/ExpenseForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function EditTransactionPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  const { id } = await params;

  const transaction = await prisma.transaction.findUnique({
    where: { 
      id,
      userId: session.user.id 
    }
  });

  if (!transaction) {
    redirect("/transactions");
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/transactions" className="p-2 rounded-full hover:bg-[#252A36] text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Edit Transaction</h2>
          <p className="text-gray-400 text-sm mt-1">Update the details of your transaction below.</p>
        </div>
      </div>

      <div className="bg-[#171A21] border border-gray-800 rounded-xl p-6">
        <ExpenseForm initialData={transaction} />
      </div>
    </div>
  );
}
