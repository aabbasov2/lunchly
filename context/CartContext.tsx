"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Meal } from "@/data/meals";

export interface CartLine {
  meal: Meal;
  quantity: number;
}

interface CartContextValue {
  lines: CartLine[];
  add: (meal: Meal) => void;
  increment: (mealId: string) => void;
  decrement: (mealId: string) => void;
  remove: (mealId: string) => void;
  clear: () => void;
  itemCount: number;
  subtotal: number;
  total: number;
  deliveryFee: number;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "lunchly:cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* ignore */
    }
  }, [lines, hydrated]);

  const add = useCallback((meal: Meal) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.meal.id === meal.id);
      if (existing) {
        return prev.map((l) =>
          l.meal.id === meal.id ? { ...l, quantity: l.quantity + 1 } : l,
        );
      }
      return [...prev, { meal, quantity: 1 }];
    });
  }, []);

  const increment = useCallback((mealId: string) => {
    setLines((prev) =>
      prev.map((l) => (l.meal.id === mealId ? { ...l, quantity: l.quantity + 1 } : l)),
    );
  }, []);

  const decrement = useCallback((mealId: string) => {
    setLines((prev) =>
      prev
        .map((l) => (l.meal.id === mealId ? { ...l, quantity: l.quantity - 1 } : l))
        .filter((l) => l.quantity > 0),
    );
  }, []);

  const remove = useCallback((mealId: string) => {
    setLines((prev) => prev.filter((l) => l.meal.id !== mealId));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartContextValue>(() => {
    const itemCount = lines.reduce((sum, l) => sum + l.quantity, 0);
    const subtotal = lines.reduce((sum, l) => sum + l.quantity * l.meal.price, 0);
    return {
      lines,
      add,
      increment,
      decrement,
      remove,
      clear,
      itemCount,
      subtotal,
      total: subtotal,
      deliveryFee: 0,
    };
  }, [lines, add, increment, decrement, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
