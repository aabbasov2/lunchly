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

interface FloaterEvent {
  id: number;
  amount: number;
}

interface LoyaltyContextValue {
  points: number;
  awardPoints: (amount: number) => void;
  floaters: FloaterEvent[];
  dismissFloater: (id: number) => void;
}

const LoyaltyContext = createContext<LoyaltyContextValue | null>(null);

const STORAGE_KEY = "lunchly:loyalty";

export function LoyaltyProvider({ children }: { children: ReactNode }) {
  const [points, setPoints] = useState(340);
  const [floaters, setFloaters] = useState<FloaterEvent[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = Number(raw);
        if (!Number.isNaN(parsed)) setPoints(parsed);
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, String(points));
    } catch {
      /* ignore */
    }
  }, [points, hydrated]);

  const awardPoints = useCallback((amount: number) => {
    setPoints((p) => p + amount);
    setFloaters((f) => [...f, { id: Number(new Date().valueOf()) + Math.floor(Math.random() * 1000), amount }]);
  }, []);

  const dismissFloater = useCallback((id: number) => {
    setFloaters((f) => f.filter((e) => e.id !== id));
  }, []);

  const value = useMemo(
    () => ({ points, awardPoints, floaters, dismissFloater }),
    [points, awardPoints, floaters, dismissFloater],
  );

  return <LoyaltyContext.Provider value={value}>{children}</LoyaltyContext.Provider>;
}

export function useLoyalty() {
  const ctx = useContext(LoyaltyContext);
  if (!ctx) throw new Error("useLoyalty must be used within LoyaltyProvider");
  return ctx;
}
