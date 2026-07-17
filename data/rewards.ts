export interface Reward {
  id: string;
  title: string;
  description: string;
  cost: number;
  icon: "coffee" | "cake" | "percent" | "utensils";
}

export const rewards: Reward[] = [
  {
    id: "free-drink",
    title: "Free Drink",
    description: "Any soft drink or sparkling water on us.",
    cost: 150,
    icon: "coffee",
  },
  {
    id: "dessert",
    title: "Dessert",
    description: "A sweet finish to your lunch.",
    cost: 300,
    icon: "cake",
  },
  {
    id: "discount",
    title: "€5 Discount",
    description: "Take €5 off your next order.",
    cost: 500,
    icon: "percent",
  },
  {
    id: "free-lunch",
    title: "Free Lunch",
    description: "One meal, entirely on the house.",
    cost: 1000,
    icon: "utensils",
  },
];

export interface Badge {
  id: string;
  title: string;
  emoji: string;
  earned: boolean;
}

export const badges: Badge[] = [
  { id: "first-order", title: "First Order", emoji: "🎉", earned: true },
  { id: "streak-5", title: "5-Day Streak", emoji: "🔥", earned: true },
  { id: "veggie", title: "Veggie Explorer", emoji: "🌱", earned: false },
  { id: "early-bird", title: "Early Bird", emoji: "🌅", earned: true },
  { id: "loyal", title: "Loyal Regular", emoji: "🏆", earned: false },
];
