"use client";
import { useState } from "react";
import imageCompression from "browser-image-compression";

export default function ImageUploader({ onUploaded }: { onUploaded: (urls: string[]) => void }) {
  const [busy, setBusy] = useState(false);
  const [urls, setUrls] = useState<string[]>([]);

  async function handleFiles(files: FileList) {
    if (files.length > 20) return alert("Max 20 images");
    setBusy(true);
    const form = new FormData();
    for (const f of Array.from(files)) {
      const compressed = await imageCompression(f, { maxSizeMB: 0.4, maxWidthOrHeight: 1600, useWebWorker: true, initialQuality: 0.85 });
      form.append("files", compressed);
    }
    const res = await fetch("/api/upload", { method: "POST", body: form });
    const data = await res.json();
    setUrls(data.urls || []);
    onUploaded(data.urls || []);
    setBusy(false);
  }

  return (
    <div>
      <input type="file" multiple accept="image/*" onChange={(e) => e.target.files && handleFiles(e.target.files)} className="text-sm" />
      {busy && <p className="text-xs text-gray-500 mt-1">Compressing & uploading</p>}
      <div className="grid grid-cols-5 gap-2 mt-2">
        {urls.map((u) => <img key={u} src={u} className="w-full h-16 object-cover rounded" />)}
      </div>
    </div>
  );
}
