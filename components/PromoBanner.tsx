"use client";

import { Truck } from "lucide-react";
import { useT } from "@/context/LanguageContext";

export function PromoBanner() {
  const { t } = useT();
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-sage-500 px-4 py-3 text-sm font-medium text-white shadow-soft">
      <div className="grid h-9 w-9 place-items-center rounded-full bg-white/15">
        <Truck className="h-4 w-4" />
      </div>
      <div className="flex-1">
        <p className="font-semibold">{t("promo.title")}</p>
        <p className="text-xs text-white/80">{t("promo.subtitle")}</p>
      </div>
    </div>
  );
}
