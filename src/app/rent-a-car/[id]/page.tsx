import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function RentCarDetail({ params }: { params: { id: string } }) {
  const car = await prisma.rentCar.findUnique({ where: { id: params.id } });
  if (!car || car.status !== "active" || car.expiresAt <= new Date()) notFound();

  const phone = car.contactPhone.replace(/[^\d+]/g, "");

  return (
    <article className="mx-auto max-w-4xl space-y-6">
      <div className="grid grid-cols-2 gap-2 overflow-hidden rounded-2xl bg-white shadow">
        {car.images.map((image, index) => (
          <img key={`${image}-${index}`} src={image || "/placeholder.png"} alt={`${car.title} ${index + 1}`} className="h-52 w-full object-cover md:h-80" />
        ))}
        {car.images.length === 0 && <img src="/placeholder.png" alt="No vehicle image available" className="col-span-2 h-64 w-full object-cover" />}
      </div>
      <div className="rounded-2xl bg-white p-6 shadow">
        <h1 className="text-2xl font-bold">{car.title}</h1>
        <p className="mt-2 text-2xl font-black text-red-600">Rs {car.pricePerDay.toLocaleString()} / day</p>
        <p className="mt-2 text-gray-600">{car.city} · {car.vehicleType} · {car.withDriver ? "With driver" : "Self drive"}</p>
        <div className="mt-5 flex flex-wrap gap-2">{car.features.map((feature) => <span key={feature} className="rounded-full bg-gray-100 px-3 py-1 text-sm">{feature}</span>)}</div>
        <a href={`tel:${phone}`} className="mt-6 inline-block rounded-lg bg-red-600 px-5 py-3 font-semibold text-white">Call {car.contactPhone}</a>
      </div>
    </article>
  );
}
