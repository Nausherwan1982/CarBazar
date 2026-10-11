import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
export async function GET() {
  const rates = await prisma.insuranceRate.findMany({ orderBy: { ratePercent: "asc" } });
  if (rates.length === 0) {
    return NextResponse.json({ rates: [
      { company: "Adamjee Insurance", vehicleCategory: "car", minPremium: 25000, ratePercent: 2.5 },
      { company: "EFU General",       vehicleCategory: "car", minPremium: 28000, ratePercent: 2.6 },
      { company: "TPL Insurance",     vehicleCategory: "car", minPremium: 22000, ratePercent: 2.4 },
      { company: "Jubilee Insurance", vehicleCategory: "car", minPremium: 26000, ratePercent: 2.55 },
      { company: "Salaam Takaful",    vehicleCategory: "car", minPremium: 24000, ratePercent: 2.45 },
      { company: "Askari Insurance",  vehicleCategory: "car", minPremium: 27000, ratePercent: 2.65 },
    ], source: "default" });
  }
  return NextResponse.json({ rates, source: "live" });
}
