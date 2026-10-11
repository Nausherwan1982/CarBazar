import { MapPin, Phone, Star } from "lucide-react";

type Mechanic = {
  id: string;
  shopName: string;
  images: string[];
  area: string;
  city: string;
  rating: number;
  reviewCount: number;
  priceRange: string;
  services: string[];
  phone: string;
};

export default function MechanicCard({ m }: { m: Mechanic }) {
  return (
    <article className="rounded-xl bg-white p-4 shadow transition hover:shadow-xl">
      <div className="flex items-start gap-3">
        <img
          src={m.images[0] || "/placeholder.png"}
          alt={m.shopName}
          className="h-16 w-16 rounded-lg bg-gray-100 object-cover"
        />
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-bold">{m.shopName}</h3>
          <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
            <MapPin className="h-3 w-3" />
            {m.area}, {m.city}
          </p>
          <div className="mt-1 flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-semibold">{m.rating.toFixed(1)}</span>
            <span className="text-xs text-gray-500">({m.reviewCount})</span>
            <span className="ml-auto text-xs font-semibold text-gray-600">
              {m.priceRange}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-1">
        {m.services.slice(0, 4).map((service) => (
          <span
            key={service}
            className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-semibold uppercase text-red-700"
          >
            {service}
          </span>
        ))}
      </div>
      <a
        href={`tel:${m.phone}`}
        className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-red-600 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
      >
        <Phone className="h-4 w-4" />
        Call Mechanic
      </a>
    </article>
  );
}
