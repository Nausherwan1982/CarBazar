"use client";
import Link from "next/link";
import { Home, Heart, PlusCircle, MessageCircle, Menu } from "lucide-react";
import { useState } from "react";

export default function BottomNav() {
  const [, setTick] = useState(0);
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50 md:hidden">
      <div className="grid grid-cols-5 text-center text-[10px]">
        <Link href="/" className="py-2 flex flex-col items-center gap-1"><Home className="w-5 h-5" />Home</Link>
        <Link href="/my-ads" className="py-2 flex flex-col items-center gap-1"><Heart className="w-5 h-5" />My Ads</Link>
        <Link href="/sell" className="py-2 flex flex-col items-center gap-1 text-red-600 font-semibold"><PlusCircle className="w-6 h-6" />Sell</Link>
        <Link href="/chat" className="py-2 flex flex-col items-center gap-1"><MessageCircle className="w-5 h-5" />Chat</Link>
        <button onClick={() => setTick((t) => t + 1)} className="py-2 flex flex-col items-center gap-1"><Menu className="w-5 h-5" />More</button>
      </div>
    </nav>
  );
}
