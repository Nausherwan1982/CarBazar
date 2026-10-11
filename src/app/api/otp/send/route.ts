import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendWhatsAppOtp } from "@/lib/whatsapp";

export async function POST(req: NextRequest) {
  const { phone } = await req.json();
  if (!/^92\d{10}$/.test(phone)) return NextResponse.json({ error: "Format: 92XXXXXXXXXX" }, { status: 400 });
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  await prisma.otpCode.create({ data: { phone, code, expiresAt: new Date(Date.now() + 5 * 60 * 1000) } });
  try { await sendWhatsAppOtp(phone, code); } catch (e: any) { console.warn("WA failed:", e.message); }
  return NextResponse.json({ ok: true });
}
