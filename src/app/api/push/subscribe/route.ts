import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body?.endpoint) return NextResponse.json({ error: "Bad request" }, { status: 400 });
  await prisma.pushSubscription.upsert({ where: { endpoint: body.endpoint }, update: { data: body }, create: { endpoint: body.endpoint, data: body } });
  return NextResponse.json({ ok: true });
}
