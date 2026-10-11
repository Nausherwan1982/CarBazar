import AdCard from "@/components/AdCard";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [featured, latest] = await Promise.all([
    prisma.ad.findMany({ where: { status: "active", isPremium: true, premiumUntil: { gt: new Date() } }, orderBy: { premiumUntil: "desc" }, take: 8 }),
    prisma.ad.findMany({ where: { status: "active" }, orderBy: { createdAt: "desc" }, take: 12 }),
  ]);

  const cats = [
    { label: "Cars", href: "/cars" },
    { label: "Bikes", href: "/bikes" },
    { label: "Rent a Car", href: "/rent-a-car" },
    { label: "Mechanic", href: "/mechanic" },
    { label: "Auto Care", href: "/auto-care" },
    { label: "Finance Calc", href: "/tools/finance-calculator" },
  ];

  return (
    <div className="space-y-8">
      {featured.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-3"> Featured Vehicles</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featured.map((ad) => <AdCard key={ad.id} ad={ad} />)}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-xl font-bold mb-3">Browse by Category</h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {cats.map((c) => (
            <a key={c.href} href={c.href} className="bg-white p-4 text-center rounded-xl shadow hover:shadow-lg font-semibold text-sm">{c.label}</a>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-3">Latest Ads</h2>
        {latest.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center text-gray-500">
            <p className="mb-3">No ads yet. Be the first to post!</p>
            <a href="/sell" className="inline-block bg-red-600 text-white px-6 py-2 rounded-lg font-semibold">Post an Ad</a>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {latest.map((ad) => <AdCard key={ad.id} ad={ad} />)}
          </div>
        )}
      </section>
    </div>
  );
}
