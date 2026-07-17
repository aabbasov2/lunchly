import { cn } from "@/lib/format";
import type { ReactNode } from "react";

type Tone = "sage" | "saffron" | "ink" | "neutral";

interface BadgeProps {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}

const toneMap: Record<Tone, string> = {
  sage: "bg-sage-100 text-sage-700 dark:bg-sage-500/20 dark:text-sage-200",
  saffron: "bg-saffron-100 text-saffron-600 dark:bg-saffron-500/20 dark:text-saffron-200",
  ink: "bg-ink text-cream dark:bg-cream dark:text-ink",
  neutral: "bg-black/5 text-ink-soft dark:bg-white/[0.08] dark:text-cream/80",
};

export function Badge({ children, tone = "neutral", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium tracking-wide",
        toneMap[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
