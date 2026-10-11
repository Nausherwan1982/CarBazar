import { prisma } from "@/lib/prisma";

export const AD_RULES = {
  FREE_DAYS: 30,
  EXTRA_AD_COST: 200,
  PREMIUM_7_DAYS: 300,
  PREMIUM_15_DAYS: 500,
};

export async function activatePremium(adId: string, days: 7 | 15) {
  const premiumUntil = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  await prisma.ad.update({ where: { id: adId }, data: { isPremium: true, premiumUntil } });
  return premiumUntil;
}

export async function isExtraAd(adId: string, userId: string) {
  const start = new Date();
  start.setDate(1); start.setHours(0, 0, 0, 0);
  const count = await prisma.ad.count({ where: { sellerId: userId, createdAt: { gte: start } } });
  return count > 1;
}
