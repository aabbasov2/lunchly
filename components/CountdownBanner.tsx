"use client";

import { Clock } from "lucide-react";
import { useEffect, useState } from "react";
import {
  getCutoffInfo,
  isTomorrow,
  formatDeliveryDayShort,
  type CutoffInfo,
} from "@/lib/cutoff";
import { useT } from "@/context/LanguageContext";

export function CountdownBanner() {
  const [info, setInfo] = useState<CutoffInfo | null>(null);
  const { t, locale } = useT();

  useEffect(() => {
    setInfo(getCutoffInfo());
    const id = setInterval(() => setInfo(getCutoffInfo()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!info) {
    return (
      <div className="h-11 rounded-full bg-black/[0.03] dark:bg-white/[0.04]" aria-hidden />
    );
  }

  const dayLabel = isTomorrow(info.deliveryDate)
    ? t("countdown.tomorrow")
    : formatDeliveryDayShort(info.deliveryDate, locale);

  return (
    <div
      className="flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 rounded-full bg-saffron-50 px-4 py-2.5 text-sm font-medium text-saffron-600 dark:bg-saffron-500/10 dark:text-saffron-200"
      role="status"
    >
      <Clock className="h-4 w-4" />
      <span>{t("countdown.nextDelivery", { day: dayLabel })}</span>
      <span className="opacity-60">·</span>
      <span>
        {t("countdown.closesIn")}{" "}
        <strong className="font-semibold">
          {info.hours}h {String(info.minutes).padStart(2, "0")}m
        </strong>
      </span>
    </div>
  );
}
