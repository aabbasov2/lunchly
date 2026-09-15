"use client";

import Image from "next/image";
import { Heart, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import type { Meal } from "@/data/meals";
import {
  DEFAULT_SALAD_ID,
  DEFAULT_SIDE_ID,
  salads,
  sides,
  mealName,
  mealSubtitle,
  mealCategoryLabel,
  sideLabel,
  saladLabel,
} from "@/data/meals";
import { Badge } from "@/components/ui/Badge";
import { formatPrice, cn } from "@/lib/format";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { useT } from "@/context/LanguageContext";

export function FoodCard({
  meal,
  index = 0,
  soldOut = false,
}: {
  meal: Meal;
  index?: number;
  soldOut?: boolean;
}) {
  const { add } = useCart();
  const { showToast } = useToast();
  const { t, locale } = useT();
  const [favorite, setFavorite] = useState(false);
  const [pulse, setPulse] = useState(false);

  const needsCombo = meal.requiresSides || meal.requiresSalad;
  const [sideId, setSideId] = useState<string>(DEFAULT_SIDE_ID);
  const [saladId, setSaladId] = useState<string>(DEFAULT_SALAD_ID);

  const sideUpcharge = sides.find((s) => s.id === sideId)?.upcharge ?? 0;
  const currentPrice = meal.price + (needsCombo ? sideUpcharge : 0);
  const localizedName = mealName(meal, locale);
  const subtitle = mealSubtitle(meal, locale);

  const handleAdd = () => {
    if (soldOut) return;
    if (needsCombo) {
      add(meal, { sideId, saladId });
    } else {
      add(meal);
    }
    showToast(t("food.addedToast", { name: localizedName }));
    setPulse(true);
    setTimeout(() => setPulse(false), 400);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.04, ease: "easeOut" }}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-3xl bg-surface-light shadow-soft transition-shadow duration-300 hover:shadow-pop dark:bg-elevated-dark",
        soldOut && "opacity-80",
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-cream-100 dark:bg-white/[0.04]">
        <Image
          src={meal.image}
          alt={localizedName}
          fill
          sizes="(min-width: 768px) 33vw, 100vw"
          className={cn(
            "object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]",
            soldOut && "grayscale",
          )}
        />
        {soldOut && (
          <div className="absolute inset-0 grid place-items-center bg-black/45">
            <span className="rounded-full bg-white/95 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-ink shadow-pop">
              {t("food.soldOut")}
            </span>
          </div>
        )}
        <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            {meal.featured && <Badge tone="ink">{t("food.onMenu")}</Badge>}
            {meal.chefsPick && <Badge tone="saffron">{t("food.chefsPick")}</Badge>}
          </div>
          <button
            onClick={() => setFavorite((f) => !f)}
            aria-label={favorite ? t("food.favRemove") : t("food.favAdd")}
            className="grid h-9 w-9 place-items-center rounded-full bg-white/90 text-ink shadow-soft backdrop-blur transition hover:bg-white dark:bg-black/40 dark:text-cream"
          >
            <Heart
              className={cn(
                "h-4 w-4 transition-colors",
                favorite ? "fill-saffron-500 text-saffron-500" : "text-ink-muted",
              )}
            />
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-semibold leading-snug text-ink dark:text-cream">
            {localizedName}
          </h3>
          <span className="text-base font-semibold text-ink dark:text-cream">
            {formatPrice(meal.price)}
          </span>
        </div>
        {subtitle && (
          <p className="text-xs text-ink-muted dark:text-cream/60">{subtitle}</p>
        )}

        {needsCombo ? (
          <div className="mt-3 space-y-3">
            <ComboRow label={t("food.sideLabel")}>
              {sides.map((s) => {
                const active = s.id === sideId;
                return (
                  <ChipButton
                    key={s.id}
                    active={active}
                    onClick={() => setSideId(s.id)}
                    aria-pressed={active}
                  >
                    {sideLabel(s, locale)}
                    {s.upcharge > 0 && (
                      <span
                        className={cn(
                          "ml-1 rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                          active
                            ? "bg-cream/25 text-cream"
                            : "bg-saffron-100 text-saffron-600 dark:bg-saffron-500/20 dark:text-saffron-200",
                        )}
                      >
                        +€{s.upcharge}
                      </span>
                    )}
                  </ChipButton>
                );
              })}
            </ComboRow>
            <ComboRow label={t("food.saladLabel")}>
              {salads.map((s) => {
                const active = s.id === saladId;
                return (
                  <ChipButton
                    key={s.id}
                    active={active}
                    onClick={() => setSaladId(s.id)}
                    aria-pressed={active}
                  >
                    {saladLabel(s, locale)}
                  </ChipButton>
                );
              })}
            </ComboRow>
            <motion.button
              onClick={handleAdd}
              disabled={soldOut}
              whileTap={soldOut ? undefined : { scale: 0.98 }}
              animate={pulse ? { scale: [1, 1.03, 1] } : { scale: 1 }}
              transition={{ duration: 0.3 }}
              className={cn(
                "mt-1 inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold text-white shadow-pop ring-1 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-light dark:focus-visible:ring-offset-elevated-dark",
                soldOut
                  ? "cursor-not-allowed bg-ink-muted/60 ring-transparent"
                  : "bg-saffron-500 ring-saffron-600/40 hover:bg-saffron-600 focus-visible:ring-saffron-500",
              )}
              aria-label={t("food.addAria", { name: localizedName })}
            >
              {soldOut ? (
                t("food.soldOut")
              ) : (
                <>
                  <Plus className="h-4 w-4" strokeWidth={3} />
                  {t("food.addToCart")} · {formatPrice(currentPrice)}
                </>
              )}
            </motion.button>
          </div>
        ) : (
          <div className="mt-auto flex items-center justify-between pt-3">
            <span className="text-xs uppercase tracking-wider text-ink-muted dark:text-cream/60">
              {mealCategoryLabel(meal.category, locale)}
            </span>
            <motion.button
              onClick={handleAdd}
              disabled={soldOut}
              whileTap={soldOut ? undefined : { scale: 0.94 }}
              animate={pulse ? { scale: [1, 1.08, 1] } : { scale: 1 }}
              transition={{ duration: 0.35 }}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold shadow-soft transition",
                soldOut
                  ? "cursor-not-allowed bg-ink-muted/60 text-cream"
                  : "bg-ink text-cream hover:bg-ink-soft dark:bg-cream dark:text-ink dark:hover:bg-cream-100",
              )}
              aria-label={t("food.addAria", { name: localizedName })}
            >
              {soldOut ? (
                t("food.soldOut")
              ) : (
                <>
                  <Plus className="h-3.5 w-3.5" strokeWidth={3} />
                  {t("food.add")}
                </>
              )}
            </motion.button>
          </div>
        )}
      </div>
    </motion.article>
  );
}

function ComboRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-ink-muted dark:text-cream/60">
        {label}
      </p>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function ChipButton({
  active,
  onClick,
  children,
  ...rest
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition",
        active
          ? "bg-ink text-cream shadow-soft dark:bg-cream dark:text-ink"
          : "bg-black/[0.04] text-ink-soft hover:bg-black/[0.08] dark:bg-white/[0.06] dark:text-cream/80 dark:hover:bg-white/[0.10]",
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
