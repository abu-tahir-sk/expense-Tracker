import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: session.user.id,
        ...(type ? { type } : {}),
      },
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json(transactions);
  } catch (error) {
    console.error("Failed to fetch transactions:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, amount, type, category, date, paymentMethod, description, receiptUrl, isRecurring, recurrenceInterval } = body;

    if (!title || !amount || !type || !category || !date) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    let nextRecurringDate = null;
    if (isRecurring) {
      const d = new Date(date);
      if (recurrenceInterval === "daily") d.setDate(d.getDate() + 1);
      else if (recurrenceInterval === "weekly") d.setDate(d.getDate() + 7);
      else if (recurrenceInterval === "monthly") d.setMonth(d.getMonth() + 1);
      else if (recurrenceInterval === "yearly") d.setFullYear(d.getFullYear() + 1);
      nextRecurringDate = d;
    }

    const transaction = await prisma.transaction.create({
      data: {
        title,
        amount: parseFloat(amount),
        type,
        category,
        date: new Date(date),
        paymentMethod: paymentMethod || null,
        description: description || null,
        receiptUrl: receiptUrl || null,
        isRecurring: isRecurring || false,
        recurrenceInterval: isRecurring ? recurrenceInterval : null,
        nextRecurringDate: nextRecurringDate,
        userId: session.user.id,
      },
    });

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error("Failed to create transaction:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
