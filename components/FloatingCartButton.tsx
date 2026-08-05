"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";

export function FloatingCartButton() {
  const pathname = usePathname();
  const { itemCount, subtotal } = useCart();
  const visible = itemCount > 0 && !pathname.startsWith("/cart") && !pathname.startsWith("/checkout");

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="fixed inset-x-0 bottom-[76px] z-30 mx-auto flex max-w-md justify-center px-4 pb-[env(safe-area-inset-bottom)] md:hidden"
        >
          <Link
            href="/cart"
            className="flex w-full items-center justify-between rounded-full bg-ink px-5 py-3.5 text-cream shadow-pop transition-transform hover:scale-[1.01] active:scale-[0.99] dark:bg-cream dark:text-ink"
          >
            <span className="flex items-center gap-3">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-sm font-bold dark:bg-ink/10">
                {itemCount}
              </span>
              <span className="text-sm font-semibold">View Cart</span>
            </span>
            <span className="flex items-center gap-2 text-sm font-semibold">
              <ShoppingBag className="h-4 w-4" />
              {formatPrice(subtotal)}
            </span>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
