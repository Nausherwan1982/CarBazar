import AdCard from "@/components/AdCard";
import Filters from "@/components/Filters";
import { prisma } from "@/lib/prisma";

export const revalidate = 30;

export default async function CarsPage({ searchParams }: { searchParams: any }) {
  const where: any = { status: "active" };
  if (searchParams.brand)        where.brand = { name: searchParams.brand };
  if (searchParams.city)         where.city = searchParams.city;
  if (searchParams.fuel)         where.fuelType = searchParams.fuel;
  if (searchParams.transmission) where.transmission = searchParams.transmission;
  if (searchParams.bodyType)     where.bodyType = searchParams.bodyType;
  if (searchParams.yearFrom)     where.year = { gte: +searchParams.yearFrom };
  if (searchParams.priceMin || searchParams.priceMax)
    where.price = { gte: +(searchParams.priceMin || 0), lte: +(searchParams.priceMax || 1e12) };

  const ads = await prisma.ad.findMany({
    where,
    orderBy: [{ isPremium: "desc" }, { premiumUntil: "desc" }, { createdAt: "desc" }],
    take: 48,
  });

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Cars for Sale in Pakistan</h1>
      <Filters basePath="/cars" />
      {ads.length === 0 ? (
        <p className="text-center text-gray-500 py-12 bg-white rounded-xl">No cars match. Try different filters or post your own.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {ads.map((ad) => <AdCard key={ad.id} ad={ad} />)}
        </div>
      )}
    </div>
  );
}
