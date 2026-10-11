"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "@/components/ImageUploader";
import { useSession } from "next-auth/react";

const CITIES = ["Karachi","Lahore","Islamabad","Rawalpindi","Faisalabad","Multan","Peshawar","Quetta"];
const FUELS = ["Petrol","Diesel","Hybrid","Electric","CNG"];
const TRANS = ["Manual","Automatic"];
const BODY = ["Sedan","Hatchback","SUV","MPV","Crossover","Coupe","Pickup","Bike"];

export default function SellPage() {
  const { data: session } = useSession();
  const r = useRouter();
  const [form, setForm] = useState<any>({
    title: "", description: "", price: 0, year: new Date().getFullYear(),
    kmDriven: 0, fuelType: "Petrol", transmission: "Automatic", bodyType: "Sedan",
    color: "", city: CITIES[0], images: [], categoryId: "cars",
  });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!session) { r.push("/login"); return; }
    setBusy(true); setMsg("");
    const res = await fetch("/api/ads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const d = await res.json();
    setBusy(false);
    if (!res.ok) { setMsg(d.error || "Failed"); return; }
    if (d.needsPayment) {
      setMsg(`Ad posted. Since it's your 2nd ad this month, PKR ${d.extraCost} is due. You can pay from My Ads.`);
    }
    setTimeout(() => r.push(`/ad/${d.ad.id}`), 1500);
  }

  return (
    <form onSubmit={submit} className="bg-white rounded-2xl shadow p-6 space-y-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold">Post Your Ad</h1>
      {msg && <p className="text-sm bg-yellow-50 border border-yellow-200 text-yellow-900 p-3 rounded-lg">{msg}</p>}

      <select className="input" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
        <option value="cars">Cars</option>
        <option value="bikes">Bikes</option>
      </select>

      <input required placeholder="Title (e.g. Toyota Corolla 2022 Automatic)" className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />

      <div className="grid md:grid-cols-3 gap-3">
        <input type="number" placeholder="Year" className="input" value={form.year} onChange={(e) => setForm({ ...form, year: +e.target.value })} />
        <input type="number" placeholder="KM Driven" className="input" value={form.kmDriven} onChange={(e) => setForm({ ...form, kmDriven: +e.target.value })} />
        <input type="number" required placeholder="Price (PKR)" className="input" value={form.price} onChange={(e) => setForm({ ...form, price: +e.target.value })} />
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        <select className="input" value={form.fuelType} onChange={(e) => setForm({ ...form, fuelType: e.target.value })}>{FUELS.map((f) => <option key={f}>{f}</option>)}</select>
        <select className="input" value={form.transmission} onChange={(e) => setForm({ ...form, transmission: e.target.value })}>{TRANS.map((t) => <option key={t}>{t}</option>)}</select>
        <select className="input" value={form.bodyType} onChange={(e) => setForm({ ...form, bodyType: e.target.value })}>{BODY.map((b) => <option key={b}>{b}</option>)}</select>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <input placeholder="Color" className="input" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} />
        <select className="input" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}>{CITIES.map((c) => <option key={c}>{c}</option>)}</select>
      </div>

      <textarea required rows={4} placeholder="Description" className="input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />

      <div>
        <p className="font-medium mb-2">Photos (up to 20  auto-compressed)</p>
        <ImageUploader onUploaded={(urls) => setForm({ ...form, images: urls })} />
      </div>

      <button disabled={busy} className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold disabled:opacity-50">
        {busy ? "Posting" : "Post Free Ad"}
      </button>
      <p className="text-xs text-gray-500">Free ad runs 30 days. 2nd ad in a month = PKR 200. Premium 7d = PKR 300  15d = PKR 500.</p>
    </form>
  );
}
