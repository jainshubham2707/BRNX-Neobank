import React from "react";
import { BRAND } from "../theme";
import { sora, hanken, plexMono } from "../fonts";

/** Phone-screen container that respects the notch zone. */
export const Screen: React.FC<{
  children: React.ReactNode;
  background?: string;
  topInset?: number;
}> = ({ children, background = BRAND.canvas, topInset = 44 }) => {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background,
        paddingTop: topInset,
        fontFamily: hanken,
        color: BRAND.ink,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {children}
    </div>
  );
};

export const ScreenTopBar: React.FC<{
  title: string;
  back?: boolean;
}> = ({ title, back = true }) => {
  return (
    <header
      style={{
        height: 56,
        padding: "0 16px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        borderBottom: `1px solid ${BRAND.ink100}`,
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(8px)",
      }}
    >
      {back && (
        <div
          style={{
            width: 36,
            height: 36,
            marginLeft: -8,
            borderRadius: 999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: BRAND.ink700,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 6l-6 6 6 6"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
      <div
        style={{
          fontFamily: sora,
          fontWeight: 600,
          fontSize: 17,
          letterSpacing: "-0.02em",
          flex: 1,
          color: BRAND.ink,
        }}
      >
        {title}
      </div>
    </header>
  );
};

export const Card: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => (
  <div
    style={{
      background: "#FFFFFF",
      border: `1px solid ${BRAND.ink100}`,
      borderRadius: 18,
      padding: 16,
      boxShadow: "0 1px 2px rgba(2,31,64,.04), 0 8px 30px rgba(2,31,64,.04)",
      ...style,
    }}
  >
    {children}
  </div>
);

export const Eyebrow: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div
    style={{
      fontFamily: plexMono,
      fontSize: 11,
      letterSpacing: "0.18em",
      textTransform: "uppercase",
      color: BRAND.ink500,
    }}
  >
    {children}
  </div>
);

export const Mono: React.FC<{
  children: React.ReactNode;
  size?: number;
  color?: string;
  bold?: boolean;
}> = ({ children, size = 14, color = BRAND.ink, bold = true }) => (
  <span
    style={{
      fontFamily: plexMono,
      fontVariantNumeric: "tabular-nums",
      fontSize: size,
      fontWeight: bold ? 600 : 400,
      color,
    }}
  >
    {children}
  </span>
);

export const Display: React.FC<{
  children: React.ReactNode;
  size?: number;
  color?: string;
}> = ({ children, size = 36, color = BRAND.ink }) => (
  <span
    style={{
      fontFamily: sora,
      fontWeight: 800,
      fontSize: size,
      letterSpacing: "-0.02em",
      color,
      lineHeight: 1.05,
      fontVariantNumeric: "tabular-nums",
    }}
  >
    {children}
  </span>
);

export const RailBadge: React.FC<{ rail: "USD" | "USDC" }> = ({ rail }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      padding: "4px 10px",
      borderRadius: 999,
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      background: rail === "USD" ? BRAND.blue50 : "rgba(5,64,134,0.10)",
      color: rail === "USD" ? BRAND.blue700 : BRAND.deep,
    }}
  >
    {rail}
  </span>
);

export const Chip: React.FC<{
  children: React.ReactNode;
  variant?: "brand" | "earn" | "warn" | "fail" | "default";
}> = ({ children, variant = "default" }) => {
  const styles = {
    brand: { bg: BRAND.blue50, fg: BRAND.blue700 },
    earn: { bg: "rgba(5,150,105,0.10)", fg: BRAND.emerald },
    warn: { bg: "rgba(217,119,6,0.10)", fg: BRAND.amber },
    fail: { bg: "rgba(220,38,38,0.10)", fg: BRAND.rose },
    default: { bg: BRAND.ink100, fg: BRAND.ink700 },
  }[variant];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "4px 10px",
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 700,
        background: styles.bg,
        color: styles.fg,
      }}
    >
      {children}
    </span>
  );
};

export const SectionLabel: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div
    style={{
      fontFamily: sora,
      fontWeight: 600,
      fontSize: 15,
      letterSpacing: "-0.01em",
      color: BRAND.ink,
      padding: "4px 16px 8px",
    }}
  >
    {children}
  </div>
);
