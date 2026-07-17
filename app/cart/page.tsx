"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag, Clock, Truck } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useLoyalty } from "@/context/LoyaltyContext";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/format";

export default function CartPage() {
  const { lines, increment, decrement, remove, subtotal, total, itemCount } = useCart();
  const { awardPoints } = useLoyalty();
  const router = useRouter();

  const handleCheckout = () => {
    const points = Math.max(30, Math.round(total * 10));
    awardPoints(points);
    router.push("/checkout/success");
  };

  if (itemCount === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center py-16 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="grid h-28 w-28 place-items-center rounded-full bg-cream-100 dark:bg-white/[0.05]"
        >
          <ShoppingBag className="h-12 w-12 text-ink-muted" strokeWidth={1.5} />
        </motion.div>
        <h1 className="mt-8 font-display text-4xl tracking-tight text-ink dark:text-cream">
          Your lunch awaits.
        </h1>
        <p className="mt-3 max-w-xs text-sm text-ink-muted dark:text-cream/60">
          Add something delicious for tomorrow&rsquo;s delivery.
        </p>
        <Link href="/menu" className="mt-8">
          <Button size="lg">Browse Menu</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-[1fr_360px] md:items-start">
      <div>
        <div className="mb-6">
          <h1 className="font-display text-4xl tracking-tight text-ink dark:text-cream">
            Your cart
          </h1>
          <p className="mt-1 text-sm text-ink-muted dark:text-cream/60">
            {itemCount} {itemCount === 1 ? "item" : "items"} · delivered tomorrow
          </p>
        </div>

        <ul className="space-y-3">
          <AnimatePresence initial={false}>
            {lines.map((line) => (
              <motion.li
                key={line.meal.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.25 }}
                className="flex items-center gap-4 rounded-3xl bg-surface-light p-3 shadow-soft dark:bg-elevated-dark"
              >
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl">
                  <Image
                    src={line.meal.image}
                    alt={line.meal.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="truncate text-sm font-semibold text-ink dark:text-cream">
                      {line.meal.name}
                    </h3>
                    <button
                      onClick={() => remove(line.meal.id)}
                      className="text-ink-muted transition hover:text-saffron-500"
                      aria-label={`Remove ${line.meal.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-xs text-ink-muted dark:text-cream/60">
                    {formatPrice(line.meal.price)} each
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-1 rounded-full bg-black/[0.04] p-1 dark:bg-white/[0.06]">
                      <button
                        onClick={() => decrement(line.meal.id)}
                        className="grid h-7 w-7 place-items-center rounded-full text-ink transition hover:bg-white dark:text-cream dark:hover:bg-white/[0.08]"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-6 text-center text-sm font-semibold text-ink dark:text-cream">
                        {line.quantity}
                      </span>
                      <button
                        onClick={() => increment(line.meal.id)}
                        className="grid h-7 w-7 place-items-center rounded-full text-ink transition hover:bg-white dark:text-cream dark:hover:bg-white/[0.08]"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <span className="text-sm font-semibold text-ink dark:text-cream">
                      {formatPrice(line.meal.price * line.quantity)}
                    </span>
                  </div>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>

      <aside className="sticky top-20 space-y-4 rounded-3xl bg-surface-light p-5 shadow-soft dark:bg-elevated-dark">
        <div className="space-y-2 text-sm">
          <Row label="Subtotal" value={formatPrice(subtotal)} />
          <Row
            label="Delivery"
            value={<span className="font-semibold text-sage-500">Free</span>}
          />
          <div className="border-t border-black/5 pt-3 dark:border-white/[0.06]">
            <Row
              label={<span className="text-base font-semibold">Total</span>}
              value={
                <span className="text-lg font-semibold text-ink dark:text-cream">
                  {formatPrice(total)}
                </span>
              }
            />
          </div>
        </div>

        <Button fullWidth size="lg" onClick={handleCheckout}>
          Schedule for Tomorrow
        </Button>

        <div className="flex items-start gap-3 rounded-2xl bg-sage-50 p-3 text-xs text-sage-700 dark:bg-sage-500/10 dark:text-sage-200">
          <Clock className="mt-0.5 h-4 w-4 shrink-0" />
          <p>This order will be delivered tomorrow during lunch (11:30–13:00).</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-ink-muted dark:text-cream/60">
          <Truck className="h-3.5 w-3.5" />
          Free delivery on every order
        </div>
      </aside>
    </div>
  );
}

function Row({ label, value }: { label: React.ReactNode; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-ink-muted dark:text-cream/70">{label}</span>
      <span className="text-ink dark:text-cream">{value}</span>
    </div>
  );
}
