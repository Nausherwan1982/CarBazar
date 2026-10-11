import { formatDistanceToNow } from "date-fns";
import { prisma } from "@/lib/prisma";
import { formatPKR } from "@/lib/calculators";

export const dynamic = "force-dynamic";

export default async function AutoCarePage() {
  const [fuelPrices, financeRates, insuranceRates] = await Promise.all([
    prisma.fuelPrice.findMany({ orderBy: { effective: "desc" }, take: 12 }),
    prisma.financeRate.findMany({ orderBy: { minRate: "asc" }, take: 8 }),
    prisma.insuranceRate.findMany({ orderBy: { ratePercent: "asc" }, take: 8 }),
  ]);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Auto Care & Running Costs</h1>
      <section className="space-y-3">
        <h2 className="text-xl font-bold">Recent fuel prices</h2>
        {fuelPrices.length === 0
          ? <p className="rounded-xl bg-white p-5 text-gray-600">Fuel price updates are not available yet.</p>
          : <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {fuelPrices.map((item) => (
              <article key={item.id} className="rounded-xl bg-white p-4 shadow">
                <h3 className="font-semibold capitalize">{item.fuelType}</h3>
                <p className="text-xl font-bold text-red-600">Rs {formatPKR(item.price)} / litre</p>
                <p className="text-sm text-gray-500">{item.city || "National"} · {formatDistanceToNow(item.effective, { addSuffix: true })}</p>
              </article>
            ))}
          </div>}
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-bold">Finance rates</h2>
        {financeRates.length === 0
          ? <p className="rounded-xl bg-white p-5 text-gray-600">See our <a className="font-semibold text-red-600" href="/tools/finance-calculator">finance calculator</a> for an estimate.</p>
          : <div className="overflow-x-auto rounded-xl bg-white shadow"><table className="w-full text-left text-sm"><thead><tr className="border-b bg-gray-50"><th className="p-3">Bank</th><th className="p-3">Annual rate</th><th className="p-3">Max tenure</th></tr></thead><tbody className="divide-y">{financeRates.map((rate) => <tr key={rate.id}><td className="p-3">{rate.bank}</td><td className="p-3">{rate.minRate}%–{rate.maxRate}%</td><td className="p-3">{rate.tenureMax} months</td></tr>)}</tbody></table></div>}
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-bold">Insurance providers</h2>
        {insuranceRates.length === 0
          ? <p className="rounded-xl bg-white p-5 text-gray-600">Compare estimated costs with our <a className="font-semibold text-red-600" href="/tools/insurance-calculator">insurance calculator</a>.</p>
          : <div className="overflow-x-auto rounded-xl bg-white shadow"><table className="w-full text-left text-sm"><thead><tr className="border-b bg-gray-50"><th className="p-3">Provider</th><th className="p-3">Vehicle</th><th className="p-3">Rate</th><th className="p-3">Minimum premium</th></tr></thead><tbody className="divide-y">{insuranceRates.map((rate) => <tr key={rate.id}><td className="p-3">{rate.company}</td><td className="p-3 capitalize">{rate.vehicleCategory}</td><td className="p-3">{rate.ratePercent}%</td><td className="p-3">Rs {formatPKR(rate.minPremium)}</td></tr>)}</tbody></table></div>}
      </section>
    </div>
  );
}
