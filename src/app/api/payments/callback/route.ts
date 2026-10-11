import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { activatePremium } from "@/lib/premiumLogic";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const body = Object.fromEntries(form.entries()) as Record<string, string>;
  const txnRef = body.orderRefNum || body.pp_TxnRefNo || body.reference || "";
  const statusRaw = (body.status || body.pp_ResponseCode || body.responseCode || "success").toLowerCase();
  const success = ["success", "000", "0", "paid"].includes(statusRaw);
  const payment = await prisma.payment.findUnique({ where: { txnRef } });
  if (!payment) return NextResponse.json({ error: "Unknown txn" }, { status: 404 });
  if (!success) {
    await prisma.payment.update({ where: { id: payment.id }, data: { status: "failed", rawResponse: body } });
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/my-ads?payment=failed`);
  }
  await prisma.payment.update({ where: { id: payment.id }, data: { status: "success", rawResponse: body } });
  if (payment.premiumDays > 0) await activatePremium(payment.adId, payment.premiumDays as 7 | 15);
  return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/ad/${payment.adId}?payment=success`);
}
