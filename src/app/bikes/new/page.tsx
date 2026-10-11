import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";

export default async function NewBikes() {
  const brands = await prisma.brand.findMany({ where: { vehicleType: "bike" }, include: { models: { where: { isNew: true }, orderBy: { pricePKR: "asc" } } }, orderBy: [{ origin: "asc" }, { name: "asc" }] });
  const local = brands.filter((b) => b.origin === "local");
  const imported = brands.filter((b) => b.origin === "imported");

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold">New Bikes | Pakistan Prices 2026</h1>
      {[{ title: "Local Bikes", data: local }, { title: "Imported Bikes", data: imported }].map(({ title, data }) => (
        <section key={title}>
          <h2 className="text-xl font-bold mb-4">{title}</h2>
          {data.length === 0 && <p className="text-gray-500">Run the vehicle bot to populate this list.</p>}
          {data.map((b) => (
            <div key={b.id} className="mb-6">
              <h3 className="font-semibold text-lg mb-2">{b.name}</h3>
              <div className="grid md:grid-cols-3 gap-3">
                {b.models.map((m) => (
                  <div key={m.id} className="bg-white rounded-xl shadow p-4">
                    <p className="font-semibold">{m.name}</p>
                    <p className="text-red-600 font-bold mt-2">{m.pricePKR ? `PKR ${m.pricePKR.toLocaleString()}` : "On request"}</p>
                    <p className="text-xs text-gray-500 mt-1">{m.bodyType} | {(m.specs as any)?.engine}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}
