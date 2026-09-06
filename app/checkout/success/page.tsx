"use client";

import Link from "next/link";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, MapPin } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useCompany } from "@/context/CompanyContext";
import { useT } from "@/context/LanguageContext";
import { Button } from "@/components/ui/Button";

export default function SuccessPage() {
  const { clear } = useCart();
  const { companyDisplay } = useCompany();
  const { t } = useT();

  useEffect(() => {
    clear();
  }, [clear]);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-10 text-center">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 180, damping: 18 }}
        className="relative grid h-28 w-28 place-items-center rounded-full bg-sage-500 shadow-pop"
      >
        <svg viewBox="0 0 64 64" className="h-14 w-14">
          <motion.path
            d="M16 34 L28 46 L48 22"
            fill="none"
            stroke="white"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          />
        </svg>
        <motion.span
          className="absolute inset-0 rounded-full border-4 border-sage-300"
          initial={{ scale: 1, opacity: 0.6 }}
          animate={{ scale: 1.35, opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeOut", repeat: 1, repeatDelay: 0.2 }}
        />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-8 font-display text-5xl tracking-tight text-ink dark:text-cream"
      >
        {t("success.title")}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-3 text-base text-ink-muted dark:text-cream/70"
      >
        {t("success.body")}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-8 grid w-full gap-3 rounded-3xl bg-surface-light p-5 text-left shadow-soft dark:bg-elevated-dark"
      >
        <Detail
          icon={<Clock className="h-4 w-4" />}
          label={t("success.eta")}
          value={t("success.etaTime")}
        />
        <Detail
          icon={<MapPin className="h-4 w-4" />}
          label={t("success.deliverTo")}
          value={companyDisplay ? `${companyDisplay} ${t("success.officeSuffix")}` : t("success.yourWorkplace")}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.75 }}
        className="mt-8 flex w-full flex-col gap-3"
      >
        <Link href="/menu">
          <Button fullWidth size="lg">
            {t("success.orderAnother")}
          </Button>
        </Link>
        <Link href="/">
          <Button fullWidth size="lg" variant="secondary">
            {t("success.backHome")}
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}

function Detail({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-9 w-9 place-items-center rounded-xl bg-sage-100 text-sage-700 dark:bg-sage-500/20 dark:text-sage-200">
        {icon}
      </div>
      <div>
        <p className="text-[11px] uppercase tracking-wider text-ink-muted dark:text-cream/60">
          {label}
        </p>
        <p className="text-sm font-semibold text-ink dark:text-cream">{value}</p>
      </div>
    </div>
  );
}
