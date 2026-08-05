export type MealCategory = "Mains" | "Soups";

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
  { id: "boiled-potatoes", name: "Boiled Potatoes", upcharge: 0 },
  { id: "mashed-potatoes", name: "Mashed Potatoes", upcharge: 3 },
];

export const salads: SaladOption[] = [
  { id: "vitamin-salad", name: "Vitamin Salad" },
  { id: "beetroot-salad", name: "Beetroot Salad" },
];

export const DEFAULT_SIDE_ID = "basmati-rice";
export const DEFAULT_SALAD_ID = "vitamin-salad";

export const meals: Meal[] = [
  {
    id: "lula-kebab",
    name: "Lula Kebab",
    description:
      "Char-grilled minced beef skewers with sumac onions and fresh herbs. Served with your choice of side and salad.",
    price: 6,
    category: "Mains",
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=1000&q=80&auto=format&fit=crop",
    requiresSides: true,
    requiresSalad: true,
    tags: ["Grill", "Popular"],
    chefsPick: true,
    featured: true,
  },
  {
    id: "chicken-shashlik",
    name: "Chicken Shashlik",
    description:
      "Tender marinated chicken thigh skewers, flame-kissed and juicy. Comes with a side and a salad.",
    price: 6,
    category: "Mains",
    image:
      "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=1000&q=80&auto=format&fit=crop",
    requiresSides: true,
    requiresSalad: true,
    tags: ["Grill"],
    featured: true,
  },
  {
    id: "meatloaf",
    name: "Meatloaf",
    description:
      "Homestyle meatloaf, slow-baked with sweet onion and herbs. Comforting, wholesome, filling.",
    price: 6,
    category: "Mains",
    image:
      "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=1000&q=80&auto=format&fit=crop",
    requiresSides: true,
    requiresSalad: true,
    tags: ["Comfort"],
  },
  {
    id: "caesar-chicken",
    name: "Caesar with Chicken",
    description:
      "Crisp romaine, grilled chicken, shaved parmesan, croutons and lemony Caesar dressing.",
    price: 8,
    category: "Mains",
    image:
      "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=1000&q=80&auto=format&fit=crop",
    requiresSides: true,
    requiresSalad: true,
    tags: ["Light"],
    featured: true,
  },
  {
    id: "chicken-soup",
    name: "Chicken Soup",
    description:
      "Clear golden broth, hand-pulled chicken, noodles, carrots and dill. The classic pick-me-up.",
    price: 3.5,
    category: "Soups",
    image:
      "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=1000&q=80&auto=format&fit=crop",
    tags: ["Warming"],
  },
  {
    id: "solyanka",
    name: "Solyanka",
    description:
      "Rich, tangy meat soup with pickles, olives, capers and a squeeze of lemon. A Caucasian classic.",
    price: 3.5,
    category: "Soups",
    image:
      "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=1000&q=80&auto=format&fit=crop",
    tags: ["Bold", "Local"],
  },
];

export const categories: Array<"All" | MealCategory> = ["All", "Mains", "Soups"];
