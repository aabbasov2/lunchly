import type { Locale } from "@/lib/i18n";

export type MealCategory = "Mains";

export interface SideOption {
  id: string;
  name: string;
  name_et?: string;
  upcharge: number;
}

export interface SaladOption {
  id: string;
  name: string;
  name_et?: string;
}

export interface Meal {
  id: string;
  name: string;
  name_et?: string;
  subtitle?: string;
  subtitle_et?: string;
  price: number;
  category: MealCategory;
  image: string;
  requiresSides?: boolean;
  requiresSalad?: boolean;
  tags?: string[];
  chefsPick?: boolean;
  featured?: boolean;
  dailyLimit?: number;
}

export const sides: SideOption[] = [
  { id: "basmati-rice", name: "Basmati Rice", name_et: "Basmati riis", upcharge: 0 },
  { id: "potato-wedges", name: "Potato Wedges", name_et: "Kartuli viilud", upcharge: 0 },
];

export const salads: SaladOption[] = [
  { id: "vitamin-salad", name: "Vitamin Salad", name_et: "Vitamiinisalat" },
  { id: "beetroot-salad", name: "Beetroot Salad", name_et: "Peedisalat" },
];

export const DEFAULT_SIDE_ID = "basmati-rice";
export const DEFAULT_SALAD_ID = "vitamin-salad";

export const meals: Meal[] = [
  {
    id: "kana-shashlyk",
    name: "Chicken Shashlik",
    name_et: "Kana Šašlõkk",
    price: 6.9,
    category: "Mains",
    image: "/meals/kana-shashlyk.png",
    requiresSides: true,
    requiresSalad: true,
    tags: ["Grill", "Popular"],
    chefsPick: true,
    featured: true,
  },
  {
    id: "kodune-kotlett",
    name: "Homestyle Cutlet",
    name_et: "Kodune Kotlett",
    subtitle: "Chicken & pork",
    subtitle_et: "Kana ja sealiha",
    price: 6.9,
    category: "Mains",
    image: "/meals/kodune-kotlett.png",
    requiresSides: true,
    requiresSalad: true,
    tags: ["Comfort"],
    featured: true,
    dailyLimit: 25,
  },
  {
    id: "vegan-karri",
    name: "Vegan Curry",
    name_et: "Vegan Karri",
    price: 6.9,
    category: "Mains",
    image: "/meals/vegan-karri.png",
    tags: ["Vegan", "Spiced"],
    dailyLimit: 25,
  },
  {
    id: "grill-lohesalat",
    name: "Grilled Salmon Salad",
    name_et: "Grill Lõhesalat",
    price: 8.9,
    category: "Mains",
    image: "/meals/grill-lohesalat.png",
    tags: ["Light", "Grill"],
    featured: true,
    dailyLimit: 10,
  },
  {
    id: "grill-kanafilee-salat",
    name: "Grilled Chicken Salad",
    name_et: "Grill Kanafilee Salat",
    price: 6.9,
    category: "Mains",
    image: "/meals/grill-kanafilee-salat.png",
    tags: ["Light", "Grill"],
    dailyLimit: 25,
  },
];

export const categories: Array<"All" | MealCategory> = ["All", "Mains"];

export function mealName(meal: Meal, locale: Locale): string {
  return locale === "et" && meal.name_et ? meal.name_et : meal.name;
}

export function mealSubtitle(meal: Meal, locale: Locale): string | undefined {
  if (locale === "et" && meal.subtitle_et) return meal.subtitle_et;
  return meal.subtitle;
}

export function sideLabel(side: SideOption, locale: Locale): string {
  return locale === "et" && side.name_et ? side.name_et : side.name;
}

export function saladLabel(salad: SaladOption, locale: Locale): string {
  return locale === "et" && salad.name_et ? salad.name_et : salad.name;
}

export function sideNameFor(sideId: string | undefined, locale: Locale): string | undefined {
  if (!sideId) return undefined;
  const s = sides.find((x) => x.id === sideId);
  return s ? sideLabel(s, locale) : undefined;
}

export function saladNameFor(saladId: string | undefined, locale: Locale): string | undefined {
  if (!saladId) return undefined;
  const s = salads.find((x) => x.id === saladId);
  return s ? saladLabel(s, locale) : undefined;
}

export function mealCategoryLabel(cat: "All" | MealCategory, locale: Locale): string {
  if (cat === "All") return locale === "et" ? "Kõik" : "All";
  return locale === "et" ? "Põhiroad" : "Mains";
}
