"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
const CITIES = ["Karachi","Lahore","Islamabad","Rawalpindi","Faisalabad","Multan","Peshawar","Quetta"];
const TYPES = ["sedan","suv","hatchback","luxury","van"];
export default function RentFilters() {
  const r = useRouter(); const sp = useSearchParams();
  const [f, setF] = useState({ city: sp.get("city") || "", type: sp.get("type") || "", driver: sp.get("driver") || "", max: sp.get("max") || "" });
  function apply() {
    const q = new URLSearchParams(Object.entries(f).filter(([, v]) => v) as any).toString();
    r.push(`/rent-a-car${q ? "?" + q : ""}`);
  }
  return (
    <div className="bg-white border rounded-xl p-4 grid grid-cols-2 md:grid-cols-4 gap-3">
      <select className="input" value={f.city} onChange={(e) => setF({ ...f, city: e.target.value })}><option value="">All Cities</option>{CITIES.map((c) => <option key={c}>{c}</option>)}</select>
      <select className="input" value={f.type} onChange={(e) => setF({ ...f, type: e.target.value })}><option value="">All Types</option>{TYPES.map((t) => <option key={t} value={t}>{t.toUpperCase()}</option>)}</select>
      <select className="input" value={f.driver} onChange={(e) => setF({ ...f, driver: e.target.value })}><option value="">Driver: Any</option><option value="1">With Driver</option><option value="0">Self Drive</option></select>
      <div className="flex gap-2">
        <input type="number" placeholder="Max PKR/day" className="input flex-1" value={f.max} onChange={(e) => setF({ ...f, max: e.target.value })} />
        <button onClick={apply} className="bg-red-600 text-white px-4 rounded-lg font-semibold">Filter</button>
      </div>
    </div>
  );
}
