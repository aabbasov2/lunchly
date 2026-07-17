"use client";

import Link from "next/link";
import { CreditCard, Building2, Bell, LogOut, ChevronRight, Sparkles, Receipt } from "lucide-react";
import { user } from "@/data/user";
import { companies } from "@/data/companies";
import { useCompany } from "@/context/CompanyContext";
import { useLoyalty } from "@/context/LoyaltyContext";
import { formatPrice } from "@/lib/format";
import { Badge } from "@/components/ui/Badge";

export default function ProfilePage() {
  const { companyId } = useCompany();
  const { points } = useLoyalty();
  const company = companies.find((c) => c.id === (companyId ?? user.companyId));

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-surface-light p-6 shadow-soft dark:bg-elevated-dark">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-sage-400 to-sage-600 text-2xl font-bold text-white">
            {user.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-3xl tracking-tight text-ink dark:text-cream">
              {user.name}
            </h1>
            <p className="truncate text-sm text-ink-muted dark:text-cream/60">{user.email}</p>
            {company && (
              <Badge tone="sage" className="mt-2">
                <Building2 className="h-3 w-3" />
                {company.name}
              </Badge>
            )}
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Stat label="Points" value={String(points)} icon={<Sparkles className="h-4 w-4" />} />
          <Stat
            label="Orders"
            value={String(user.history.length)}
            icon={<Receipt className="h-4 w-4" />}
          />
          <Stat
            label="Payment"
            value={`•• ${user.paymentLast4}`}
            icon={<CreditCard className="h-4 w-4" />}
          />
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-display text-2xl tracking-tight text-ink dark:text-cream">
          Order history
        </h2>
        <ul className="space-y-2">
          {user.history.map((o) => (
            <li
              key={o.id}
              className="flex items-center justify-between gap-4 rounded-2xl bg-surface-light p-4 shadow-soft dark:bg-elevated-dark"
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold text-ink dark:text-cream">
                  {o.items.join(" · ")}
                </p>
                <p className="text-xs text-ink-muted dark:text-cream/60">
                  {o.date} · {o.id}
                </p>
              </div>
              <span className="text-sm font-semibold text-ink dark:text-cream">
                {formatPrice(o.total)}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-3 font-display text-2xl tracking-tight text-ink dark:text-cream">
          Settings
        </h2>
        <ul className="overflow-hidden rounded-3xl bg-surface-light shadow-soft dark:bg-elevated-dark">
          <SettingRow
            icon={<Building2 className="h-4 w-4" />}
            label="Workplace"
            value={company?.name ?? "Not set"}
            href="/company"
          />
          <SettingRow
            icon={<CreditCard className="h-4 w-4" />}
            label="Payment method"
            value={`${user.paymentBrand} •• ${user.paymentLast4}`}
          />
          <SettingRow
            icon={<Bell className="h-4 w-4" />}
            label="Notifications"
            value="Daily menu"
          />
          <SettingRow
            icon={<LogOut className="h-4 w-4" />}
            label="Sign out"
            tone="danger"
          />
        </ul>
      </section>
    </div>
  );
}

function Stat({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-cream-100 p-4 dark:bg-white/[0.04]">
      <div className="mb-1 inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-ink-muted dark:text-cream/60">
        {icon}
        {label}
      </div>
      <p className="font-display text-2xl text-ink dark:text-cream">{value}</p>
    </div>
  );
}

function SettingRow({
  icon,
  label,
  value,
  href,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
  href?: string;
  tone?: "danger";
}) {
  const content = (
    <div className="flex items-center gap-3 px-5 py-4 transition hover:bg-black/[0.02] dark:hover:bg-white/[0.03]">
      <div
        className={
          tone === "danger"
            ? "grid h-9 w-9 place-items-center rounded-xl bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-300"
            : "grid h-9 w-9 place-items-center rounded-xl bg-cream-100 text-ink-soft dark:bg-white/[0.06] dark:text-cream/80"
        }
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p
          className={
            tone === "danger"
              ? "text-sm font-semibold text-red-600 dark:text-red-300"
              : "text-sm font-semibold text-ink dark:text-cream"
          }
        >
          {label}
        </p>
        {value && (
          <p className="text-xs text-ink-muted dark:text-cream/60">{value}</p>
        )}
      </div>
      <ChevronRight className="h-4 w-4 text-ink-muted" />
    </div>
  );

  return (
    <li className="border-b border-black/5 last:border-b-0 dark:border-white/[0.06]">
      {href ? <Link href={href}>{content}</Link> : content}
    </li>
  );
}
