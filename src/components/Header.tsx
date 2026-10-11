"use client";

import Link from "next/link";
import { Menu, PlusCircle } from "lucide-react";
import { useState } from "react";
import SidebarMenu from "./SidebarMenu";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setMenuOpen(true)}
              className="rounded-lg p-2 hover:bg-gray-100"
            >
              <Menu className="h-5 w-5" />
            </button>
            <Link href="/" className="text-xl font-bold">
              Car<span className="text-red-600">Bazar</span>
            </Link>
          </div>
          <nav className="hidden items-center gap-5 text-sm font-medium md:flex">
            <Link href="/cars" className="hover:text-red-600">Cars</Link>
            <Link href="/bikes" className="hover:text-red-600">Bikes</Link>
            <Link href="/rent-a-car" className="hover:text-red-600">Rent a Car</Link>
            <Link href="/sell" className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700">
              <PlusCircle className="h-4 w-4" />
              Sell
            </Link>
          </nav>
        </div>
      </header>
      <SidebarMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
