import AdCard from "@/components/AdCard";
import Filters from "@/components/Filters";
import { prisma } from "@/lib/prisma";

export const revalidate = 30;

export default async function BikesPage({ searchParams }: { searchParams: any }) {
  const where: any = { status: "active", category: { slug: "bikes" } };
  if (searchParams.brand) where.brand = { name: searchParams.brand };
  if (searchParams.city) where.city = searchParams.city;

  const ads = await prisma.ad.findMany({ where, orderBy: [{ isPremium: "desc" }, { createdAt: "desc" }], take: 48 });

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Bikes for Sale in Pakistan</h1>
      <Filters basePath="/bikes" />
      {ads.length === 0 ? (
        <p className="text-center text-gray-500 py-12 bg-white rounded-xl">No bikes yet. Post the first one!</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{ads.map((ad) => <AdCard key={ad.id} ad={ad} />)}</div>
      )}
    </div>
  );
}
