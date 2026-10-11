import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function POST(req: NextRequest) {
  const body = await req.json();
  const m = await prisma.mechanic.create({ data: body });
  return NextResponse.json({ mechanic: m });
}
