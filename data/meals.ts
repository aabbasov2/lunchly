export type MealCategory = "Chicken" | "Beef" | "Pork" | "Vegetarian" | "Fish";

export interface Meal {
  id: string;
  name: string;
  description: string;
  price: number;
  calories: number;
  category: MealCategory;
  image: string;
  tags?: string[];
  chefsPick?: boolean;
  featured?: boolean;
}

export const meals: Meal[] = [
  {
    id: "lula-kebab",
    name: "Lula Kebab",
    description: "Char-grilled minced beef skewers with herbs, sumac onions and warm flatbread.",
    price: 9.5,
    calories: 640,
    category: "Beef",
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=1000&q=80&auto=format&fit=crop",
    tags: ["Grill", "Popular"],
    chefsPick: true,
    featured: true,
  },
  {
    id: "chicken-schnitzel",
    name: "Chicken Schnitzel",
    description: "Golden panko-crusted chicken breast with lemon and rocket salad.",
    price: 8.9,
    calories: 720,
    category: "Chicken",
    image:
      "https://images.unsplash.com/photo-1562967914-608f82629710?w=1000&q=80&auto=format&fit=crop",
    tags: ["Comfort"],
    featured: true,
  },
  {
    id: "chicken-shashlik",
    name: "Chicken Shashlik",
    description: "Marinated chicken thigh skewers, roasted peppers and garlic yogurt.",
    price: 9.2,
    calories: 580,
    category: "Chicken",
    image:
      "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=1000&q=80&auto=format&fit=crop",
    tags: ["Grill"],
  },
  {
    id: "pork-shashlik",
    name: "Pork Shashlik",
    description: "Tender pork neck skewers with roasted potatoes and pickled onions.",
    price: 9.4,
    calories: 690,
    category: "Pork",
    image:
      "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=1000&q=80&auto=format&fit=crop",
    tags: ["Grill"],
  },
  {
    id: "caesar-chicken",
    name: "Caesar with Chicken",
    description: "Crisp romaine, grilled chicken, shaved parmesan and sourdough croutons.",
    price: 8.5,
    calories: 480,
    category: "Chicken",
    image:
      "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=1000&q=80&auto=format&fit=crop",
    tags: ["Light"],
  },
  {
    id: "kodused-kotletid",
    name: "Kodused Kotletid",
    description: "Estonian home-style meatballs with mashed potato and dill gravy.",
    price: 7.9,
    calories: 610,
    category: "Beef",
    image:
      "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=1000&q=80&auto=format&fit=crop",
    tags: ["Comfort", "Local"],
    featured: true,
  },
  {
    id: "roasted-veg-bowl",
    name: "Roasted Veg Bowl",
    description: "Miso-glazed pumpkin, quinoa, chickpeas, tahini and pomegranate.",
    price: 6.0,
    calories: 520,
    category: "Vegetarian",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1000&q=80&auto=format&fit=crop",
    tags: ["Plant-based"],
  },
  {
    id: "baked-salmon",
    name: "Baked Salmon",
    description: "Herb-crusted salmon fillet with lemon butter and green beans.",
    price: 10.9,
    calories: 560,
    category: "Fish",
    image:
      "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=1000&q=80&auto=format&fit=crop",
    tags: ["Omega-3"],
  },
  {
    id: "mushroom-risotto",
    name: "Mushroom Risotto",
    description: "Slow-cooked arborio rice with wild mushrooms, thyme and parmesan.",
    price: 7.5,
    calories: 610,
    category: "Vegetarian",
    image:
      "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=1000&q=80&auto=format&fit=crop",
    tags: ["Comfort"],
  },
];

export const categories: Array<"All" | MealCategory> = [
  "All",
  "Chicken",
  "Beef",
  "Vegetarian",
  "Fish",
];
