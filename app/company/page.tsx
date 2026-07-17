"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Mail, MailCheck } from "lucide-react";
import { companies } from "@/data/companies";
import { CompanyCard } from "@/components/CompanyCard";
import { useCompany } from "@/context/CompanyContext";
import { useToast } from "@/context/ToastContext";
import { Button } from "@/components/ui/Button";

export default function CompanyPage() {
  const { companyId, setCompany } = useCompany();
  const { showToast } = useToast();
  const [query, setQuery] = useState("");
  const [showUnsupported, setShowUnsupported] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const filtered = companies.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase()),
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    showToast("We'll be in touch soon");
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-4xl tracking-tight text-ink dark:text-cream">
          Where do you work?
        </h1>
        <p className="mt-1 text-sm text-ink-muted dark:text-cream/60">
          We deliver to select partner companies. Pick yours to get started.
        </p>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search your company"
          className="h-12 w-full rounded-full border border-black/5 bg-surface-light pl-11 pr-4 text-sm text-ink placeholder:text-ink-muted focus:border-sage-500 focus:outline-none focus:ring-2 focus:ring-sage-500/20 dark:border-white/[0.06] dark:bg-elevated-dark dark:text-cream dark:placeholder:text-cream/40"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {filtered.map((c, i) => (
          <CompanyCard
            key={c.id}
            company={c}
            index={i}
            selected={companyId === c.id}
            onSelect={() => {
              setCompany(c.id);
              showToast(`Great, we deliver to ${c.name}`);
            }}
          />
        ))}
      </div>

      <button
        onClick={() => setShowUnsupported((v) => !v)}
        className="text-sm font-medium text-sage-500 underline-offset-4 hover:underline"
      >
        My company isn&rsquo;t here
      </button>

      {showUnsupported && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl bg-saffron-50 p-6 shadow-soft dark:bg-saffron-500/10"
        >
          {submitted ? (
            <div className="flex items-center gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-saffron-500 text-white">
                <MailCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-ink dark:text-cream">You&rsquo;re on the list</h3>
                <p className="text-sm text-ink-muted dark:text-cream/70">
                  We&rsquo;ll email you the moment lunch reaches your building.
                </p>
              </div>
            </div>
          ) : (
            <>
              <h3 className="font-display text-2xl text-ink dark:text-cream">
                We&rsquo;re expanding
              </h3>
              <p className="mt-1 text-sm text-ink-muted dark:text-cream/70">
                Leave your email and we&rsquo;ll notify you when delivery becomes available.
              </p>
              <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2 sm:flex-row">
                <div className="relative flex-1">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="h-12 w-full rounded-full border border-black/5 bg-surface-light pl-11 pr-4 text-sm text-ink placeholder:text-ink-muted focus:border-saffron-500 focus:outline-none focus:ring-2 focus:ring-saffron-500/20 dark:border-white/[0.06] dark:bg-elevated-dark dark:text-cream dark:placeholder:text-cream/40"
                  />
                </div>
                <Button type="submit" size="lg">
                  Notify me
                </Button>
              </form>
            </>
          )}
        </motion.div>
      )}
    </div>
  );
}
