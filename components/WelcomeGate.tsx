"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MapPin, CalendarDays, Clock } from "lucide-react";
import { companies, companyLabel } from "@/data/companies";
import { useCompany } from "@/context/CompanyContext";
import { useT } from "@/context/LanguageContext";
import {
  getCutoffInfo,
  isTomorrow,
  formatDeliveryDayLong,
  formatCutoffStamp,
  type CutoffInfo,
} from "@/lib/cutoff";
import { cn } from "@/lib/format";

export function WelcomeGate() {
  const { companyId, setCompany, hydrated } = useCompany();
  const { t, locale } = useT();
  const [pickedId, setPickedId] = useState<string | null>(null);
  const [cutoff, setCutoff] = useState<CutoffInfo | null>(null);

  useEffect(() => {
    setCutoff(getCutoffInfo());
  }, []);

  const open = hydrated && !companyId;

  const confirm = () => {
    if (!pickedId) return;
    setCompany(pickedId);
  };

  const dayLabel = cutoff
    ? isTomorrow(cutoff.deliveryDate)
      ? t("countdown.tomorrow")
      : formatDeliveryDayLong(cutoff.deliveryDate, locale)
    : "—";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] grid place-items-center bg-ink/60 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="welcome-title"
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
            className="w-full max-w-md overflow-hidden rounded-3xl bg-surface-light shadow-pop dark:bg-elevated-dark"
          >
            <div className="space-y-4 p-6">
              <div>
                <h2
                  id="welcome-title"
                  className="font-display text-3xl tracking-tight text-ink dark:text-cream"
                >
                  {t("welcome.title")}
                </h2>
                <p className="mt-1 text-sm text-ink-muted dark:text-cream/70">
                  {t("welcome.subtitle")}
                </p>
              </div>

              <div className="flex items-start gap-2.5 rounded-2xl bg-saffron-50 p-3 text-xs text-saffron-700 dark:bg-saffron-500/10 dark:text-saffron-200">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                <p className="font-medium">{t("welcome.locationNote")}</p>
              </div>

              {cutoff && (
                <div className="space-y-2.5 rounded-2xl border border-sage-500/20 bg-sage-50 p-3 dark:border-sage-500/25 dark:bg-sage-500/[0.08]">
                  <div className="flex items-start gap-2.5">
                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-sage-500 text-white">
                      <CalendarDays className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-sage-700 dark:text-sage-200/80">
                        {t("welcome.nextDeliveryLabel")}
                      </p>
                      <p className="mt-0.5 text-sm font-semibold text-ink dark:text-cream">
                        {dayLabel} · {t("welcome.deliveryWindow")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 border-t border-sage-500/15 pt-2.5 dark:border-sage-500/25">
                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-saffron-500 text-white">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-saffron-600 dark:text-saffron-200/80">
                        {t("welcome.orderByLabel")}
                      </p>
                      <p className="mt-0.5 text-sm font-semibold text-ink dark:text-cream">
                        {formatCutoffStamp(cutoff.cutoffDate, locale)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-ink-muted dark:text-cream/60">
                  {t("welcome.chooseBuilding")}
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {companies.map((c) => {
                    const selected = pickedId === c.id;
                    const label = companyLabel(c, locale);
                    return (
                      <button
                        key={c.id}
                        onClick={() => setPickedId(c.id)}
                        aria-pressed={selected}
                        className={cn(
                          "flex items-center gap-3 rounded-2xl border p-3 text-left transition",
                          selected
                            ? "border-sage-500 bg-sage-50 shadow-ring dark:bg-sage-500/15"
                            : "border-black/5 bg-cream-100 hover:border-black/10 dark:border-white/[0.06] dark:bg-white/[0.04] dark:hover:border-white/[0.12]",
                        )}
                      >
                        <div
                          className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-sm font-bold text-white"
                          style={{ backgroundColor: c.color }}
                        >
                          {label.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-ink dark:text-cream">
                            {label}
                          </p>
                          <p className="truncate text-[11px] text-ink-muted dark:text-cream/60">
                            {c.domain}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={confirm}
                disabled={!pickedId}
                className={cn(
                  "inline-flex h-12 w-full items-center justify-center rounded-full text-sm font-semibold transition",
                  pickedId
                    ? "bg-ink text-cream shadow-pop hover:bg-ink-soft dark:bg-cream dark:text-ink dark:hover:bg-cream-100"
                    : "cursor-not-allowed bg-ink-muted/40 text-cream/80",
                )}
              >
                {t("welcome.continue")}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
