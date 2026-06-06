/** Brand tokens — kept identical to the live app's tailwind.config.ts. */
export const BRAND = {
  blue: "#075ABD",
  blue50: "#F0F5FB",
  blue100: "#DCE8F6",
  blue200: "#BAD1ED",
  blue300: "#8FB5E1",
  blue400: "#518CD1",
  blue600: "#064CA1",
  blue700: "#053F84",
  blue800: "#042F62",
  blue900: "#021F40",
  deep: "#054086",
  deep700: "#042D5E",
  deep900: "#02162E",
  ink: "#0B1220",
  ink800: "#1E293B",
  ink700: "#334155",
  ink500: "#64748B",
  ink300: "#CBD5E1",
  ink100: "#F1F5F9",
  canvas: "#F8FAFC",
  white: "#FFFFFF",
  emerald: "#059669",
  amber: "#D97706",
  rose: "#DC2626",
  cyan: "#22D3EE",
  // Outside-of-phone dark backdrop
  stageBg:
    "radial-gradient(900px 600px at 80% 0%, rgba(34,211,238,0.07), transparent 60%), radial-gradient(1200px 700px at 0% 100%, rgba(7,90,189,0.14), transparent 60%), #0B1220",
  brandGradient:
    "linear-gradient(120deg, #054086 0%, #075ABD 100%)",
  brandDeepGradient:
    "linear-gradient(160deg, #02162E 0%, #054086 55%, #075ABD 100%)",
} as const;
