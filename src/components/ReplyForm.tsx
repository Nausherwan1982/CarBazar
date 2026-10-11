"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function ReplyForm({ threadId }: { threadId: string }) {
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const r = useRouter();
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const res = await fetch("/api/forum/reply", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ threadId, body }) });
    setBusy(false);
    if (res.ok) { setBody(""); r.refresh(); } else alert("Login required");
  }
  return (
    <form onSubmit={submit} className="bg-white rounded-xl shadow p-4 space-y-3">
      <textarea value={body} onChange={(e) => setBody(e.target.value)} required rows={4} placeholder="Write your reply" className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-red-500" />
      <button disabled={busy} className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50">{busy ? "Posting" : "Post Reply"}</button>
    </form>
  );
}
