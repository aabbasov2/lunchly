export interface CutoffInfo {
  closed: boolean;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
  deliveryDate: Date;
  cutoffDate: Date;
}

const CUTOFF_HOUR = 20;

export function getCutoffInfo(now: Date = new Date()): CutoffInfo {
  for (let offset = 1; offset <= 7; offset++) {
    const delivery = new Date(now);
    delivery.setHours(0, 0, 0, 0);
    delivery.setDate(delivery.getDate() + offset);
    const dow = delivery.getDay();
    if (dow === 0 || dow === 6) continue;
    const cutoff = new Date(delivery);
    cutoff.setDate(cutoff.getDate() - 1);
    cutoff.setHours(CUTOFF_HOUR, 0, 0, 0);
    if (cutoff.getTime() > now.getTime()) {
      const diff = cutoff.getTime() - now.getTime();
      const totalSeconds = Math.floor(diff / 1000);
      return {
        closed: false,
        hours: Math.floor(totalSeconds / 3600),
        minutes: Math.floor((totalSeconds % 3600) / 60),
        seconds: totalSeconds % 60,
        totalMs: diff,
        deliveryDate: delivery,
        cutoffDate: cutoff,
      };
    }
  }
  const fallback = new Date(now);
  fallback.setDate(fallback.getDate() + 7);
  return {
    closed: true,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalMs: 0,
    deliveryDate: fallback,
    cutoffDate: fallback,
  };
}

export function intlLocale(locale: string): string {
  return locale === "et" ? "et-EE" : "en-GB";
}

export function isSameCalendarDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isTomorrow(date: Date, now: Date = new Date()): boolean {
  const t = new Date(now);
  t.setDate(t.getDate() + 1);
  return isSameCalendarDay(date, t);
}

export function formatDeliveryDayLong(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(intlLocale(locale), {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
}

export function formatDeliveryDayShort(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(intlLocale(locale), {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(date);
}

export function formatCutoffStamp(date: Date, locale: string): string {
  const day = new Intl.DateTimeFormat(intlLocale(locale), {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(date);
  const time = new Intl.DateTimeFormat(intlLocale(locale), {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
  return `${day} · ${time}`;
}
