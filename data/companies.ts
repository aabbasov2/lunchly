import type { Locale } from "@/lib/i18n";

export interface Company {
  id: string;
  name: string;
  name_et?: string;
  domain: string;
  color: string;
}

export const companies: Company[] = [
  {
    id: "krulli-y",
    name: "Y building",
    name_et: "Y-hoone",
    domain: "Krulli Kvartal",
    color: "#6E8A4E",
  },
  {
    id: "krulli-w",
    name: "W building",
    name_et: "W-hoone",
    domain: "Krulli Kvartal",
    color: "#B23A2E",
  },
];

export function companyLabel(company: Company, locale: Locale): string {
  return locale === "et" && company.name_et ? company.name_et : company.name;
}
