import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: "#FAF7F2",
          50: "#FDFBF7",
          100: "#F7F2EA",
        },
        ink: {
          DEFAULT: "#111111",
          soft: "#2A2A2A",
          muted: "#6B6B6B",
          faint: "#A3A3A3",
        },
        sage: {
          50: "#F1F4EB",
          100: "#E1E9CE",
          200: "#C7D4A6",
          300: "#ABBD7F",
          400: "#8FA96A",
          500: "#6E8A4E",
          600: "#556B3C",
          700: "#40522D",
        },
        saffron: {
          50: "#FBEDE9",
          100: "#F6D3CB",
          200: "#EDA69A",
          300: "#E17D6D",
          400: "#CE5A47",
          500: "#B23A2E",
          600: "#8E2B1E",
        },
        surface: {
          light: "#FFFFFF",
          dark: "#0E0E10",
        },
        elevated: {
          light: "#FFFFFF",
          dark: "#17171B",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      boxShadow: {
        soft: "0 12px 40px -12px rgba(17, 17, 17, 0.10), 0 2px 6px -2px rgba(17, 17, 17, 0.05)",
        pop: "0 20px 60px -20px rgba(17, 17, 17, 0.25)",
        ring: "0 0 0 4px rgba(178, 58, 46, 0.15)",
      },
      borderRadius: {
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
        floatUp: {
          "0%": { opacity: "0", transform: "translateY(20px) scale(0.95)" },
          "20%": { opacity: "1", transform: "translateY(-6px) scale(1)" },
          "80%": { opacity: "1", transform: "translateY(-40px) scale(1)" },
          "100%": { opacity: "0", transform: "translateY(-64px) scale(0.95)" },
        },
      },
      animation: {
        shimmer: "shimmer 1.4s linear infinite",
        floatUp: "floatUp 2.2s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
