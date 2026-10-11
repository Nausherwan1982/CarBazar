import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import FinanceCalculator from "@/components/FinanceCalculator";
import InsuranceCalculator from "@/components/InsuranceCalculator";
import { formatDistanceToNow } from "date-fns";

export default async function AdPage({ params }: { params: { id: string } }) {
  const ad = await prisma.ad.findUnique({ where: { id: params.id }, include: { seller: true, brand: true, model: true } });
  if (!ad || ad.status !== "active") notFound();

  await prisma.ad.update({ where: { id: ad.id }, data: { views: { increment: 1 } } });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
          {ad.images.slice(0, 6).map((src, i) => (
            <img key={i} src={src} alt={`${ad.title} ${i + 1}`} className={`w-full ${i === 0 ? "col-span-2 md:col-span-2 row-span-2 h-64 md:h-[500px]" : "h-32 md:h-[250px]"} object-cover`} />
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl shadow p-6">
            <h1 className="text-2xl font-bold">{ad.title}</h1>
            <p className="text-3xl font-black text-red-600 mt-3">PKR {ad.price.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-2">{ad.city}  {formatDistanceToNow(ad.createdAt, { addSuffix: true })}  {ad.views} views</p>

            <div className="grid grid-cols-3 gap-4 mt-6 text-sm">
              <Fact label="Year" value={String(ad.year)} />
              <Fact label="KM Driven" value={ad.kmDriven ? ad.kmDriven.toLocaleString() : ""} />
              <Fact label="Fuel" value={ad.fuelType || ""} />
              <Fact label="Transmission" value={ad.transmission || ""} />
              <Fact label="Body" value={ad.bodyType || ""} />
              <Fact label="Color" value={ad.color || ""} />
            </div>

            <h2 className="text-lg font-bold mt-6 mb-2">Description</h2>
            <p className="whitespace-pre-line text-gray-700">{ad.description}</p>
          </div>

          <FinanceCalculator defaultPrice={ad.price} />
          <InsuranceCalculator defaultIDV={ad.price} />
        </div>

        <aside className="space-y-4">
          <div className="bg-white rounded-2xl shadow p-5 sticky top-20">
            <p className="text-xs uppercase font-semibold text-gray-500">Seller</p>
            <p className="font-bold mt-1">{ad.seller.name || "User"}</p>
            <a href={`https://wa.me/92${ad.seller.phone.replace(/^0/, "")}?text=Hi, interested in your ${ad.title}`} target="_blank"
               className="block mt-4 bg-green-600 text-white text-center py-3 rounded-lg font-semibold">WhatsApp Seller</a>
            <a href={`tel:${ad.seller.phone}`} className="block mt-2 bg-red-600 text-white text-center py-3 rounded-lg font-semibold">Call Now</a>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return <div className="bg-gray-50 rounded-lg p-3"><p className="text-[10px] uppercase font-semibold text-gray-500">{label}</p><p className="font-bold mt-0.5">{value}</p></div>;
}
