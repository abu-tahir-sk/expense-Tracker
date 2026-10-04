import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Prisma handles cascading deletes if configured, 
    // but to be safe we can delete transactions and budgets first.
    await prisma.transaction.deleteMany({
      where: { userId: session.user.id },
    });

    await prisma.budget.deleteMany({
      where: { userId: session.user.id },
    });

    await prisma.user.delete({
      where: { id: session.user.id },
    });

    return NextResponse.json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Failed to delete account:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
