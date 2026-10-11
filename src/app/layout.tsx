import "./globals.css";
import type { Metadata } from "next";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import ChatBox from "@/components/ChatBox";
import { Providers } from "./providers";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXTAUTH_URL ??
      process.env.NEXT_PUBLIC_SITE_URL ??
      "http://localhost:3000",
  ),
  title: "CarBazar | Buy, Sell, Rent Cars & Bikes in Pakistan",
  description: "Pakistan's smarter auto marketplace. Buy & sell used cars, bikes, rent a car, find mechanics, compare financing and insurance rates.",
  keywords: ["cars for sale","bikes","pakistan","carbazar","used cars","rent a car","mechanic","car financing","car insurance"],
  openGraph: { title: "CarBazar", description: "Drive Your Dream", images: ["/hero-audi.jpg"] },
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 pb-16 md:pb-0">
        <Providers>
          <Header />
          <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
          <ChatBox />
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}
