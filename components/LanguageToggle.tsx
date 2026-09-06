"use client";

import { LOCALES, type Locale } from "@/lib/i18n";
import { useT } from "@/context/LanguageContext";
import { cn } from "@/lib/format";

export function LanguageToggle() {
  const { locale, setLocale } = useT();
  return (
    <div
      className="flex items-center rounded-full bg-black/5 p-0.5 text-[10px] font-bold uppercase tracking-wider dark:bg-white/[0.08]"
      role="group"
      aria-label="Language"
    >
      {LOCALES.map((l: Locale) => {
        const active = locale === l;
        return (
          <button
            key={l}
            type="button"
            onClick={() => setLocale(l)}
            aria-pressed={active}
            className={cn(
              "rounded-full px-2.5 py-1 transition",
              active
                ? "bg-ink text-cream dark:bg-cream dark:text-ink"
                : "text-ink-muted hover:text-ink dark:text-cream/60 dark:hover:text-cream",
            )}
          >
            {l}
          </button>
        );
      })}
    </div>
  );
}
