"use client";

import { Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { getCutoffInfo, type CutoffInfo } from "@/lib/cutoff";
import { useT } from "@/context/LanguageContext";

export function CountdownBanner() {
  const [info, setInfo] = useState<CutoffInfo | null>(null);
  const { t } = useT();

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

  return (
    <div
      className="flex items-center justify-center gap-2 rounded-full bg-saffron-50 px-4 py-2.5 text-sm font-medium text-saffron-600 dark:bg-saffron-500/10 dark:text-saffron-200"
      role="status"
    >
      <Clock className="h-4 w-4" />
      {info.closed ? (
        <span>{t("countdown.closed")}</span>
      ) : (
        <span>
          {t("countdown.closesInPrefix")}{" "}
          <strong className="font-semibold">
            {info.hours}h {String(info.minutes).padStart(2, "0")}m
          </strong>
          {t("countdown.closesInSuffix") && " " + t("countdown.closesInSuffix")}
        </span>
      )}
    </div>
  );
}
