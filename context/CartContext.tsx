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
import { salads, sides } from "@/data/meals";

export interface CartLine {
  id: string;
  meal: Meal;
  quantity: number;
  sideId?: string;
  saladId?: string;
  unitPrice: number;
}

export interface AddOptions {
  sideId?: string;
  saladId?: string;
}

interface CartContextValue {
  lines: CartLine[];
  add: (meal: Meal, options?: AddOptions) => void;
  increment: (lineId: string) => void;
  decrement: (lineId: string) => void;
  remove: (lineId: string) => void;
  clear: () => void;
  itemCount: number;
  subtotal: number;
  total: number;
  deliveryFee: number;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "fizuli:cart";

function lineIdFor(meal: Meal, sideId?: string, saladId?: string) {
  return [meal.id, sideId ?? "-", saladId ?? "-"].join("|");
}

function unitPriceFor(meal: Meal, sideId?: string): number {
  const side = sideId ? sides.find((s) => s.id === sideId) : undefined;
  return meal.price + (side?.upcharge ?? 0);
}

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

  const add = useCallback((meal: Meal, options?: AddOptions) => {
    const sideId = options?.sideId;
    const saladId = options?.saladId;
    const id = lineIdFor(meal, sideId, saladId);
    const unitPrice = unitPriceFor(meal, sideId);
    setLines((prev) => {
      const existing = prev.find((l) => l.id === id);
      if (existing) {
        return prev.map((l) => (l.id === id ? { ...l, quantity: l.quantity + 1 } : l));
      }
      return [...prev, { id, meal, quantity: 1, sideId, saladId, unitPrice }];
    });
  }, []);

  const increment = useCallback((lineId: string) => {
    setLines((prev) =>
      prev.map((l) => (l.id === lineId ? { ...l, quantity: l.quantity + 1 } : l)),
    );
  }, []);

  const decrement = useCallback((lineId: string) => {
    setLines((prev) =>
      prev
        .map((l) => (l.id === lineId ? { ...l, quantity: l.quantity - 1 } : l))
        .filter((l) => l.quantity > 0),
    );
  }, []);

  const remove = useCallback((lineId: string) => {
    setLines((prev) => prev.filter((l) => l.id !== lineId));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartContextValue>(() => {
    const itemCount = lines.reduce((sum, l) => sum + l.quantity, 0);
    const subtotal = lines.reduce((sum, l) => sum + l.quantity * l.unitPrice, 0);
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

export function sideName(sideId?: string): string | undefined {
  if (!sideId) return undefined;
  return sides.find((s) => s.id === sideId)?.name;
}

export function saladName(saladId?: string): string | undefined {
  if (!saladId) return undefined;
  return salads.find((s) => s.id === saladId)?.name;
}
