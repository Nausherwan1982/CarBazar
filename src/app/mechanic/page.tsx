import Link from "next/link";
import { prisma } from "@/lib/prisma";
import MechanicFilters from "@/components/MechanicFilters";
import MechanicCard from "@/components/MechanicCard";

export const revalidate = 60;

export default async function MechanicPage({ searchParams }: { searchParams: any }) {
  const where: any = { status: "active" };
  if (searchParams.city) where.city = searchParams.city;
  if (searchParams.service) where.services = { has: searchParams.service };
  if (searchParams.mobile === "1") where.mobileService = true;

  const list = await prisma.mechanic.findMany({ where, orderBy: [{ rating: "desc" }, { reviewCount: "desc" }], take: 50 });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-3xl font-bold">Find a Mechanic in Pakistan</h1>
        <Link href="/mechanic/register" className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold">+ Register Your Shop</Link>
      </div>
      <MechanicFilters />
      {list.length === 0 ? <p className="text-gray-500 text-center py-12 bg-white rounded-xl">No mechanics found.</p> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">{list.map((m) => <MechanicCard key={m.id} m={m} />)}</div>
      )}
    </div>
  );
}
