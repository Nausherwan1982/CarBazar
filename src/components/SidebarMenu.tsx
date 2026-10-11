"use client";
import Link from "next/link";
import { X, Car, Bike, Wrench, KeyRound, MessageCircle, BookOpen, Fuel, LogIn, LogOut, Heart, PlusCircle, Calculator, Shield } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

const items = [
  { href: "/cars",                      label: "Cars",                icon: Car },
  { href: "/cars/new",                  label: "New Cars",            icon: Car },
  { href: "/bikes",                     label: "Bikes",               icon: Bike },
  { href: "/bikes/new",                 label: "New Bikes",           icon: Bike },
  { href: "/rent-a-car",                label: "Rent a Car",          icon: KeyRound },
  { href: "/mechanic",                  label: "Mechanic",            icon: Wrench },
  { href: "/auto-care",                 label: "Auto Care",           icon: Fuel },
  { href: "/tools/finance-calculator",  label: "Finance Calculator",  icon: Calculator },
  { href: "/tools/insurance-calculator",label: "Insurance Calculator",icon: Shield },
  { href: "/forum",                     label: "Forum",               icon: MessageCircle },
  { href: "/blog",                      label: "Blog",                icon: BookOpen },
  { href: "/sell",                      label: "Sell Vehicle",        icon: PlusCircle },
  { href: "/my-ads",                    label: "My Ads",              icon: Heart },
];

export default function SidebarMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { data: session } = useSession();
  return (
    <>
      <div onClick={onClose} className={`fixed inset-0 bg-black/50 z-[60] transition-opacity ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`} />
      <aside className={`fixed top-0 left-0 h-full w-[280px] bg-white z-[70] shadow-2xl transform transition-transform ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-4 flex items-center justify-between border-b">
          <span className="text-xl font-bold">Car<span className="text-red-600">Bazar</span></span>
          <button onClick={onClose}><X /></button>
        </div>
        <nav className="p-2 overflow-y-auto" style={{ maxHeight: "calc(100vh - 140px)" }}>
          {items.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} onClick={onClose} className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-red-50 hover:text-red-600 font-medium text-sm">
              <Icon className="w-5 h-5" /> {label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 w-full border-t p-4 bg-white">
          {session ? (
            <button onClick={() => signOut()} className="w-full flex items-center justify-center gap-2 py-3 bg-red-600 text-white rounded-lg font-semibold">
              <LogOut className="w-5 h-5" /> Logout
            </button>
          ) : (
            <Link href="/login" onClick={onClose} className="w-full flex items-center justify-center gap-2 py-3 bg-red-600 text-white rounded-lg font-semibold">
              <LogIn className="w-5 h-5" /> Login
            </Link>
          )}
        </div>
      </aside>
    </>
  );
}
