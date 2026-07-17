"use client";

import Link from "next/link";
import { UtensilsCrossed } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { useCompany } from "@/context/CompanyContext";

export function Header() {
  const { companyName } = useCompany();
  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-cream/80 backdrop-blur-lg dark:border-white/[0.06] dark:bg-surface-dark/80">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-xl bg-ink text-cream dark:bg-cream dark:text-ink">
            <UtensilsCrossed className="h-4 w-4" />
          </div>
          <span className="font-display text-lg font-semibold tracking-tight text-ink dark:text-cream">
            Lunchly
          </span>
        </Link>
        <div className="flex items-center gap-2">
          {companyName && (
            <Link
              href="/company"
              className="hidden rounded-full bg-black/5 px-3 py-1.5 text-xs font-medium text-ink-soft transition hover:bg-black/10 sm:inline-flex dark:bg-white/[0.08] dark:text-cream/80 dark:hover:bg-white/[0.12]"
            >
              {companyName}
            </Link>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
