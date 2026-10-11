"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function NewThread() {
  const [form, setForm] = useState({ title: "", body: "", category: "cars" });
  const [busy, setBusy] = useState(false);
  const r = useRouter();
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true);
    const res = await fetch("/api/forum/thread", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const d = await res.json();
    setBusy(false);
    if (res.ok) r.push(`/forum/${d.thread.slug}`); else alert(d.error);
  }
  return (
    <form onSubmit={submit} className="bg-white rounded-xl shadow p-6 space-y-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold">Start a New Thread</h1>
      <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input">
        <option value="cars">Cars</option><option value="bikes">Bikes</option><option value="maintenance">Maintenance</option><option value="general">General</option>
      </select>
      <input required placeholder="Thread title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input" />
      <textarea required rows={8} placeholder="Describe your question" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} className="input" />
      <button disabled={busy} className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50">{busy ? "Posting" : "Post Thread"}</button>
    </form>
  );
}
