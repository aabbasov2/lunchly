"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "./ThemeContext";
import { ToastProvider } from "./ToastContext";
import { CartProvider } from "./CartContext";
import { CompanyProvider } from "./CompanyContext";
import { LanguageProvider } from "./LanguageContext";
import { InventoryProvider } from "./InventoryContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <ToastProvider>
          <CompanyProvider>
            <CartProvider>
              <InventoryProvider>{children}</InventoryProvider>
            </CartProvider>
          </CompanyProvider>
        </ToastProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
