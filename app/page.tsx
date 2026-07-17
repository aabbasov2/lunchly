"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Truck, UtensilsCrossed, Building2, Clock, Sparkles } from "lucide-react";
import { CountdownBanner } from "@/components/CountdownBanner";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { meals } from "@/data/meals";

const features = [
  {
    icon: UtensilsCrossed,
    title: "Fresh meals daily",
    body: "Prepared each morning by our chefs using seasonal, local ingredients.",
  },
  {
    icon: Truck,
    title: "Free delivery",
    body: "Every order, every day. Delivered straight to your workplace.",
  },
  {
    icon: Building2,
    title: "Partner companies",
    body: "Delivered to select offices in Tallinn — with more joining every week.",
  },
];

export default function Home() {
  const featured = meals.filter((m) => m.featured).slice(0, 3);

  return (
    <div className="space-y-14">
      <CountdownBanner />

      <section className="relative overflow-hidden rounded-[2rem] bg-surface-light px-6 py-10 shadow-soft sm:px-10 sm:py-14 dark:bg-elevated-dark">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-sage-100 blur-3xl dark:bg-sage-500/10" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-saffron-100 blur-3xl dark:bg-saffron-500/10" />

        <div className="relative grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Badge tone="sage" className="mb-4">
                <Sparkles className="h-3 w-3" />
                Meals from €6
              </Badge>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="font-display text-[2.5rem] leading-[1.05] tracking-tight text-ink sm:text-6xl dark:text-cream"
            >
              Fresh lunch,
              <br />
              <span className="italic text-sage-500">delivered</span> to your workplace.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mt-4 max-w-md text-base text-ink-muted sm:text-lg dark:text-cream/70"
            >
              Order today. Enjoy tomorrow. A calmer lunch break, straight to your desk.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="mt-6 flex flex-wrap items-center gap-3"
            >
              <Link href="/menu">
                <Button size="lg">
                  Order Lunch
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/company">
                <Button size="lg" variant="secondary">
                  Check your workplace
                </Button>
              </Link>
            </motion.div>
            <p className="mt-6 inline-flex items-center gap-2 text-xs text-ink-muted dark:text-cream/60">
              <Clock className="h-3.5 w-3.5" />
              Orders close every day at 18:00 for next-day delivery
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative mx-auto aspect-square w-full max-w-md"
          >
            <div className="absolute inset-0 rotate-[-4deg] rounded-[2rem] bg-sage-100 dark:bg-sage-500/10" />
            <div className="absolute inset-0 rotate-[3deg] overflow-hidden rounded-[2rem] shadow-pop">
              <Image
                src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&q=80&auto=format&fit=crop"
                alt="A colorful lunch bowl"
                fill
                priority
                sizes="(min-width: 768px) 40vw, 90vw"
                className="object-cover"
              />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="absolute -bottom-4 left-4 flex items-center gap-3 rounded-2xl bg-surface-light px-4 py-3 shadow-pop dark:bg-elevated-dark"
            >
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-sage-500 text-white">
                <Truck className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-medium text-ink-muted dark:text-cream/60">
                  Tomorrow &middot; 11:30–13:00
                </p>
                <p className="text-sm font-semibold text-ink dark:text-cream">Free delivery</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section>
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl tracking-tight text-ink dark:text-cream">
              Why teams love Lunchly
            </h2>
            <p className="mt-1 text-sm text-ink-muted dark:text-cream/60">
              Thoughtful details from kitchen to desk.
            </p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="rounded-3xl bg-surface-light p-6 shadow-soft dark:bg-elevated-dark"
              >
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-sage-500 text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-ink dark:text-cream">
                  {f.title}
                </h3>
                <p className="mt-1.5 text-sm text-ink-muted dark:text-cream/60">{f.body}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section>
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl tracking-tight text-ink dark:text-cream">
              Tomorrow&rsquo;s menu, a preview
            </h2>
            <p className="mt-1 text-sm text-ink-muted dark:text-cream/60">
              A taste of what&rsquo;s cooking.
            </p>
          </div>
          <Link
            href="/menu"
            className="hidden text-sm font-semibold text-ink underline-offset-4 hover:underline sm:inline dark:text-cream"
          >
            See full menu →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {featured.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="group overflow-hidden rounded-3xl bg-surface-light shadow-soft dark:bg-elevated-dark"
            >
              <div className="relative aspect-[5/4] overflow-hidden bg-cream-100">
                <Image
                  src={m.image}
                  alt={m.name}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                />
              </div>
              <div className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-semibold text-ink dark:text-cream">{m.name}</p>
                  <p className="text-xs text-ink-muted dark:text-cream/60">
                    From €{m.price.toFixed(2)}
                  </p>
                </div>
                <Badge tone="sage">Fresh</Badge>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="rounded-[2rem] bg-ink p-8 text-cream shadow-pop dark:bg-elevated-dark sm:p-12">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="font-display text-4xl tracking-tight sm:text-5xl">
              Lunch, on a schedule that <span className="italic text-sage-300">works</span>.
            </h2>
            <p className="mt-3 text-cream/70">
              Order the day before, delivered the next day between 11:30 and 13:00. No queues,
              no decisions at 12:15, no cold sandwiches.
            </p>
          </div>
          <div className="grid gap-3 rounded-3xl bg-white/[0.05] p-6 backdrop-blur">
            {[
              "Free delivery on every order",
              "Meals from €6",
              "Orders close daily at 18:00",
              "Delivered to your workplace",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-sage-500 text-[10px] font-bold">
                  ✓
                </span>
                <span className="font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
