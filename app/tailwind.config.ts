import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Brand colors stay literal — same in both themes.
        brand: {
          DEFAULT: "#075ABD",
          50: "rgb(var(--brand-50) / <alpha-value>)",
          100: "rgb(var(--brand-100) / <alpha-value>)",
          200: "#BAD1ED",
          300: "#8FB5E1",
          400: "#518CD1",
          500: "#075ABD",
          600: "#064CA1",
          700: "#053F84",
          800: "#042F62",
          900: "#021F40",
        },
        deep: {
          DEFAULT: "#054086",
          700: "#042D5E",
          900: "#02162E",
        },
        // Themeable neutrals — bound to CSS vars so they flip with .dark.
        ink: {
          DEFAULT: "rgb(var(--ink) / <alpha-value>)",
          900: "rgb(var(--ink-900) / <alpha-value>)",
          800: "rgb(var(--ink-800) / <alpha-value>)",
          700: "rgb(var(--ink-700) / <alpha-value>)",
          500: "rgb(var(--ink-500) / <alpha-value>)",
          300: "rgb(var(--ink-300) / <alpha-value>)",
          100: "rgb(var(--ink-100) / <alpha-value>)",
        },
        canvas: "rgb(var(--canvas) / <alpha-value>)",
        // Surface used by cards, sheets, top/tab bars (replaces literal white).
        surface: "rgb(var(--surface) / <alpha-value>)",
        emerald: { DEFAULT: "#059669" },
        amber: { DEFAULT: "#D97706" },
        rose: { DEFAULT: "#DC2626" },
        cyan: { DEFAULT: "#22D3EE" },
      },
      fontFamily: {
        display: ["var(--font-sora)", "system-ui", "sans-serif"],
        sans: ["var(--font-hanken)", "system-ui", "sans-serif"],
        mono: ["var(--font-plex-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(2,31,64,.04), 0 8px 30px rgba(2,31,64,.08)",
        lift: "0 30px 80px -20px rgba(5,64,134,.45)",
        btn: "0 6px 18px rgba(7,90,189,.32)",
      },
      backgroundImage: {
        brand: "linear-gradient(120deg, #054086 0%, #075ABD 100%)",
        "brand-deep":
          "linear-gradient(160deg, #02162E 0%, #054086 55%, #075ABD 100%)",
      },
      borderRadius: {
        xl2: "18px",
      },
    },
  },
  plugins: [],
};

export default config;
