import en from "./en.json";
import et from "./et.json";

export type Locale = "en" | "et";
export const LOCALES: Locale[] = ["en", "et"];
export const DEFAULT_LOCALE: Locale = "en";

const dicts: Record<Locale, unknown> = { en, et };

function walk(obj: unknown, path: string[]): unknown {
  return path.reduce<unknown>(
    (acc, k) => (acc && typeof acc === "object" ? (acc as Record<string, unknown>)[k] : undefined),
    obj,
  );
}

export function translate(
  locale: Locale,
  key: string,
  vars?: Record<string, string | number>,
): string {
  const path = key.split(".");
  const primary = walk(dicts[locale], path);
  const fallback = walk(dicts[DEFAULT_LOCALE], path);
  let out: string;
  if (typeof primary === "string") out = primary;
  else if (typeof fallback === "string") out = fallback;
  else out = key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      out = out.replaceAll(`{${k}}`, String(v));
    }
  }
  return out;
}
