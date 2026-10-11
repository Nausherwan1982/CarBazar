"use client";
import { useEffect, useState } from "react";
export default function HeroCarousel({ images }: { images: string[] }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (images.length <= 1) return;
    const t = setInterval(() => setI((v) => (v + 1) % images.length), 5000);
    return () => clearInterval(t);
  }, [images.length]);
  if (images.length === 0) return null;
  return (
    <div className="relative w-full h-[200px] md:h-[300px] overflow-hidden rounded-xl">
      {images.map((src, idx) => (
        <img key={src + idx} src={src} alt="" className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${idx === i ? "opacity-100" : "opacity-0"}`} />
      ))}
    </div>
  );
}
