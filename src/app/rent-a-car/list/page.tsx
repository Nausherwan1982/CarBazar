"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "@/components/ImageUploader";
const CITIES = ["Karachi","Lahore","Islamabad","Rawalpindi","Faisalabad","Multan","Peshawar","Quetta"];
export default function ListRentCar() {
  const [form, setForm] = useState<any>({ title: "", city: CITIES[0], vehicleType: "sedan", withDriver: false, pricePerDay: 5000, features: [], contactPhone: "", images: [] });
  const [busy, setBusy] = useState(false);
  const r = useRouter();
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true);
    const res = await fetch("/api/rent/list", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setBusy(false);
    if (res.ok) r.push("/rent-a-car"); else alert("Login required");
  }
  return (
    <form onSubmit={submit} className="bg-white rounded-xl shadow p-6 space-y-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold">List Your Car for Rent</h1>
      <input required placeholder="Title" className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
      <div className="grid md:grid-cols-3 gap-3">
        <select className="input" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}>{CITIES.map((c) => <option key={c}>{c}</option>)}</select>
        <select className="input" value={form.vehicleType} onChange={(e) => setForm({ ...form, vehicleType: e.target.value })}>{["sedan","suv","hatchback","luxury","van"].map((t) => <option key={t} value={t}>{t.toUpperCase()}</option>)}</select>
        <input type="number" placeholder="Price/day" className="input" value={form.pricePerDay} onChange={(e) => setForm({ ...form, pricePerDay: +e.target.value })} />
      </div>
      <label className="flex items-center gap-2"><input type="checkbox" checked={form.withDriver} onChange={(e) => setForm({ ...form, withDriver: e.target.checked })} /> Available with driver</label>
      <input required placeholder="Contact phone" className="input" value={form.contactPhone} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} />
      <div><p className="font-medium mb-2">Photos</p><ImageUploader onUploaded={(urls) => setForm({ ...form, images: urls })} /></div>
      <button disabled={busy} className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50">{busy ? "Publishing" : "Publish"}</button>
    </form>
  );
}
