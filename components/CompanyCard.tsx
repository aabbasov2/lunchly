"use client";

import { Check } from "lucide-react";
import { motion } from "framer-motion";
import type { Company } from "@/data/companies";
import { cn } from "@/lib/format";

interface CompanyCardProps {
  company: Company;
  selected: boolean;
  onSelect: () => void;
  index?: number;
}

export function CompanyCard({ company, selected, onSelect, index = 0 }: CompanyCardProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className={cn(
        "flex items-center justify-between rounded-2xl border p-4 text-left transition-all",
        selected
          ? "border-sage-500 bg-sage-50 shadow-ring dark:bg-sage-500/15"
          : "border-black/5 bg-surface-light hover:border-black/10 dark:border-white/[0.06] dark:bg-elevated-dark dark:hover:border-white/[0.12]",
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className="grid h-11 w-11 place-items-center rounded-xl text-sm font-bold text-white"
          style={{ backgroundColor: company.color }}
        >
          {company.name.charAt(0)}
        </div>
        <div>
          <p className="font-semibold text-ink dark:text-cream">{company.name}</p>
          <p className="text-xs text-ink-muted dark:text-cream/60">{company.domain}</p>
        </div>
      </div>
      <div
        className={cn(
          "grid h-6 w-6 place-items-center rounded-full border-2 transition",
          selected
            ? "border-sage-500 bg-sage-500 text-white"
            : "border-black/10 bg-transparent dark:border-white/[0.12]",
        )}
      >
        {selected && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
      </div>
    </motion.button>
  );
}
