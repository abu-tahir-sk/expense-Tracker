import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import AnalyticsClient from "./AnalyticsClient";

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/auth/signin");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, currency: true }
  });

  if (!user) {
    redirect("/auth/signin");
  }

  const transactions = await prisma.transaction.findMany({
    where: { userId: user.id },
    orderBy: { date: 'asc' },
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
        <p className="text-gray-400">Deep dive into your spending habits</p>
      </div>

      <AnalyticsClient 
        transactions={transactions} 
        currency={user.currency || "INR"} 
      />
    </div>
  );
}
