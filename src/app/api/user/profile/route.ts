import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, currency } = body;

    const data: any = {};
    if (name !== undefined) data.name = name;
    if (currency !== undefined) data.currency = currency;

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data,
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Failed to update profile:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
