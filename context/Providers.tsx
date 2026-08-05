"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "./ThemeContext";
import { ToastProvider } from "./ToastContext";
import { CartProvider } from "./CartContext";
import { CompanyProvider } from "./CompanyContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <CompanyProvider>
          <CartProvider>{children}</CartProvider>
        </CompanyProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
