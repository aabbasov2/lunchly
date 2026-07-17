import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { Providers } from "@/context/Providers";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { FloatingCartButton } from "@/components/FloatingCartButton";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const display = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lunchly — Fresh Lunch Delivered To Your Workplace",
  description: "Order today. Enjoy tomorrow. Fresh meals delivered to partner offices.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAF7F2" },
    { media: "(prefers-color-scheme: dark)", color: "#0E0E10" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${display.variable}`} suppressHydrationWarning>
      <body>
        <Providers>
          <div className="flex min-h-dvh flex-col">
            <Header />
            <main className="flex-1 pb-28 md:pb-24">
              <div className="mx-auto w-full max-w-5xl px-4 py-6 md:py-10">{children}</div>
            </main>
            <FloatingCartButton />
            <BottomNav />
          </div>
        </Providers>
      </body>
    </html>
  );
}
