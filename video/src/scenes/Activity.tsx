import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Stage } from "../ui/Stage";
import { Screen, ScreenTopBar, Card } from "../ui/Screen";
import { BRAND } from "../theme";
import { sora, plexMono, hanken } from "../fonts";
import { KARIM } from "../data";
import { fmtUSD } from "../format";

const ICON_BG: Record<string, string> = {
  load: BRAND.blue,
  spend: BRAND.ink800,
  invest: BRAND.deep,
  earn: BRAND.emerald,
  convert: BRAND.blue600,
  futures: BRAND.rose,
};
const ICON_CHAR: Record<string, string> = {
  load: "L",
  spend: "S",
  invest: "I",
  earn: "E",
  convert: "C",
  futures: "F",
};

const CATEGORIES = ["All", "Load", "Spend", "Convert", "Invest", "Earn", "Futures"];

export const Activity: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const filtersIn = spring({
    frame: frame - 2,
    fps,
    config: { damping: 22, stiffness: 180 },
  });

  return (
    <Stage
      index={13}
      count={14}
      eyebrow="Activity"
      title="Every move, traceable."
      description="One feed across both rails. Tap any transaction to see the on-chain hash or bank reference behind it."
    >
      <Screen topInset={0}>
        <ScreenTopBar title="Activity" />
        <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Search */}
          <div
            style={{
              position: "relative",
              height: 44,
              borderRadius: 18,
              border: `1px solid ${BRAND.ink100}`,
              background: "#fff",
              display: "flex",
              alignItems: "center",
              padding: "0 12px 0 36px",
              fontFamily: hanken,
              fontSize: 14,
              color: BRAND.ink500,
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              style={{ position: "absolute", left: 12 }}
            >
              <circle cx="11" cy="11" r="7" stroke={BRAND.ink500} strokeWidth="2" />
              <path d="M20 20l-3-3" stroke={BRAND.ink500} strokeWidth="2" strokeLinecap="round" />
            </svg>
            Search merchant, reference, amount
          </div>

          {/* Filter chips */}
          <div
            style={{
              display: "flex",
              gap: 6,
              overflow: "hidden",
              opacity: filtersIn,
              transform: `translateX(${interpolate(filtersIn, [0, 1], [12, 0])}px)`,
            }}
          >
            {CATEGORIES.map((c, i) => (
              <div
                key={c}
                style={{
                  padding: "5px 12px",
                  borderRadius: 999,
                  fontFamily: sora,
                  fontWeight: 600,
                  fontSize: 12,
                  background: i === 0 ? BRAND.ink : "#fff",
                  color: i === 0 ? "#fff" : BRAND.ink700,
                  border: i === 0 ? "none" : `1px solid ${BRAND.ink100}`,
                  whiteSpace: "nowrap",
                }}
              >
                {c}
              </div>
            ))}
          </div>

          <div
            style={{
              fontFamily: plexMono,
              fontSize: 11,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: BRAND.ink500,
              padding: "4px 4px 0",
            }}
          >
            Today
          </div>

          {/* Tx list */}
          <Card style={{ padding: 8 }}>
            {KARIM.activity.map((tx, i) => {
              const rowIn = spring({
                frame: frame - 16 - i * 5,
                fps,
                config: { damping: 22, stiffness: 180 },
              });
              return (
                <div
                  key={tx.title}
                  style={{
                    padding: "12px 8px",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    borderBottom:
                      i === KARIM.activity.length - 1 ? "none" : `1px solid ${BRAND.ink100}`,
                    opacity: rowIn,
                    transform: `translateY(${interpolate(rowIn, [0, 1], [8, 0])}px)`,
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      background: ICON_BG[tx.category],
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: sora,
                      fontWeight: 700,
                      fontSize: 14,
                    }}
                  >
                    {ICON_CHAR[tx.category]}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontFamily: hanken,
                        fontWeight: 600,
                        fontSize: 14.5,
                        color: BRAND.ink,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {tx.title}
                    </div>
                    <div
                      style={{
                        fontFamily: hanken,
                        fontSize: 12,
                        color: BRAND.ink500,
                        marginTop: 2,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {tx.subtitle}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        fontFamily: plexMono,
                        fontWeight: 600,
                        fontSize: 14.5,
                        color: tx.amount > 0 ? BRAND.emerald : BRAND.ink,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {tx.amount >= 0 ? "+" : "−"}
                      {fmtUSD(Math.abs(tx.amount))}
                    </div>
                    <div style={{ fontFamily: plexMono, fontSize: 11, color: BRAND.ink500, marginTop: 2 }}>
                      {tx.time}
                    </div>
                  </div>
                </div>
              );
            })}
          </Card>
        </div>
      </Screen>
    </Stage>
  );
};
