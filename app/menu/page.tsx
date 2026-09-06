"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, Sparkles } from "lucide-react";
import {
  meals,
  categories,
  mealName,
  mealDescription,
  mealCategoryLabel,
  type MealCategory,
} from "@/data/meals";
import { FoodCard } from "@/components/FoodCard";
import { FoodCardSkeleton } from "@/components/ui/Skeleton";
import { PromoBanner } from "@/components/PromoBanner";
import { CountdownBanner } from "@/components/CountdownBanner";
import { useT } from "@/context/LanguageContext";
import { cn } from "@/lib/format";

type CategoryFilter = "All" | MealCategory;

export default function MenuPage() {
  const { t, locale } = useT();
  const [category, setCategory] = useState<CategoryFilter>("All");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 650);
    return () => clearTimeout(t);
  }, []);

  const chefsPick = useMemo(() => meals.find((m) => m.chefsPick), []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return meals.filter((m) => {
      const catMatch = category === "All" || m.category === category;
      if (!catMatch) return false;
      if (!q) return true;
      return (
        m.name.toLowerCase().includes(q) ||
        (m.name_et ?? "").toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        (m.description_et ?? "").toLowerCase().includes(q) ||
        m.tags?.some((tag) => tag.toLowerCase().includes(q))
      );
    });
  }, [category, query]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl tracking-tight text-ink dark:text-cream">
          {t("menu.title")}
        </h1>
        <p className="mt-1 text-sm text-ink-muted dark:text-cream/60">
          {t("menu.subtitle")}
        </p>
      </div>

      <CountdownBanner />
      <PromoBanner />

      <div className="sticky top-14 z-30 -mx-4 space-y-3 border-b border-transparent bg-cream/85 px-4 py-3 backdrop-blur-lg dark:bg-surface-dark/85">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("menu.search")}
            className="h-12 w-full rounded-full border border-black/5 bg-surface-light pl-11 pr-4 text-sm text-ink placeholder:text-ink-muted focus:border-sage-500 focus:outline-none focus:ring-2 focus:ring-sage-500/20 dark:border-white/[0.06] dark:bg-elevated-dark dark:text-cream dark:placeholder:text-cream/40"
          />
        </div>
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
          {categories.map((c) => {
            const active = c === category;
            return (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={cn(
                  "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition",
                  active
                    ? "bg-ink text-cream dark:bg-cream dark:text-ink"
                    : "bg-surface-light text-ink-soft hover:bg-black/5 dark:bg-elevated-dark dark:text-cream/80 dark:hover:bg-white/[0.06]",
                )}
              >
                {mealCategoryLabel(c, locale)}
              </button>
            );
          })}
        </div>
      </div>

      {chefsPick && category === "All" && !query && (
        <section>
          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-saffron-500" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-muted dark:text-cream/70">
              {t("menu.chefsPickHeading")}
            </h2>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-saffron-100 to-saffron-50 p-6 shadow-soft dark:from-saffron-500/10 dark:to-saffron-500/[0.03]"
          >
            <div className="grid gap-4 sm:grid-cols-[1.2fr_1fr] sm:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-saffron-600 dark:text-saffron-200">
                  {t("menu.featuredTomorrow")}
                </p>
                <h3 className="mt-1 font-display text-3xl text-ink dark:text-cream">
                  {mealName(chefsPick, locale)}
                </h3>
                <p className="mt-2 text-sm text-ink-muted dark:text-cream/70">
                  {mealDescription(chefsPick, locale)}
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <span className="text-lg font-semibold text-ink dark:text-cream">
                    {t("menu.fromPrice", { price: chefsPick.price.toFixed(2) })}
                  </span>
                  <span className="text-xs uppercase tracking-wider text-ink-muted dark:text-cream/60">
                    {t("menu.comboHint")}
                  </span>
                </div>
              </div>
              <div className="relative aspect-[5/4] overflow-hidden rounded-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={chefsPick.image}
                  alt={mealName(chefsPick, locale)}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </motion.div>
        </section>
      )}

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-muted dark:text-cream/70">
            {category === "All" ? t("menu.allMeals") : mealCategoryLabel(category, locale)} · {filtered.length}
          </h2>
        </div>
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <FoodCardSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-3xl bg-surface-light p-10 text-center shadow-soft dark:bg-elevated-dark">
            <p className="font-display text-2xl text-ink dark:text-cream">
              {t("menu.emptyTitle")}
            </p>
            <p className="mt-1 text-sm text-ink-muted dark:text-cream/60">
              {t("menu.emptySub")}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {filtered.map((m, i) => (
              <FoodCard key={m.id} meal={m} index={i} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
