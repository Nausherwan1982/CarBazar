import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

function slugify(s: string) { return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Date.now().toString(36); }

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Login required" }, { status: 401 });
  const { title, body, category } = await req.json();
  if (!title || !body) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  const thread = await prisma.forumThread.create({
    data: { title, body, category: category || "general", slug: slugify(title), authorId: (session.user as any).id },
  });
  return NextResponse.json({ thread });
}
