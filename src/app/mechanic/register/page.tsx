"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "@/components/ImageUploader";
const CITIES = ["Karachi","Lahore","Islamabad","Rawalpindi","Faisalabad","Multan","Peshawar","Quetta"];
const SERVICES = ["engine","ac","bodywork","electrical","tyres","detailing"];
export default function RegisterMechanic() {
  const [form, setForm] = useState<any>({ shopName: "", ownerName: "", city: CITIES[0], area: "", services: [], mobileService: false, priceRange: "$$", phone: "", description: "", images: [] });
  const [busy, setBusy] = useState(false);
  const r = useRouter();
  function toggle(s: string) { setForm({ ...form, services: form.services.includes(s) ? form.services.filter((x: string) => x !== s) : [...form.services, s] }); }
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true);
    const res = await fetch("/api/mechanic/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setBusy(false);
    if (res.ok) r.push("/mechanic"); else alert("Error");
  }
  return (
    <form onSubmit={submit} className="bg-white rounded-xl shadow p-6 space-y-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold">Register Your Workshop</h1>
      <div className="grid md:grid-cols-2 gap-3">
        <input required placeholder="Shop name" className="input" value={form.shopName} onChange={(e) => setForm({ ...form, shopName: e.target.value })} />
        <input required placeholder="Owner name" className="input" value={form.ownerName} onChange={(e) => setForm({ ...form, ownerName: e.target.value })} />
        <select className="input" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}>{CITIES.map((c) => <option key={c}>{c}</option>)}</select>
        <input required placeholder="Area" className="input" value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} />
        <input required placeholder="Phone" className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <select className="input" value={form.priceRange} onChange={(e) => setForm({ ...form, priceRange: e.target.value })}><option value="$">$</option><option value="$$">$$</option><option value="$$$">$$$</option></select>
      </div>
      <div>
        <p className="font-medium mb-2">Services</p>
        <div className="flex flex-wrap gap-2">
          {SERVICES.map((s) => (
            <button type="button" key={s} onClick={() => toggle(s)} className={`px-3 py-1.5 rounded-full text-sm font-medium border ${form.services.includes(s) ? "bg-red-600 text-white border-red-600" : "bg-white"}`}>{s.toUpperCase()}</button>
          ))}
        </div>
      </div>
      <label className="flex items-center gap-2"><input type="checkbox" checked={form.mobileService} onChange={(e) => setForm({ ...form, mobileService: e.target.checked })} /> Mobile / roadside service</label>
      <textarea required rows={4} placeholder="Describe your workshop" className="input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      <div><p className="font-medium mb-2">Photos</p><ImageUploader onUploaded={(urls) => setForm({ ...form, images: urls })} /></div>
      <button disabled={busy} className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50">{busy ? "Submitting" : "Register Workshop"}</button>
    </form>
  );
}
