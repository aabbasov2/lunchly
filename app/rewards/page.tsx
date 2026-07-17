"use client";

import { motion } from "framer-motion";
import { Sparkles, Gift } from "lucide-react";
import { useLoyalty } from "@/context/LoyaltyContext";
import { rewards, badges } from "@/data/rewards";
import { RewardCard } from "@/components/RewardCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useToast } from "@/context/ToastContext";
import { cn } from "@/lib/format";

export default function RewardsPage() {
  const { points, awardPoints } = useLoyalty();
  const { showToast } = useToast();

  const nextReward = rewards.find((r) => r.cost > points) ?? rewards[rewards.length - 1];
  const prevCost = [...rewards].filter((r) => r.cost <= points).pop()?.cost ?? 0;
  const progressValue = points - prevCost;
  const progressMax = nextReward.cost - prevCost;

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-ink to-ink-soft p-8 text-cream shadow-pop">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-sage-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-10 h-56 w-56 rounded-full bg-saffron-500/20 blur-3xl" />

        <div className="relative flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10">
            <Sparkles className="h-5 w-5" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-wider text-cream/70">
            Loyalty program
          </p>
        </div>
        <motion.p
          key={points}
          initial={{ scale: 0.95, opacity: 0.6 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="mt-6 font-display text-6xl tracking-tight sm:text-7xl"
        >
          {points}
        </motion.p>
        <p className="mt-1 text-sm text-cream/70">Lunch Points</p>

        <div className="mt-6 rounded-2xl bg-white/[0.06] p-4 backdrop-blur">
          <div className="flex items-center justify-between text-xs text-cream/80">
            <span className="inline-flex items-center gap-1.5">
              <Gift className="h-3.5 w-3.5" />
              Next reward: <strong className="text-cream">{nextReward.title}</strong>
            </span>
            <span>
              {points >= nextReward.cost ? "Ready!" : `${nextReward.cost - points} pts to go`}
            </span>
          </div>
          <div className="mt-3">
            <ProgressBar value={progressValue} max={progressMax} />
          </div>
        </div>

        <button
          onClick={() => {
            awardPoints(60);
            showToast("+60 Lunch Points earned");
          }}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-cream px-4 py-2 text-xs font-semibold text-ink transition hover:scale-[1.02]"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Demo: earn 60 points
        </button>
      </section>

      <section>
        <h2 className="mb-3 font-display text-2xl tracking-tight text-ink dark:text-cream">
          Achievements
        </h2>
        <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4">
          {badges.map((b) => (
            <div
              key={b.id}
              className={cn(
                "flex w-28 shrink-0 flex-col items-center gap-2 rounded-3xl p-4 text-center shadow-soft transition",
                b.earned
                  ? "bg-surface-light dark:bg-elevated-dark"
                  : "bg-surface-light/60 opacity-60 dark:bg-elevated-dark/60",
              )}
            >
              <span
                className={cn(
                  "grid h-14 w-14 place-items-center rounded-2xl text-2xl",
                  b.earned
                    ? "bg-saffron-100 dark:bg-saffron-500/20"
                    : "bg-black/5 dark:bg-white/[0.06]",
                )}
              >
                {b.emoji}
              </span>
              <p className="text-xs font-semibold leading-tight text-ink dark:text-cream">
                {b.title}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-display text-2xl tracking-tight text-ink dark:text-cream">
          Rewards
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {rewards.map((r, i) => (
            <RewardCard
              key={r.id}
              reward={r}
              points={points}
              index={i}
              onRedeem={(reward) => showToast(`Redeemed: ${reward.title}`)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
