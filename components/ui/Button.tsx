"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/format";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

const sizeMap: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-14 px-7 text-base",
};

const variantMap: Record<Variant, string> = {
  primary:
    "bg-ink text-cream hover:bg-ink-soft active:scale-[0.98] shadow-soft dark:bg-cream dark:text-ink dark:hover:bg-cream-100",
  secondary:
    "bg-cream-100 text-ink hover:bg-cream-50 border border-black/5 dark:bg-elevated-dark dark:text-cream dark:border-white/10 dark:hover:bg-white/[0.06]",
  ghost:
    "bg-transparent text-ink hover:bg-black/5 dark:text-cream dark:hover:bg-white/[0.06]",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", size = "md", fullWidth, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 focus-visible:ring-offset-2 focus-visible:ring-offset-cream dark:focus-visible:ring-offset-surface-dark",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        sizeMap[size],
        variantMap[variant],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    />
  );
});
