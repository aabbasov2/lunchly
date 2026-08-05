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
import { companies } from "@/data/companies";

interface CompanyContextValue {
  companyId: string | null;
  setCompany: (id: string | null) => void;
  companyName: string | null;
}

const CompanyContext = createContext<CompanyContextValue | null>(null);

const STORAGE_KEY = "fizuli:company";

export function CompanyProvider({ children }: { children: ReactNode }) {
  const [companyId, setCompanyId] = useState<string | null>("krulli-y");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw !== null) setCompanyId(raw === "null" ? null : raw);
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, companyId ?? "null");
    } catch {
      /* ignore */
    }
  }, [companyId, hydrated]);

  const setCompany = useCallback((id: string | null) => setCompanyId(id), []);

  const value = useMemo<CompanyContextValue>(() => {
    const companyName = companyId
      ? companies.find((c) => c.id === companyId)?.name ?? null
      : null;
    return { companyId, setCompany, companyName };
  }, [companyId, setCompany]);

  return <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>;
}

export function useCompany() {
  const ctx = useContext(CompanyContext);
  if (!ctx) throw new Error("useCompany must be used within CompanyProvider");
  return ctx;
}
