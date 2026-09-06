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
  description: string;
  description_et?: string;
  price: number;
  category: MealCategory;
  image: string;
  requiresSides?: boolean;
  requiresSalad?: boolean;
  tags?: string[];
  chefsPick?: boolean;
  featured?: boolean;
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
    description:
      "Marinated chicken thigh skewers, flame-kissed and juicy. Served with your choice of side and salad.",
    description_et:
      "Marineeritud kanakintsu vardad, otse leekidelt ja mahlased. Kaasas kõrvarooga ja salat sinu valikul.",
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
    description:
      "Homestyle beef-and-pork cutlet, pan-seared and juicy. Comforting and filling.",
    description_et:
      "Kodune veise- ja sealiha kotlett, pannil praetud ja mahlane. Lohutav ja täidlane.",
    price: 6.9,
    category: "Mains",
    image: "/meals/kodune-kotlett.png",
    requiresSides: true,
    requiresSalad: true,
    tags: ["Comfort"],
    featured: true,
  },
  {
    id: "vegan-karri",
    name: "Vegan Curry",
    name_et: "Vegan Karri",
    description:
      "Slow-simmered vegan curry with chickpeas, coconut and warm spices.",
    description_et:
      "Aeglaselt haudunud vegan karri kikerherneste, kookose ja soojade vürtsidega.",
    price: 6.9,
    category: "Mains",
    image: "/meals/vegan-karri.png",
    requiresSides: true,
    requiresSalad: true,
    tags: ["Vegan", "Spiced"],
  },
  {
    id: "grill-lohesalat",
    name: "Grilled Salmon Salad",
    name_et: "Grill Lõhesalat",
    description:
      "Warm grilled salmon over fresh greens with a lemon dressing.",
    description_et:
      "Soe grill-lõhe värsketel salatilehtedel, sidruni-kastme kastega.",
    price: 8.9,
    category: "Mains",
    image: "/meals/grill-lohesalat.png",
    tags: ["Light", "Grill"],
    featured: true,
  },
  {
    id: "grill-kanafilee-salat",
    name: "Grilled Chicken Salad",
    name_et: "Grill Kanafilee Salat",
    description:
      "Grilled chicken fillet over crisp romaine, tomato and cucumber.",
    description_et:
      "Grillitud kanafilee krõbedal salatil, tomati ja kurgiga.",
    price: 6.9,
    category: "Mains",
    image: "/meals/grill-kanafilee-salat.png",
    tags: ["Light", "Grill"],
  },
];

export const categories: Array<"All" | MealCategory> = ["All", "Mains"];

export function mealName(meal: Meal, locale: Locale): string {
  return locale === "et" && meal.name_et ? meal.name_et : meal.name;
}

export function mealDescription(meal: Meal, locale: Locale): string {
  return locale === "et" && meal.description_et ? meal.description_et : meal.description;
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
