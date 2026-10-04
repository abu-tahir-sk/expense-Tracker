import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AssistantClient from "./AssistantClient";
import prisma from "@/lib/prisma";

export default async function AssistantPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true },
  });

  return <AssistantClient userName={user?.name || "User"} />;
}
