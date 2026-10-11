import { NextRequest, NextResponse } from "next/server";
import { dailySeoRefresh } from "@/lib/seoAI";
export async function GET(req: NextRequest) {
  if (req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await dailySeoRefresh();
  return NextResponse.json({ ok: true });
}
