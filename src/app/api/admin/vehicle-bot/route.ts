import { NextRequest, NextResponse } from "next/server";
import { runFullVehicleScrape } from "@/lib/vehicleBot";
import { notifyPriceChanges } from "@/lib/notify";

export const maxDuration = 300;

export async function POST(req: NextRequest) {
  if (req.headers.get("x-admin-secret") !== process.env.CRON_SECRET)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const result = await runFullVehicleScrape();
  const notify = await notifyPriceChanges();
  const totalInserted = result.flatMap((r) => r.saved).reduce((s, x) => s + x.inserted, 0);
  const totalPriceChanges = result.flatMap((r) => r.saved).reduce((s, x) => s + x.priceChanges, 0);
  return NextResponse.json({ summary: { slices: result.length, newModelsAdded: totalInserted, priceChanges: totalPriceChanges, notificationsSent: notify.sent } });
}
