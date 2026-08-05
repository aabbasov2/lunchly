"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag, Clock, Truck, CreditCard } from "lucide-react";
import { useCart, sideName, saladName } from "@/context/CartContext";
import { useCompany } from "@/context/CompanyContext";
import { useToast } from "@/context/ToastContext";
import { Button } from "@/components/ui/Button";
import { formatPrice, cn } from "@/lib/format";

interface FieldErrors {
  name?: string;
  phone?: string;
}

export default function CartPage() {
  const { lines, increment, decrement, remove, subtotal, total, itemCount } = useCart();
  const { companyName } = useCompany();
  const { showToast } = useToast();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = (): FieldErrors => {
    const next: FieldErrors = {};
    if (!name.trim()) next.name = "Please enter your name";
    if (!phone.trim()) next.phone = "Please enter your phone number";
    return next;
  };

  const handleCheckout = async () => {
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      showToast("Please fill in the required fields");
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          company: companyName ?? "",
          notes: notes.trim(),
          total,
          items: lines.map((line) => ({
            name: line.meal.name,
            side: sideName(line.sideId) ?? "",
            salad: saladName(line.saladId) ?? "",
            quantity: line.quantity,
            unitPrice: line.unitPrice,
          })),
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }
      const { url } = (await res.json()) as { url: string };
      window.location.href = url;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      showToast(`Checkout failed: ${message}`);
      setSubmitting(false);
    }
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
            {lines.map((line) => {
              const side = sideName(line.sideId);
              const salad = saladName(line.saladId);
              const combo = [side, salad].filter(Boolean).join(" · ");
              return (
                <motion.li
                  key={line.id}
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
                        onClick={() => remove(line.id)}
                        className="text-ink-muted transition hover:text-saffron-500"
                        aria-label={`Remove ${line.meal.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    {combo && (
                      <p className="truncate text-xs text-ink-muted dark:text-cream/70">
                        {combo}
                      </p>
                    )}
                    <p className="text-xs text-ink-muted dark:text-cream/60">
                      {formatPrice(line.unitPrice)} each
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-1 rounded-full bg-black/[0.04] p-1 dark:bg-white/[0.06]">
                        <button
                          onClick={() => decrement(line.id)}
                          className="grid h-7 w-7 place-items-center rounded-full text-ink transition hover:bg-white dark:text-cream dark:hover:bg-white/[0.08]"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-6 text-center text-sm font-semibold text-ink dark:text-cream">
                          {line.quantity}
                        </span>
                        <button
                          onClick={() => increment(line.id)}
                          className="grid h-7 w-7 place-items-center rounded-full text-ink transition hover:bg-white dark:text-cream dark:hover:bg-white/[0.08]"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <span className="text-sm font-semibold text-ink dark:text-cream">
                        {formatPrice(line.unitPrice * line.quantity)}
                      </span>
                    </div>
                  </div>
                </motion.li>
              );
            })}
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

        <div className="space-y-3">
          <Field
            id="orderer-name"
            label="Your name"
            value={name}
            onChange={(v) => {
              setName(v);
              if (errors.name) setErrors((e) => ({ ...e, name: undefined }));
            }}
            placeholder="e.g. Alex Novak"
            autoComplete="name"
            type="text"
            required
            error={errors.name}
          />
          <Field
            id="orderer-phone"
            label="Phone number"
            value={phone}
            onChange={(v) => {
              setPhone(v);
              if (errors.phone) setErrors((e) => ({ ...e, phone: undefined }));
            }}
            placeholder="e.g. +372 555 1234"
            autoComplete="tel"
            type="tel"
            required
            error={errors.phone}
          />
          <NotesField value={notes} onChange={setNotes} />
          {companyName && (
            <p className="text-[11px] text-ink-muted dark:text-cream/60">
              Delivering to <span className="font-semibold">{companyName}</span>
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 rounded-2xl bg-cream-100 px-3 py-2.5 text-xs text-ink-soft dark:bg-white/[0.04] dark:text-cream/80">
          <CreditCard className="h-4 w-4 shrink-0 text-saffron-500" />
          <span>
            Secure card payment via <span className="font-semibold">Stripe</span>
          </span>
        </div>

        <Button fullWidth size="lg" onClick={handleCheckout} disabled={submitting}>
          {submitting ? "Redirecting…" : `Pay ${formatPrice(total)} · Stripe`}
        </Button>

        <div className="flex items-start gap-3 rounded-2xl bg-sage-50 p-3 text-xs text-sage-700 dark:bg-sage-500/10 dark:text-sage-200">
          <Clock className="mt-0.5 h-4 w-4 shrink-0" />
          <p>Delivered tomorrow during lunch (11:30–13:00).</p>
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

function Field({
  id,
  label,
  value,
  onChange,
  placeholder,
  autoComplete,
  type,
  required,
  error,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  autoComplete: string;
  type: string;
  required?: boolean;
  error?: string;
}) {
  const errorId = `${id}-error`;
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted dark:text-cream/60"
      >
        {label} {required && <span className="text-saffron-500">*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          "h-11 w-full rounded-2xl border px-4 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 dark:text-cream dark:placeholder:text-cream/40",
          error
            ? "border-saffron-500 bg-saffron-500/[0.06] focus:border-saffron-500 focus:ring-saffron-500/25 dark:bg-saffron-500/[0.08]"
            : "border-black/5 bg-cream-100 focus:border-sage-500 focus:ring-sage-500/20 dark:border-white/[0.06] dark:bg-white/[0.04]",
        )}
      />
      {error && (
        <p id={errorId} className="flex items-center gap-1 text-[11px] font-medium text-saffron-600 dark:text-saffron-200">
          {error}
        </p>
      )}
    </div>
  );
}

function NotesField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const MAX = 300;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label
          htmlFor="orderer-notes"
          className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted dark:text-cream/60"
        >
          Notes <span className="text-ink-muted/70">(optional)</span>
        </label>
        <span className="text-[10px] text-ink-muted dark:text-cream/50">
          {value.length}/{MAX}
        </span>
      </div>
      <textarea
        id="orderer-notes"
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, MAX))}
        placeholder="Anything the kitchen or driver should know? Allergies, floor, gate code…"
        rows={3}
        className="w-full resize-none rounded-2xl border border-black/5 bg-cream-100 px-4 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-sage-500 focus:outline-none focus:ring-2 focus:ring-sage-500/20 dark:border-white/[0.06] dark:bg-white/[0.04] dark:text-cream dark:placeholder:text-cream/40"
      />
    </div>
  );
}
