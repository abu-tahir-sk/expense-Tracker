import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { category, amount, month, year } = body;

    if (!category || !amount || month === undefined || year === undefined) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Check if budget for this category and month already exists
    const existing = await prisma.budget.findFirst({
      where: {
        userId: session.user.id,
        category,
        month,
        year
      }
    });

    if (existing) {
      return NextResponse.json({ message: "Budget for this category already exists for this month" }, { status: 400 });
    }

    const budget = await prisma.budget.create({
      data: {
        userId: session.user.id,
        category,
        amount: parseFloat(amount),
        month,
        year
      },
    });

    return NextResponse.json(budget, { status: 201 });
  } catch (error) {
    console.error("Failed to create budget:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
