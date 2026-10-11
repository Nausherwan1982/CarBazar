import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import AdCard from "@/components/AdCard";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function MyAdsPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) redirect("/login");

  const ads = await prisma.ad.findMany({
    where: { sellerId: userId },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">My Ads</h1>
        <Link href="/sell" className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white">Post an ad</Link>
      </div>
      {ads.length === 0
        ? <p className="rounded-xl bg-white p-6 text-gray-600">You haven’t posted any ads yet.</p>
        : <div className="grid grid-cols-2 gap-4 md:grid-cols-4">{ads.map((ad) => <AdCard key={ad.id} ad={ad} />)}</div>}
    </section>
  );
}
