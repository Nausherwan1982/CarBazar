"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
const CITIES = ["Karachi","Lahore","Islamabad","Rawalpindi","Faisalabad","Multan","Peshawar","Quetta"];
const SERVICES = ["engine","ac","bodywork","electrical","tyres","detailing"];
export default function MechanicFilters() {
  const r = useRouter(); const sp = useSearchParams();
  const [f, setF] = useState({ city: sp.get("city") || "", service: sp.get("service") || "", mobile: sp.get("mobile") || "" });
  function apply() {
    const q = new URLSearchParams(Object.entries(f).filter(([, v]) => v) as any).toString();
    r.push(`/mechanic${q ? "?" + q : ""}`);
  }
  return (
    <div className="bg-white border rounded-xl p-4 grid grid-cols-2 md:grid-cols-4 gap-3">
      <select className="input" value={f.city} onChange={(e) => setF({ ...f, city: e.target.value })}><option value="">All Cities</option>{CITIES.map((c) => <option key={c}>{c}</option>)}</select>
      <select className="input" value={f.service} onChange={(e) => setF({ ...f, service: e.target.value })}><option value="">All Services</option>{SERVICES.map((s) => <option key={s} value={s}>{s.toUpperCase()}</option>)}</select>
      <select className="input" value={f.mobile} onChange={(e) => setF({ ...f, mobile: e.target.value })}><option value="">Any</option><option value="1">Mobile Service</option></select>
      <button onClick={apply} className="bg-red-600 text-white px-4 rounded-lg font-semibold">Filter</button>
    </div>
  );
}
