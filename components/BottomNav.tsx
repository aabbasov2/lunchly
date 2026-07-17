"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, UtensilsCrossed, ShoppingBag, Sparkles, User } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/format";

const items = [
  { href: "/", label: "Home", icon: Home },
  { href: "/menu", label: "Menu", icon: UtensilsCrossed },
  { href: "/cart", label: "Cart", icon: ShoppingBag },
  { href: "/rewards", label: "Rewards", icon: Sparkles },
  { href: "/profile", label: "Profile", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();
  const { itemCount } = useCart();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-black/5 bg-cream/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-lg dark:border-white/[0.06] dark:bg-surface-dark/90"
      aria-label="Primary"
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-between px-2">
        {items.map((item) => {
          const active =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                className={cn(
                  "relative flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors",
                  active
                    ? "text-ink dark:text-cream"
                    : "text-ink-muted dark:text-cream/60",
                )}
              >
                <span className="relative">
                  <Icon className="h-[22px] w-[22px]" strokeWidth={active ? 2.4 : 1.8} />
                  {item.href === "/cart" && itemCount > 0 && (
                    <span className="absolute -right-2 -top-1 grid h-4 min-w-[16px] place-items-center rounded-full bg-saffron-500 px-1 text-[10px] font-bold text-white">
                      {itemCount}
                    </span>
                  )}
                </span>
                {item.label}
                {active && (
                  <motion.span
                    layoutId="bottom-nav-active"
                    className="absolute -top-[1px] left-1/2 h-1 w-8 -translate-x-1/2 rounded-full bg-ink dark:bg-cream"
                    transition={{ type: "spring", stiffness: 500, damping: 40 }}
                  />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
