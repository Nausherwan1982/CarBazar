import { NextRequest, NextResponse } from "next/server";
import { runVehicleSlice } from "@/lib/vehicleBot";
import { notifyPriceChanges } from "@/lib/notify";

export const maxDuration = 60;

export async function GET(req: NextRequest) {
  if (req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const slice = Number(req.nextUrl.searchParams.get("slice") || "0");
  const result = await runVehicleSlice(slice, 3);
  const notify = await notifyPriceChanges();
  return NextResponse.json({ ok: true, slice, saved: result.saved, notificationsSent: notify.sent });
}
