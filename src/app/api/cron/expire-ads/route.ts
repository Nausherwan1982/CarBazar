import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function GET(req: NextRequest) {
  if (req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const result = await prisma.ad.updateMany({ where: { status: "active", expiresAt: { lt: new Date() } }, data: { status: "expired" } });
  return NextResponse.json({ expired: result.count });
}
