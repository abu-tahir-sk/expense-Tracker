import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { title, amount, type, category, date, paymentMethod, description, receiptUrl, isRecurring, recurrenceInterval } = body;

    // Check if transaction belongs to user
    const existing = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== session.user.id) {
      return NextResponse.json({ message: "Not found or unauthorized" }, { status: 404 });
    }

    let nextRecurringDate = existing.nextRecurringDate;
    if (isRecurring && isRecurring !== existing.isRecurring) {
      const d = new Date(date || existing.date);
      if (recurrenceInterval === "daily") d.setDate(d.getDate() + 1);
      else if (recurrenceInterval === "weekly") d.setDate(d.getDate() + 7);
      else if (recurrenceInterval === "monthly") d.setMonth(d.getMonth() + 1);
      else if (recurrenceInterval === "yearly") d.setFullYear(d.getFullYear() + 1);
      nextRecurringDate = d;
    } else if (!isRecurring) {
      nextRecurringDate = null;
    }

    const transaction = await prisma.transaction.update({
      where: { id },
      data: {
        title,
        amount: amount !== undefined ? parseFloat(amount) : undefined,
        type,
        category,
        date: date ? new Date(date) : undefined,
        paymentMethod,
        description,
        receiptUrl,
        isRecurring,
        recurrenceInterval: isRecurring ? recurrenceInterval : null,
        nextRecurringDate,
      },
    });

    return NextResponse.json(transaction);
  } catch (error) {
    console.error("Failed to update transaction:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Check if transaction belongs to user
    const existing = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== session.user.id) {
      return NextResponse.json({ message: "Not found or unauthorized" }, { status: 404 });
    }

    await prisma.transaction.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Transaction deleted" });
  } catch (error) {
    console.error("Failed to delete transaction:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
