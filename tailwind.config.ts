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
          50: "#EEF6EE",
          100: "#D8ECD8",
          200: "#B4D9B4",
          300: "#8AC28A",
          400: "#5FA85F",
          500: "#3D8B49",
          600: "#2F6E38",
          700: "#265A2D",
        },
        saffron: {
          50: "#FFF6EC",
          100: "#FFE6C7",
          200: "#FFCC8A",
          300: "#FFB25C",
          400: "#F79445",
          500: "#E87A2C",
          600: "#C25E1F",
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
        ring: "0 0 0 4px rgba(61, 139, 73, 0.15)",
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
