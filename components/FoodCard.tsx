"use client";

import Image from "next/image";
import { Heart, Plus, Flame } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import type { Meal } from "@/data/meals";
import { Badge } from "@/components/ui/Badge";
import { formatPrice, cn } from "@/lib/format";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";

export function FoodCard({ meal, index = 0 }: { meal: Meal; index?: number }) {
  const { add } = useCart();
  const { showToast } = useToast();
  const [favorite, setFavorite] = useState(false);
  const [pulse, setPulse] = useState(false);

  const handleAdd = () => {
    add(meal);
    showToast(`Added ${meal.name}`);
    setPulse(true);
    setTimeout(() => setPulse(false), 400);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.04, ease: "easeOut" }}
      className="group relative flex flex-col overflow-hidden rounded-3xl bg-surface-light shadow-soft transition-shadow duration-300 hover:shadow-pop dark:bg-elevated-dark"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-cream-100 dark:bg-white/[0.04]">
        <Image
          src={meal.image}
          alt={meal.name}
          fill
          sizes="(min-width: 768px) 33vw, 100vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
        <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            {meal.featured && <Badge tone="ink">Tomorrow&rsquo;s Menu</Badge>}
            {meal.chefsPick && <Badge tone="saffron">Chef&rsquo;s Pick</Badge>}
          </div>
          <button
            onClick={() => setFavorite((f) => !f)}
            aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
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
            {meal.name}
          </h3>
          <span className="text-base font-semibold text-ink dark:text-cream">
            {formatPrice(meal.price)}
          </span>
        </div>
        <p className="line-clamp-2 text-sm text-ink-muted dark:text-cream/60">
          {meal.description}
        </p>
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="inline-flex items-center gap-1 text-xs text-ink-muted dark:text-cream/60">
            <Flame className="h-3.5 w-3.5" />
            {meal.calories} kcal
          </span>
          <motion.button
            onClick={handleAdd}
            whileTap={{ scale: 0.94 }}
            animate={pulse ? { scale: [1, 1.08, 1] } : { scale: 1 }}
            transition={{ duration: 0.35 }}
            className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-xs font-semibold text-cream shadow-soft transition hover:bg-ink-soft dark:bg-cream dark:text-ink dark:hover:bg-cream-100"
            aria-label={`Add ${meal.name} to cart`}
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={3} />
            Add
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}
