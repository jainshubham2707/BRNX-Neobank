import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#075ABD",
          50: "#F0F5FB",
          100: "#DCE8F6",
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
        ink: {
          DEFAULT: "#0B1220",
          900: "#0B1220",
          800: "#1E293B",
          700: "#334155",
          500: "#64748B",
          300: "#CBD5E1",
          100: "#F1F5F9",
        },
        canvas: "#F8FAFC",
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
