import Link from "next/link";
export default function RentCarCard({ car }: { car: any }) {
  return (
    <Link href={`/rent-a-car/${car.id}`} className="bg-white rounded-xl overflow-hidden shadow hover:shadow-xl transition">
      <img src={car.images[0] || "/placeholder.jpg"} alt={car.title} className="w-full h-40 object-cover" loading="lazy" />
      <div className="p-3">
        <h3 className="font-semibold text-sm line-clamp-1">{car.title}</h3>
        <p className="text-xs text-gray-500 mt-1">{car.city}  {car.vehicleType.toUpperCase()}  {car.withDriver ? "With Driver" : "Self Drive"}</p>
        <p className="text-red-600 font-bold mt-2">PKR {car.pricePerDay.toLocaleString()}<span className="text-xs font-normal text-gray-500"> / day</span></p>
      </div>
    </Link>
  );
}
