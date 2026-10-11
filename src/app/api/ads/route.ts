import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isExtraAd } from "@/lib/premiumLogic";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const where: any = { status: "active" };
  if (sp.get("category")) where.category = { slug: sp.get("category") };
  if (sp.get("brand")) where.brand = { name: sp.get("brand") };
  if (sp.get("city")) where.city = sp.get("city");
  const ads = await prisma.ad.findMany({ where, orderBy: [{ isPremium: "desc" }, { createdAt: "desc" }], take: 60 });
  return NextResponse.json({ ads });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Login required" }, { status: 401 });
  const body = await req.json();

  let cat = await prisma.category.findUnique({ where: { slug: body.categoryId || "cars" } });
  if (!cat) cat = await prisma.category.create({ data: { slug: body.categoryId || "cars", name: body.categoryId || "Cars" } });

  const ad = await prisma.ad.create({
    data: {
      title: body.title, description: body.description, price: body.price, year: body.year,
      kmDriven: body.kmDriven || null, fuelType: body.fuelType, transmission: body.transmission,
      bodyType: body.bodyType, color: body.color, city: body.city, images: body.images || [],
      categoryId: cat.id, sellerId: (session.user as any).id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), status: "active",
    },
  });

  const extra = await isExtraAd(ad.id, ad.sellerId);
  return NextResponse.json({ ad, needsPayment: extra, extraCost: 200 });
}
