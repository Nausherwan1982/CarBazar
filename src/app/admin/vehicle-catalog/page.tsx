import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminCatalog() {
  const [cars, bikes, changes] = await Promise.all([
    prisma.carModel.findMany({ where: { vehicleType: "car" }, include: { brand: true }, orderBy: { updatedAt: "desc" }, take: 30 }),
    prisma.carModel.findMany({ where: { vehicleType: "bike" }, include: { brand: true }, orderBy: { updatedAt: "desc" }, take: 30 }),
    prisma.catalogHistory.findMany({ orderBy: { createdAt: "desc" }, take: 20, include: { model: { include: { brand: true } } } }),
  ]);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Vehicle Catalog</h1>
      <section>
        <h2 className="mb-3 text-xl font-bold">Recent Changes</h2>
        <div className="divide-y rounded-xl bg-white shadow">
          {changes.length === 0 && <p className="p-5 text-gray-500">No catalog changes have been recorded.</p>}
          {changes.map((change) => (
            <div key={change.id} className="flex flex-wrap justify-between gap-2 p-4">
              <span>{change.model.brand.name} {change.model.name}</span>
              <span className="text-sm text-gray-600">
                {change.changeType}
                {change.oldPricePKR !== null && change.newPricePKR !== null
                  ? ` · Rs ${change.oldPricePKR.toLocaleString()} → Rs ${change.newPricePKR.toLocaleString()}`
                  : ""}
              </span>
              <time className="text-xs text-gray-500">{change.createdAt.toLocaleDateString()}</time>
            </div>
          ))}
        </div>
      </section>
      {[
        { title: "Cars", models: cars },
        { title: "Bikes", models: bikes },
      ].map(({ title, models }) => (
        <section key={title}>
          <h2 className="mb-3 text-xl font-bold">{title}</h2>
          <div className="overflow-x-auto rounded-xl bg-white shadow">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-gray-50">
                <tr><th className="p-3">Brand</th><th className="p-3">Model</th><th className="p-3">Body type</th><th className="p-3">Price</th><th className="p-3">Updated</th></tr>
              </thead>
              <tbody className="divide-y">
                {models.map((model) => (
                  <tr key={model.id}>
                    <td className="p-3">{model.brand.name}</td>
                    <td className="p-3">{model.name}</td>
                    <td className="p-3">{model.bodyType || "—"}</td>
                    <td className="p-3">{model.pricePKR ? `Rs ${model.pricePKR.toLocaleString()}` : "—"}</td>
                    <td className="p-3">{model.updatedAt.toLocaleDateString()}</td>
                  </tr>
                ))}
                {models.length === 0 && <tr><td colSpan={5} className="p-4 text-gray-500">No catalog entries yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  );
}
