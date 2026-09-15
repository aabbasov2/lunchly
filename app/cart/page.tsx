"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag, Clock, Truck, CreditCard, CalendarDays } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useCompany } from "@/context/CompanyContext";
import { useToast } from "@/context/ToastContext";
import { useT } from "@/context/LanguageContext";
import { useInventory } from "@/context/InventoryContext";
import { Button } from "@/components/ui/Button";
import { AlertTriangle } from "lucide-react";
import { mealName, sideNameFor, saladNameFor } from "@/data/meals";
import { formatPrice, cn } from "@/lib/format";
import {
  getCutoffInfo,
  isTomorrow,
  formatDeliveryDayLong,
  formatCutoffStamp,
  type CutoffInfo,
} from "@/lib/cutoff";

interface FieldErrors {
  name?: string;
  phone?: string;
}

export default function CartPage() {
  const { lines, increment, decrement, remove, subtotal, total, itemCount } = useCart();
  const { companyName, companyDisplay } = useCompany();
  const { showToast } = useToast();
  const { t, locale } = useT();
  const { remainingFor, isSoldOut, isLowStock, refresh } = useInventory();

  useEffect(() => {
    refresh();
  }, [refresh]);

  const totalByMeal = new Map<string, number>();
  for (const line of lines) {
    totalByMeal.set(line.meal.id, (totalByMeal.get(line.meal.id) ?? 0) + line.quantity);
  }
  const perMealStatus = new Map<
    string,
    { soldOut: boolean; overLimit: boolean; lowStock: boolean; remaining: number | null; have: number }
  >();
  for (const [mealId, have] of totalByMeal) {
    const remaining = remainingFor(mealId);
    perMealStatus.set(mealId, {
      soldOut: isSoldOut(mealId),
      overLimit: remaining !== null && have > remaining,
      lowStock: isLowStock(mealId),
      remaining,
      have,
    });
  }
  const conflicts = Array.from(perMealStatus.entries()).filter(
    ([, s]) => s.soldOut || s.overLimit,
  );
  const hasConflict = conflicts.length > 0;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [cutoff, setCutoff] = useState<CutoffInfo | null>(null);

  useEffect(() => {
    setCutoff(getCutoffInfo());
    const id = setInterval(() => setCutoff(getCutoffInfo()), 1000);
    return () => clearInterval(id);
  }, []);

  const validate = (): FieldErrors => {
    const next: FieldErrors = {};
    if (!name.trim()) next.name = t("cart.errName");
    if (!phone.trim()) next.phone = t("cart.errPhone");
    return next;
  };

  const handleCheckout = async () => {
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      showToast(t("cart.fillRequired"));
      return;
    }
    setErrors({});
    setSubmitting(true);
    const snap = cutoff ?? getCutoffInfo();
    const pad = (n: number) => String(n).padStart(2, "0");
    const deliveryDate = `${snap.deliveryDate.getFullYear()}-${pad(snap.deliveryDate.getMonth() + 1)}-${pad(snap.deliveryDate.getDate())}`;
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
          deliveryDate,
          items: lines.map((line) => ({
            id: line.meal.id,
            name: line.meal.name,
            side: sideNameFor(line.sideId, "en") ?? "",
            salad: saladNameFor(line.saladId, "en") ?? "",
            quantity: line.quantity,
            unitPrice: line.unitPrice,
          })),
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
          mealName?: string;
        };
        if (res.status === 409 && data.mealName) {
          showToast(t("cart.soldOutItem", { name: data.mealName }));
          setSubmitting(false);
          return;
        }
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }
      const { url } = (await res.json()) as { url: string };
      window.location.href = url;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      showToast(t("cart.checkoutFailed", { message }));
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
          {t("cart.emptyTitle")}
        </h1>
        <p className="mt-3 max-w-xs text-sm text-ink-muted dark:text-cream/60">
          {t("cart.emptyBody")}
        </p>
        <Link href="/menu" className="mt-8">
          <Button size="lg">{t("cart.browseMenu")}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-[1fr_360px] md:items-start">
      <div>
        <div className="mb-6">
          <h1 className="font-display text-4xl tracking-tight text-ink dark:text-cream">
            {t("cart.title")}
          </h1>
          <p className="mt-1 text-sm text-ink-muted dark:text-cream/60">
            {t(itemCount === 1 ? "cart.itemsOne" : "cart.itemsMany", {
              count: itemCount,
              day: cutoff
                ? isTomorrow(cutoff.deliveryDate)
                  ? t("countdown.tomorrow")
                  : formatDeliveryDayLong(cutoff.deliveryDate, locale)
                : "—",
            })}
          </p>
        </div>

        {hasConflict && (
          <div
            role="alert"
            className="mb-4 rounded-3xl border border-saffron-500/40 bg-saffron-500/10 p-4 text-sm dark:border-saffron-500/50 dark:bg-saffron-500/[0.08]"
          >
            <div className="flex items-start gap-3">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-saffron-500 text-white">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-saffron-700 dark:text-saffron-100">
                  {t("cart.conflictBannerTitle")}
                </p>
                <ul className="mt-1 space-y-1 text-xs text-saffron-700/90 dark:text-saffron-100/90">
                  {conflicts.map(([mealId, s]) => {
                    const line = lines.find((l) => l.meal.id === mealId);
                    const name = line ? mealName(line.meal, locale) : mealId;
                    if (s.soldOut) {
                      return (
                        <li key={mealId}>
                          {t("cart.conflictSoldOutLine", { name })}
                        </li>
                      );
                    }
                    return (
                      <li key={mealId}>
                        {t("cart.conflictBannerLine", {
                          name,
                          n: s.remaining ?? 0,
                          have: s.have,
                        })}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        )}

        <ul className="space-y-3">
          <AnimatePresence initial={false}>
            {lines.map((line) => {
              const side = sideNameFor(line.sideId, locale);
              const salad = saladNameFor(line.saladId, locale);
              const combo = [side, salad].filter(Boolean).join(" · ");
              const lineName = mealName(line.meal, locale);
              const status = perMealStatus.get(line.meal.id);
              const lineSoldOut = status?.soldOut ?? false;
              const lineOverLimit = status?.overLimit ?? false;
              const lineLowStock = status?.lowStock ?? false;
              const lineRemaining = status?.remaining ?? null;
              const disableIncrement =
                lineSoldOut ||
                lineOverLimit ||
                (lineRemaining !== null && (status?.have ?? 0) >= lineRemaining);
              return (
                <motion.li
                  key={line.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.25 }}
                  className={cn(
                    "flex items-center gap-4 rounded-3xl bg-surface-light p-3 shadow-soft dark:bg-elevated-dark",
                    (lineSoldOut || lineOverLimit) &&
                      "ring-1 ring-saffron-500/40 dark:ring-saffron-500/50",
                  )}
                >
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl">
                    <Image
                      src={line.meal.image}
                      alt={lineName}
                      fill
                      sizes="80px"
                      className={cn("object-cover", lineSoldOut && "grayscale")}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="truncate text-sm font-semibold text-ink dark:text-cream">
                        {lineName}
                      </h3>
                      <button
                        onClick={() => remove(line.id)}
                        className="text-ink-muted transition hover:text-saffron-500"
                        aria-label={t("cart.removeAria", { name: lineName })}
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
                      {formatPrice(line.unitPrice)} {t("cart.each")}
                    </p>
                    {(lineSoldOut || lineOverLimit || lineLowStock) && (
                      <div className="mt-1.5">
                        {lineSoldOut ? (
                          <span className="inline-flex items-center rounded-full bg-saffron-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-saffron-600 dark:text-saffron-200">
                            {t("cart.soldOutLine")}
                          </span>
                        ) : lineOverLimit && lineRemaining !== null ? (
                          <span className="inline-flex items-center rounded-full bg-saffron-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-saffron-600 dark:text-saffron-200">
                            {t("cart.overLimitBadge", { n: lineRemaining })}
                          </span>
                        ) : lineLowStock && lineRemaining !== null ? (
                          <span className="inline-flex items-center rounded-full bg-saffron-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-saffron-600 dark:bg-saffron-500/15 dark:text-saffron-200">
                            {t("cart.leftBadge", { n: lineRemaining })}
                          </span>
                        ) : null}
                      </div>
                    )}
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-1 rounded-full bg-black/[0.04] p-1 dark:bg-white/[0.06]">
                        <button
                          onClick={() => decrement(line.id)}
                          className="grid h-7 w-7 place-items-center rounded-full text-ink transition hover:bg-white dark:text-cream dark:hover:bg-white/[0.08]"
                          aria-label={t("cart.decAria")}
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-6 text-center text-sm font-semibold text-ink dark:text-cream">
                          {line.quantity}
                        </span>
                        <button
                          onClick={() => increment(line.id)}
                          disabled={disableIncrement}
                          className={cn(
                            "grid h-7 w-7 place-items-center rounded-full text-ink transition dark:text-cream",
                            disableIncrement
                              ? "cursor-not-allowed opacity-40"
                              : "hover:bg-white dark:hover:bg-white/[0.08]",
                          )}
                          aria-label={t("cart.incAria")}
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
        {cutoff && (
          <div className="space-y-2.5 rounded-2xl border border-sage-500/20 bg-sage-50 p-3 dark:border-sage-500/25 dark:bg-sage-500/[0.08]">
            <div className="flex items-start gap-2.5">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-sage-500 text-white">
                <CalendarDays className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1 text-xs">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-sage-700 dark:text-sage-200/80">
                  {t("cart.deliveryOn")}
                </p>
                <p className="mt-0.5 text-sm font-semibold text-ink dark:text-cream">
                  {isTomorrow(cutoff.deliveryDate)
                    ? t("countdown.tomorrow")
                    : formatDeliveryDayLong(cutoff.deliveryDate, locale)}
                </p>
                <p className="text-ink-muted dark:text-cream/70">{t("cart.deliveryWindow")}</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5 border-t border-sage-500/15 pt-2.5 dark:border-sage-500/25">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-saffron-500 text-white">
                <Clock className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1 text-xs">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-saffron-600 dark:text-saffron-200/80">
                  {t("cart.orderBy")}
                </p>
                <p className="mt-0.5 text-sm font-semibold text-ink dark:text-cream">
                  {formatCutoffStamp(cutoff.cutoffDate, locale)}
                </p>
                <p className="text-ink-muted dark:text-cream/70">
                  {t("cart.timeLeft", {
                    hours: cutoff.hours,
                    minutes: String(cutoff.minutes).padStart(2, "0"),
                  })}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2 text-sm">
          <Row label={t("cart.subtotal")} value={formatPrice(subtotal)} />
          <Row
            label={t("cart.delivery")}
            value={<span className="font-semibold text-sage-500">{t("cart.free")}</span>}
          />
          <div className="border-t border-black/5 pt-3 dark:border-white/[0.06]">
            <Row
              label={<span className="text-base font-semibold">{t("cart.total")}</span>}
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
            label={t("cart.nameLabel")}
            value={name}
            onChange={(v) => {
              setName(v);
              if (errors.name) setErrors((e) => ({ ...e, name: undefined }));
            }}
            placeholder={t("cart.namePlaceholder")}
            autoComplete="name"
            type="text"
            required
            error={errors.name}
          />
          <Field
            id="orderer-phone"
            label={t("cart.phoneLabel")}
            value={phone}
            onChange={(v) => {
              setPhone(v);
              if (errors.phone) setErrors((e) => ({ ...e, phone: undefined }));
            }}
            placeholder={t("cart.phonePlaceholder")}
            autoComplete="tel"
            type="tel"
            required
            error={errors.phone}
          />
          <NotesField
            value={notes}
            onChange={setNotes}
            labelText={t("cart.notesLabel")}
            optionalText={t("cart.notesOptional")}
            placeholderText={t("cart.notesPlaceholder")}
          />
          {companyDisplay && (
            <p className="text-[11px] text-ink-muted dark:text-cream/60">
              {t("cart.deliveringTo")} <span className="font-semibold">{companyDisplay}</span>
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 rounded-2xl bg-cream-100 px-3 py-2.5 text-xs text-ink-soft dark:bg-white/[0.04] dark:text-cream/80">
          <CreditCard className="h-4 w-4 shrink-0 text-saffron-500" />
          <span>
            {t("cart.secureCard")} <span className="font-semibold">Stripe</span>
          </span>
        </div>

        <Button
          fullWidth
          size="lg"
          onClick={handleCheckout}
          disabled={submitting || hasConflict}
        >
          {submitting
            ? t("cart.redirecting")
            : hasConflict
              ? t("cart.fixCartToContinue")
              : t("cart.payButton", { total: formatPrice(total) })}
        </Button>

        <div className="flex items-center gap-2 text-xs text-ink-muted dark:text-cream/60">
          <Truck className="h-3.5 w-3.5" />
          {t("cart.freeDeliveryHint")}
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

function NotesField({
  value,
  onChange,
  labelText,
  optionalText,
  placeholderText,
}: {
  value: string;
  onChange: (v: string) => void;
  labelText: string;
  optionalText: string;
  placeholderText: string;
}) {
  const MAX = 300;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label
          htmlFor="orderer-notes"
          className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted dark:text-cream/60"
        >
          {labelText} <span className="text-ink-muted/70">{optionalText}</span>
        </label>
        <span className="text-[10px] text-ink-muted dark:text-cream/50">
          {value.length}/{MAX}
        </span>
      </div>
      <textarea
        id="orderer-notes"
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, MAX))}
        placeholder={placeholderText}
        rows={3}
        className="w-full resize-none rounded-2xl border border-black/5 bg-cream-100 px-4 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-sage-500 focus:outline-none focus:ring-2 focus:ring-sage-500/20 dark:border-white/[0.06] dark:bg-white/[0.04] dark:text-cream dark:placeholder:text-cream/40"
      />
    </div>
  );
}
