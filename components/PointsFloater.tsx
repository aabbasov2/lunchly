"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useEffect } from "react";
import { useLoyalty } from "@/context/LoyaltyContext";

export function PointsFloaterHost() {
  const { floaters, dismissFloater } = useLoyalty();

  useEffect(() => {
    if (floaters.length === 0) return;
    const timers = floaters.map((f) =>
      setTimeout(() => dismissFloater(f.id), 2200),
    );
    return () => timers.forEach(clearTimeout);
  }, [floaters, dismissFloater]);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[90] flex flex-col items-center gap-2">
      <AnimatePresence>
        {floaters.map((f) => (
          <motion.div
            key={f.id}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: -20, scale: 1 }}
            exit={{ opacity: 0, y: -60, scale: 0.9 }}
            transition={{ duration: 1.8, ease: "easeOut" }}
            className="flex items-center gap-2 rounded-full bg-sage-500 px-4 py-2 text-sm font-semibold text-white shadow-pop"
          >
            <Sparkles className="h-4 w-4" />
            <span>+{f.amount} Lunch Points</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
