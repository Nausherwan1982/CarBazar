"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const BRANDS = ["Toyota","Honda","Suzuki","Kia","Hyundai","MG","Audi","BMW","Mercedes","Changan","Haval"];
const CITIES = ["Karachi","Lahore","Islamabad","Rawalpindi","Faisalabad","Multan","Peshawar","Quetta"];
const FUELS  = ["Petrol","Diesel","Hybrid","Electric","CNG"];
const TRANS  = ["Manual","Automatic"];
const BODY   = ["Sedan","Hatchback","SUV","MPV","Crossover","Coupe","Pickup"];

export default function Filters({ basePath = "/cars" }: { basePath?: string }) {
  const r = useRouter();
  const [f, setF] = useState<any>({});
  const upd = (k: string, v: any) => setF({ ...f, [k]: v });

  function apply() {
    const q = new URLSearchParams(Object.entries(f).filter(([, v]) => v) as any).toString();
    r.push(`${basePath}${q ? "?" + q : ""}`);
  }

  return (
    <div className="bg-white border rounded-xl p-4 grid grid-cols-2 md:grid-cols-4 gap-3">
      <select className="input" onChange={(e) => upd("brand", e.target.value)}><option value="">All Brands</option>{BRANDS.map((b) => <option key={b}>{b}</option>)}</select>
      <select className="input" onChange={(e) => upd("city", e.target.value)}><option value="">All Cities</option>{CITIES.map((c) => <option key={c}>{c}</option>)}</select>
      <select className="input" onChange={(e) => upd("fuel", e.target.value)}><option value="">Fuel</option>{FUELS.map((x) => <option key={x}>{x}</option>)}</select>
      <select className="input" onChange={(e) => upd("transmission", e.target.value)}><option value="">Transmission</option>{TRANS.map((x) => <option key={x}>{x}</option>)}</select>
      <select className="input" onChange={(e) => upd("bodyType", e.target.value)}><option value="">Body Type</option>{BODY.map((x) => <option key={x}>{x}</option>)}</select>
      <input className="input" placeholder="Year from" type="number" onChange={(e) => upd("yearFrom", e.target.value)} />
      <input className="input" placeholder="Price min (PKR)" type="number" onChange={(e) => upd("priceMin", e.target.value)} />
      <button onClick={apply} className="bg-red-600 text-white rounded-lg font-semibold">Apply Filters</button>
    </div>
  );
}
