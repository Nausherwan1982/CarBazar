import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { easypaisaInit } from "@/lib/payments";

export async function POST(req: NextRequest) {
  const { adId, plan } = await req.json();
  const map: any = { extra: { amount: 200, days: 0 }, premium7: { amount: 300, days: 7 }, premium15: { amount: 500, days: 15 } };
  const p = map[plan];
  if (!p) return NextResponse.json({ error: "Bad plan" }, { status: 400 });
  const txnRef = `CB-${Date.now()}-${adId.slice(-5)}`;
  const ad = await prisma.ad.findUnique({ where: { id: adId } });
  if (!ad) return NextResponse.json({ error: "Ad not found" }, { status: 404 });
  await prisma.payment.create({ data: { adId, userId: ad.sellerId, amount: p.amount, gateway: "easypaisa", txnRef, premiumDays: p.days } });
  const returnUrl = `${process.env.NEXTAUTH_URL}/api/payments/callback`;
  return NextResponse.json(easypaisaInit(p.amount, txnRef, returnUrl));
}
