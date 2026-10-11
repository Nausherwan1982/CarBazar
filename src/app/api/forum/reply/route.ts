import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Login required" }, { status: 401 });
  const { threadId, body } = await req.json();
  if (!body) return NextResponse.json({ error: "Empty" }, { status: 400 });
  const reply = await prisma.forumReply.create({ data: { threadId, body, authorId: (session.user as any).id } });
  return NextResponse.json({ reply });
}
