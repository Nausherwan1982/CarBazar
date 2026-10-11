import Link from "next/link";
import { prisma } from "@/lib/prisma";
import RentFilters from "@/components/RentFilters";
import RentCarCard from "@/components/RentCarCard";

export const revalidate = 30;

export default async function RentPage({ searchParams }: { searchParams: any }) {
  const where: any = { status: "active", expiresAt: { gt: new Date() } };
  if (searchParams.city) where.city = searchParams.city;
  if (searchParams.type) where.vehicleType = searchParams.type;
  if (searchParams.driver === "1") where.withDriver = true;
  if (searchParams.driver === "0") where.withDriver = false;
  if (searchParams.max) where.pricePerDay = { lte: +searchParams.max };

  const cars = await prisma.rentCar.findMany({ where, orderBy: [{ pricePerDay: "asc" }, { createdAt: "desc" }], take: 40 });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-3xl font-bold">Rent a Car in Pakistan</h1>
        <Link href="/rent-a-car/list" className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold">+ List Your Car</Link>
      </div>
      <RentFilters />
      {cars.length === 0 ? <p className="text-gray-500 text-center py-12 bg-white rounded-xl">No rentals found. Try different filters.</p> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">{cars.map((c) => <RentCarCard key={c.id} car={c} />)}</div>
      )}
    </div>
  );
}
