"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, Clock, Flame, Truck, ExternalLink, Utensils, Phone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useT } from "@/context/LanguageContext";

export default function AboutPage() {
  const { t } = useT();

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-[2rem] bg-surface-light px-6 py-10 shadow-soft sm:px-10 sm:py-14 dark:bg-elevated-dark">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-saffron-100 blur-3xl dark:bg-saffron-500/10" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-sage-100 blur-3xl dark:bg-sage-500/10" />

        <div className="relative grid gap-8 md:grid-cols-[1.1fr_1fr] md:items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Badge tone="saffron" className="mb-4">
                <Flame className="h-3 w-3" />
                {t("about.badge")}
              </Badge>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="font-display text-[2.5rem] leading-[1.05] tracking-tight text-ink sm:text-5xl dark:text-cream"
            >
              {t("about.heroTitleA")}{" "}
              <span className="italic text-saffron-500">{t("about.heroTitleAccent")}</span>{" "}
              {t("about.heroTitleB")}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mt-4 max-w-md text-base text-ink-muted sm:text-lg dark:text-cream/70"
            >
              {t("about.heroBody")}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="mt-6 flex flex-wrap items-center gap-3"
            >
              <Link href="/menu">
                <Button size="lg">{t("about.ctaMenu")}</Button>
              </Link>
              <a
                href="https://www.facebook.com/Fizuli.grill/"
                target="_blank"
                rel="noreferrer noopener"
              >
                <Button size="lg" variant="secondary">
                  {t("about.ctaFacebook")}
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative mx-auto aspect-square w-full max-w-sm"
          >
            <div className="absolute inset-0 rotate-[-3deg] rounded-[2rem] bg-ink dark:bg-black" />
            <div className="absolute inset-0 rotate-[3deg] overflow-hidden rounded-[2rem] bg-ink shadow-pop">
              <div className="grid h-full w-full place-items-center">
                <Image
                  src="/logo.png"
                  alt="Fizuli Grill-Resto"
                  width={240}
                  height={240}
                  className="drop-shadow-2xl"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section>
        <h2 className="mb-6 font-display text-3xl tracking-tight text-ink dark:text-cream">
          {t("about.storyTitle")}
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          <StoryCard
            icon={<Utensils className="h-5 w-5" />}
            title={t("about.story1Title")}
            body={t("about.story1Body")}
          />
          <StoryCard
            icon={<Flame className="h-5 w-5" />}
            title={t("about.story2Title")}
            body={t("about.story2Body")}
          />
          <StoryCard
            icon={<Truck className="h-5 w-5" />}
            title={t("about.story3Title")}
            body={t("about.story3Body")}
          />
        </div>
      </section>

      <section className="grid gap-4 rounded-[2rem] bg-surface-light p-6 shadow-soft sm:p-8 md:grid-cols-2 dark:bg-elevated-dark">
        <div>
          <h2 className="font-display text-3xl tracking-tight text-ink dark:text-cream">
            {t("about.visitTitle")}
          </h2>
          <p className="mt-2 text-sm text-ink-muted dark:text-cream/70">
            {t("about.visitBody")}
          </p>
        </div>
        <div className="grid gap-3">
          <InfoRow
            icon={<MapPin className="h-4 w-4" />}
            label={t("about.locationLabel")}
            value={t("about.locationValue")}
          />
          <InfoRow
            icon={<Phone className="h-4 w-4" />}
            label={t("about.phoneLabel")}
            value={t("about.phoneValue")}
            href={`tel:${t("about.phoneValue").replace(/\s+/g, "")}`}
          />
          <InfoRow
            icon={<Clock className="h-4 w-4" />}
            label={t("about.deliveryLabel")}
            value={t("about.deliveryValue")}
          />
          <InfoRow
            icon={<Utensils className="h-4 w-4" />}
            label={t("about.cuisineLabel")}
            value={t("about.cuisineValue")}
          />
          <a
            href="https://www.facebook.com/Fizuli.grill/"
            target="_blank"
            rel="noreferrer noopener"
            className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-saffron-600 underline-offset-4 hover:underline dark:text-saffron-200"
          >
            {t("about.facebookLine")}
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </section>

      <section className="rounded-[2rem] bg-ink p-8 text-cream shadow-pop sm:p-10 dark:bg-elevated-dark">
        <div className="grid gap-6 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="font-display text-3xl tracking-tight sm:text-4xl">
              {t("about.ctaTitle")}
            </h2>
            <p className="mt-2 text-cream/70">{t("about.ctaBody")}</p>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <Link href="/menu">
              <Button size="lg">{t("about.ctaMenu")}</Button>
            </Link>
            <Link href="/company">
              <Button size="lg" variant="secondary">
                {t("about.ctaBuilding")}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function StoryCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4 }}
      className="rounded-3xl bg-surface-light p-6 shadow-soft dark:bg-elevated-dark"
    >
      <div className="grid h-11 w-11 place-items-center rounded-2xl bg-saffron-500 text-white">
        {icon}
      </div>
      <h3 className="mt-4 text-lg font-semibold text-ink dark:text-cream">{title}</h3>
      <p className="mt-1.5 text-sm text-ink-muted dark:text-cream/70">{body}</p>
    </motion.div>
  );
}

function InfoRow({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const body = (
    <>
      <div className="mt-0.5 grid h-8 w-8 place-items-center rounded-xl bg-ink text-cream dark:bg-cream dark:text-ink">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted dark:text-cream/60">
          {label}
        </p>
        <p className="text-sm font-semibold text-ink dark:text-cream">{value}</p>
      </div>
    </>
  );
  if (href) {
    return (
      <a
        href={href}
        className="flex items-start gap-3 rounded-2xl bg-cream-100 px-4 py-3 transition hover:bg-cream-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.07]"
      >
        {body}
      </a>
    );
  }
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-cream-100 px-4 py-3 dark:bg-white/[0.04]">
      {body}
    </div>
  );
}
