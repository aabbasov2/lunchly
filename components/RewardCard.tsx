"use client";

import { Coffee, IceCream, Percent, UtensilsCrossed, Lock } from "lucide-react";
import { motion } from "framer-motion";
import type { Reward } from "@/data/rewards";
import { cn } from "@/lib/format";
import { Button } from "@/components/ui/Button";

const iconMap = {
  coffee: Coffee,
  cake: IceCream,
  percent: Percent,
  utensils: UtensilsCrossed,
};

interface RewardCardProps {
  reward: Reward;
  points: number;
  index?: number;
  onRedeem?: (reward: Reward) => void;
}

export function RewardCard({ reward, points, index = 0, onRedeem }: RewardCardProps) {
  const unlocked = points >= reward.cost;
  const Icon = iconMap[reward.icon];
  const pct = Math.min(100, (points / reward.cost) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className={cn(
        "relative flex flex-col gap-3 rounded-3xl border p-5 shadow-soft transition",
        unlocked
          ? "border-sage-200 bg-sage-50 dark:border-sage-500/30 dark:bg-sage-500/10"
          : "border-black/5 bg-surface-light dark:border-white/[0.06] dark:bg-elevated-dark",
      )}
    >
      <div className="flex items-start justify-between">
        <div
          className={cn(
            "grid h-11 w-11 place-items-center rounded-2xl",
            unlocked
              ? "bg-sage-500 text-white"
              : "bg-black/5 text-ink-muted dark:bg-white/[0.08] dark:text-cream/60",
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div
          className={cn(
            "rounded-full px-2.5 py-1 text-[11px] font-semibold",
            unlocked
              ? "bg-sage-500 text-white"
              : "bg-black/5 text-ink-muted dark:bg-white/[0.08] dark:text-cream/60",
          )}
        >
          {reward.cost} pts
        </div>
      </div>
      <div>
        <h3 className="text-base font-semibold text-ink dark:text-cream">{reward.title}</h3>
        <p className="text-sm text-ink-muted dark:text-cream/60">{reward.description}</p>
      </div>

      {unlocked ? (
        <Button size="sm" onClick={() => onRedeem?.(reward)} className="mt-1">
          Redeem
        </Button>
      ) : (
        <div className="mt-1 space-y-1.5">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/5 dark:bg-white/[0.08]">
            <div
              className="h-full bg-sage-400"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-ink-muted dark:text-cream/60">
            <span className="inline-flex items-center gap-1">
              <Lock className="h-3 w-3" /> {reward.cost - points} pts to unlock
            </span>
            <span>{Math.floor(pct)}%</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}
