import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Login required" }, { status: 401 });
  const body = await req.json();
  const rent = await prisma.rentCar.create({
    data: { ...body, ownerId: (session.user as any).id, expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
  });
  return NextResponse.json({ rent });
}
