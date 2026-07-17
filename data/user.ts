export interface OrderHistoryItem {
  id: string;
  date: string;
  items: string[];
  total: number;
}

export interface UserProfile {
  name: string;
  email: string;
  companyId: string;
  paymentLast4: string;
  paymentBrand: string;
  history: OrderHistoryItem[];
}

export const user: UserProfile = {
  name: "Alex Novak",
  email: "alex@bolt.eu",
  companyId: "bolt",
  paymentBrand: "Visa",
  paymentLast4: "4242",
  history: [
    {
      id: "ord-1042",
      date: "2026-07-15",
      items: ["Lula Kebab", "Sparkling Water"],
      total: 10.5,
    },
    {
      id: "ord-1031",
      date: "2026-07-14",
      items: ["Caesar with Chicken"],
      total: 8.5,
    },
    {
      id: "ord-1020",
      date: "2026-07-11",
      items: ["Chicken Schnitzel", "Kodused Kotletid"],
      total: 16.8,
    },
  ],
};
