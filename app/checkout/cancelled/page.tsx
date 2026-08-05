"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function CancelledPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-10 text-center">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 180, damping: 18 }}
        className="grid h-24 w-24 place-items-center rounded-full bg-saffron-100 text-saffron-500 shadow-pop dark:bg-saffron-500/15"
      >
        <XCircle className="h-12 w-12" strokeWidth={1.8} />
      </motion.div>

      <h1 className="mt-8 font-display text-4xl tracking-tight text-ink dark:text-cream">
        Payment cancelled
      </h1>
      <p className="mt-3 text-sm text-ink-muted dark:text-cream/70">
        Your cart is still saved. Head back and try again whenever you&rsquo;re ready.
      </p>

      <div className="mt-8 flex w-full flex-col gap-3">
        <Link href="/cart">
          <Button fullWidth size="lg">
            Back to cart
          </Button>
        </Link>
        <Link href="/menu">
          <Button fullWidth size="lg" variant="secondary">
            Keep browsing
          </Button>
        </Link>
      </div>
    </div>
  );
}
