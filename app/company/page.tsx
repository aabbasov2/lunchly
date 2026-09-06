"use client";

import { companies, companyLabel } from "@/data/companies";
import { CompanyCard } from "@/components/CompanyCard";
import { useCompany } from "@/context/CompanyContext";
import { useToast } from "@/context/ToastContext";
import { useT } from "@/context/LanguageContext";

export default function CompanyPage() {
  const { companyId, setCompany } = useCompany();
  const { showToast } = useToast();
  const { t, locale } = useT();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-4xl tracking-tight text-ink dark:text-cream">
          {t("company.title")}
        </h1>
        <p className="mt-1 text-sm text-ink-muted dark:text-cream/60">
          {t("company.subtitle")}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {companies.map((c, i) => (
          <CompanyCard
            key={c.id}
            company={c}
            index={i}
            selected={companyId === c.id}
            onSelect={() => {
              setCompany(c.id);
              showToast(t("company.deliveringToToast", { name: companyLabel(c, locale) }));
            }}
          />
        ))}
      </div>
    </div>
  );
}
