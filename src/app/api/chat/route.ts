import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ message: "Invalid messages format" }, { status: 400 });
    }

    // Fetch user's financial data to provide context to the AI
    const transactions = await prisma.transaction.findMany({
      where: { userId: session.user.id },
      orderBy: { date: "desc" },
    });

    const budgets = await prisma.budget.findMany({
      where: { userId: session.user.id },
    });

    const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    const balance = totalIncome - totalExpense;

    const systemInstruction = `
      You are Spendly AI, a highly intelligent, professional, and friendly personal finance assistant.
      Your goal is to help the user manage their money, understand their spending habits, and provide actionable financial advice.
      Keep your answers concise, well-formatted, and helpful. Use emojis appropriately but professionally.
      
      Here is the user's current financial context:
      - Total Income: ₹${totalIncome}
      - Total Expenses: ₹${totalExpense}
      - Current Balance: ₹${balance}
      - Number of transactions: ${transactions.length}
      - Active Budgets: ${budgets.length}
      
      Recent Transactions (up to 10):
      ${transactions.slice(0, 10).map(t => `- ${t.date.toISOString().split('T')[0]}: ${t.title} (${t.type}) - ₹${t.amount}`).join("\n")}
      
      If the user asks about their spending, use the context above to give them an accurate answer.
      If they ask something unrelated to finance or the app, politely steer them back to personal finance topics.
    `;

    // Convert OpenAI-style messages to Gemini-style contents
    const contents = messages.map((m: any) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return NextResponse.json({ reply: response.text });
  } catch (error) {
    console.error("AI Chat Error:", error);
    return NextResponse.json({ message: "Failed to process chat" }, { status: 500 });
  }
}
