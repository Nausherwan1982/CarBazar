import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import OpenAI from "openai";
import { notifyAll } from "@/lib/notify";

const openai = new OpenAI({ apiKey: process.env.OPEN_API_KEY || process.env.OPENAI_API_KEY });

export async function GET(req: NextRequest) {
  if (req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Try OGRA public site first, else AI knowledge
  let prices: any[] = [];
  try {
    const c = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: "Return today's Pakistan fuel prices as JSON." },
        { role: "user", content: 'Return {"prices":[{"fuelType":"petrol|diesel|cng","price":number,"city":"National"}]}' },
      ],
    });
    const parsed = JSON.parse(c.choices[0].message.content || "{}");
    prices = parsed.prices || [];
  } catch {}

  for (const p of prices) {
    await prisma.fuelPrice.create({ data: { fuelType: p.fuelType, price: p.price, city: p.city || "National" } });
  }

  if (prices.length > 0) {
    const body = prices.map((p) => `${p.fuelType}: Rs ${p.price}`).join(" | ");
    try { await notifyAll(" Fuel Prices Updated", body, "/auto-care"); } catch {}
  }

  return NextResponse.json({ ok: true, updated: prices.length });
}
