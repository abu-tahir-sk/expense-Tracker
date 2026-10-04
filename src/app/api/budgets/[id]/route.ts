import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Check if budget belongs to user
    const existing = await prisma.budget.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== session.user.id) {
      return NextResponse.json({ message: "Not found or unauthorized" }, { status: 404 });
    }

    await prisma.budget.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Budget deleted" });
  } catch (error) {
    console.error("Failed to delete budget:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
