"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "./ThemeContext";
import { ToastProvider } from "./ToastContext";
import { CartProvider } from "./CartContext";
import { CompanyProvider } from "./CompanyContext";
import { LoyaltyProvider } from "./LoyaltyContext";
import { PointsFloaterHost } from "@/components/PointsFloater";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <CompanyProvider>
          <LoyaltyProvider>
            <CartProvider>
              {children}
              <PointsFloaterHost />
            </CartProvider>
          </LoyaltyProvider>
        </CompanyProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
