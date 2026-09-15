"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { getCutoffInfo } from "@/lib/cutoff";

interface InventoryState {
  sold: Record<string, number>;
  remaining: Record<string, number | null>;
  loaded: boolean;
  error: string | null;
  date: string | null;
}

interface InventoryContextValue extends InventoryState {
  remainingFor: (mealId: string) => number | null;
  isSoldOut: (mealId: string) => boolean;
  isLowStock: (mealId: string) => boolean;
  refresh: () => void;
}

const InventoryContext = createContext<InventoryContextValue | null>(null);

const POLL_MS = 60_000;
const LOW_STOCK_THRESHOLD = 10;

function ymd(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<InventoryState>({
    sold: {},
    remaining: {},
    loaded: false,
    error: null,
    date: null,
  });
  const dateRef = useRef<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const load = useCallback(async () => {
    const date = ymd(getCutoffInfo().deliveryDate);
    dateRef.current = date;
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    try {
      const res = await fetch(`/api/inventory?date=${date}`, {
        cache: "no-store",
        signal: ac.signal,
      });
      if (!res.ok) throw new Error(`inventory ${res.status}`);
      const data = (await res.json()) as {
        sold?: Record<string, number>;
        remaining?: Record<string, number | null>;
      };
      if (ac.signal.aborted) return;
      setState({
        sold: data.sold ?? {},
        remaining: data.remaining ?? {},
        loaded: true,
        error: null,
        date,
      });
    } catch (err) {
      if ((err as { name?: string })?.name === "AbortError") return;
      const message = err instanceof Error ? err.message : "unknown";
      setState((prev) => ({ ...prev, loaded: true, error: message, date }));
    }
  }, []);

  useEffect(() => {
    load();
    const poll = setInterval(() => {
      const nextDate = ymd(getCutoffInfo().deliveryDate);
      if (nextDate !== dateRef.current) {
        // Delivery date rolled over — reload immediately.
        load();
      } else {
        load();
      }
    }, POLL_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible") load();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(poll);
      document.removeEventListener("visibilitychange", onVisible);
      abortRef.current?.abort();
    };
  }, [load]);

  const value = useMemo<InventoryContextValue>(() => {
    const remainingFor = (mealId: string): number | null => {
      const v = state.remaining[mealId];
      return v === undefined ? null : v;
    };
    const isSoldOut = (mealId: string): boolean => {
      const v = state.remaining[mealId];
      return typeof v === "number" && v <= 0;
    };
    const isLowStock = (mealId: string): boolean => {
      const v = state.remaining[mealId];
      return typeof v === "number" && v > 0 && v < LOW_STOCK_THRESHOLD;
    };
    return {
      ...state,
      remainingFor,
      isSoldOut,
      isLowStock,
      refresh: load,
    };
  }, [state, load]);

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>;
}

export function useInventory(): InventoryContextValue {
  const ctx = useContext(InventoryContext);
  if (!ctx) throw new Error("useInventory must be used within InventoryProvider");
  return ctx;
}
