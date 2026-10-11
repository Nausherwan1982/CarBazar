import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
export async function GET() {
  const rates = await prisma.financeRate.findMany({ orderBy: { minRate: "asc" } });
  if (rates.length === 0) {
    return NextResponse.json({ rates: [
      { bank: "HBL CarLoan",       minRate: 14.5, maxRate: 20.0, tenureMax: 60 },
      { bank: "Meezan Car Ijarah", minRate: 15.0, maxRate: 21.0, tenureMax: 60 },
      { bank: "Bank Alfalah",      minRate: 14.9, maxRate: 21.5, tenureMax: 60 },
      { bank: "UBL Drive",         minRate: 15.5, maxRate: 22.0, tenureMax: 48 },
      { bank: "Faysal Bank",       minRate: 15.2, maxRate: 21.0, tenureMax: 60 },
      { bank: "Askari Bank",       minRate: 15.8, maxRate: 22.5, tenureMax: 60 },
    ], source: "default" });
  }
  return NextResponse.json({ rates, source: "live" });
}
