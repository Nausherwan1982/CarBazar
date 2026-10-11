import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { scrapeBankRates, scrapeInsuranceRates } from "@/lib/scraper";

export const maxDuration = 60;

export async function GET(req: NextRequest) {
  if (req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const [banks, insurers] = await Promise.all([scrapeBankRates(), scrapeInsuranceRates()]);
  for (const b of banks) {
    await prisma.financeRate.upsert({ where: { bank: b.bank }, update: { minRate: b.minRate, maxRate: b.maxRate, tenureMax: b.tenureMax }, create: b });
  }
  for (const i of insurers) {
    await prisma.insuranceRate.upsert({
      where: { company: i.company },
      update: { vehicleCategory: i.vehicleCategory, ratePercent: i.ratePercent, minPremium: i.minPremium },
      create: i,
    });
  }
  return NextResponse.json({ ok: true, banksUpdated: banks.length, insurersUpdated: insurers.length });
}
