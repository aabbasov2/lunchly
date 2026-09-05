export type MealCategory = "Mains";

export interface SideOption {
  id: string;
  name: string;
  upcharge: number;
}

export interface SaladOption {
  id: string;
  name: string;
}

export interface Meal {
  id: string;
  name: string;
  description: string;
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
  { id: "basmati-rice", name: "Basmati Rice", upcharge: 0 },
  { id: "potato-wedges", name: "Potato Wedges", upcharge: 0 },
];

export const salads: SaladOption[] = [
  { id: "vitamin-salad", name: "Vitamin Salad" },
  { id: "beetroot-salad", name: "Beetroot Salad" },
];

export const DEFAULT_SIDE_ID = "basmati-rice";
export const DEFAULT_SALAD_ID = "vitamin-salad";

export const meals: Meal[] = [
  {
    id: "kana-shashlyk",
    name: "Kana Šašlõkk",
    description:
      "Marinated chicken thigh skewers, flame-kissed and juicy. Served with your choice of side and salad.",
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
    name: "Kodune Kotlett",
    description:
      "Homestyle beef-and-pork cutlet, pan-seared and juicy. Comforting and filling.",
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
    name: "Vegan Karri",
    description:
      "Slow-simmered vegan curry with chickpeas, coconut and warm spices.",
    price: 6.9,
    category: "Mains",
    image: "/meals/vegan-karri.png",
    requiresSides: true,
    requiresSalad: true,
    tags: ["Vegan", "Spiced"],
  },
  {
    id: "grill-lohesalat",
    name: "Grill Lõhesalat",
    description:
      "Warm grilled salmon over fresh greens with lemon dressing.",
    price: 8.9,
    category: "Mains",
    image: "/meals/grill-lohesalat.png",
    tags: ["Light", "Grill"],
    featured: true,
  },
  {
    id: "grill-kanafilee-salat",
    name: "Grill Kanafilee Salat",
    description:
      "Grilled chicken fillet over crisp romaine, tomato and cucumber.",
    price: 6.9,
    category: "Mains",
    image: "/meals/grill-kanafilee-salat.png",
    tags: ["Light", "Grill"],
  },
];

export const categories: Array<"All" | MealCategory> = ["All", "Mains"];
