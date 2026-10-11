import Link from "next/link";
export default function AdCard({ ad }: { ad: any }) {
  const img = ad.images?.[0] || "/placeholder.png";
  return (
    <Link href={`/ad/${ad.id}`} className="bg-white rounded-xl overflow-hidden shadow hover:shadow-xl transition">
      <div className="relative">
        <img src={img} alt={ad.title} className="w-full h-40 object-cover" loading="lazy" />
        {ad.isPremium && <span className="absolute top-2 left-2 text-[10px] bg-yellow-400 text-black px-2 py-0.5 rounded font-bold">PREMIUM</span>}
      </div>
      <div className="p-3">
        <h3 className="font-semibold line-clamp-2 text-sm h-10">{ad.title}</h3>
        <p className="text-red-600 font-bold mt-1">PKR {ad.price?.toLocaleString()}</p>
        <p className="text-xs text-gray-500 mt-1">
          {ad.city} | {ad.year}
          {ad.kmDriven ? ` | ${ad.kmDriven.toLocaleString()} km` : ""}
        </p>
      </div>
    </Link>
  );
}
