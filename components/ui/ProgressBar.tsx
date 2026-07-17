"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/format";

interface ProgressBarProps {
  value: number;
  max: number;
  className?: string;
}

export function ProgressBar({ value, max, className }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(1, value / Math.max(1, max)));
  return (
    <div
      className={cn(
        "h-2.5 w-full overflow-hidden rounded-full bg-black/5 dark:bg-white/[0.08]",
        className,
      )}
    >
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct * 100}%` }}
        transition={{ type: "spring", stiffness: 90, damping: 20 }}
        className="h-full rounded-full bg-gradient-to-r from-sage-500 to-sage-300"
      />
    </div>
  );
}
