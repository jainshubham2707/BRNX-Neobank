import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Stage } from "../ui/Stage";
import { Screen } from "../ui/Screen";
import { Logo } from "../ui/Logo";
import { Mark } from "../ui/Mark";
import { BRAND } from "../theme";
import { sora, plexMono, hanken } from "../fonts";
import { KARIM, cashTotal, sumInvest, sumEarn, sumFuturesValue } from "../data";
import { fmtUSD } from "../format";

export const Home: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const total = cashTotal();
  const invest = sumInvest();
  const earn = sumEarn();
  const futures = sumFuturesValue();
  const netWorth = total + invest + earn + futures;

  // Animated number counts up
  const counter = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 80 },
    durationInFrames: 35,
  });
  const animatedTotal = total * counter;

  // Tiles slide up
  const tilesIn = spring({
    frame: frame - 12,
    fps,
    config: { damping: 22, stiffness: 180 },
  });

  const quickIn = spring({
    frame: frame - 24,
    fps,
    config: { damping: 22, stiffness: 180 },
  });

  const netIn = spring({
    frame: frame - 38,
    fps,
    config: { damping: 22, stiffness: 180 },
  });

  return (
    <Stage
      index={3}
      count={14}
      eyebrow="Home"
      title="One balance. Both rails."
      description="Your USD account and your USDC wallet, summed into a single cash figure. Quick actions sit one tap away."
    >
      <Screen>
        {/* Header */}
        <div
          style={{
            padding: "8px 16px 12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Logo size={26} />
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 999,
              background: BRAND.blue50,
              color: BRAND.blue700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: sora,
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            KK
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Balance card */}
          <div
            style={{
              margin: "0 16px",
              borderRadius: 24,
              background: BRAND.brandDeepGradient,
              color: "#fff",
              padding: "20px 20px 20px",
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 30px 80px -20px rgba(5,64,134,.45)",
            }}
          >
            <div
              style={{
                position: "absolute",
                right: -10,
                top: -10,
                opacity: 0.15,
              }}
            >
              <Mark size={180} knockout twoTone={false} />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  fontFamily: plexMono,
                  fontSize: 12,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: BRAND.blue200,
                }}
              >
                Cash balance
              </div>
              <div
                style={{
                  fontFamily: plexMono,
                  fontSize: 11,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "rgba(186,209,237,0.8)",
                }}
              >
                Across both rails
              </div>
            </div>
            <div
              style={{
                fontFamily: sora,
                fontWeight: 800,
                fontSize: 44,
                fontVariantNumeric: "tabular-nums",
                letterSpacing: "-0.02em",
                lineHeight: 1.04,
                marginTop: 6,
              }}
            >
              {fmtUSD(animatedTotal)}
            </div>

            <div
              style={{
                marginTop: 16,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
                opacity: tilesIn,
                transform: `translateY(${interpolate(tilesIn, [0, 1], [12, 0])}px)`,
              }}
            >
              <RailTile label="USD" value={fmtUSD(KARIM.fiatUsd)} />
              <RailTile label="USDC" value={fmtUSD(KARIM.usdcUsdc)} />
            </div>
          </div>

          {/* Quick actions */}
          <div
            style={{
              padding: "0 16px",
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 10,
              opacity: quickIn,
              transform: `translateY(${interpolate(quickIn, [0, 1], [10, 0])}px)`,
            }}
          >
            <QuickAction label="Add money" primary />
            <QuickAction label="Convert" />
            <QuickAction label="Card" />
            <QuickAction label="Send" />
          </div>

          {/* Net worth */}
          <div
            style={{
              margin: "0 16px",
              opacity: netIn,
              transform: `translateY(${interpolate(netIn, [0, 1], [10, 0])}px)`,
            }}
          >
            <div
              style={{
                background: "#fff",
                border: `1px solid ${BRAND.ink100}`,
                borderRadius: 18,
                padding: 16,
                boxShadow: "0 1px 2px rgba(2,31,64,.04)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                }}
              >
                <div
                  style={{
                    fontFamily: plexMono,
                    fontSize: 12,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: BRAND.ink500,
                  }}
                >
                  Net worth
                </div>
                <div
                  style={{
                    fontFamily: sora,
                    fontWeight: 700,
                    fontSize: 22,
                    fontVariantNumeric: "tabular-nums",
                    color: BRAND.ink,
                  }}
                >
                  {fmtUSD(netWorth)}
                </div>
              </div>

              {/* Stack bar */}
              <div
                style={{
                  display: "flex",
                  height: 10,
                  borderRadius: 999,
                  overflow: "hidden",
                  marginTop: 12,
                  background: BRAND.ink100,
                }}
              >
                <div
                  style={{
                    width: `${(total / netWorth) * 100}%`,
                    background: BRAND.deep900,
                  }}
                />
                <div
                  style={{
                    width: `${(invest / netWorth) * 100}%`,
                    background: BRAND.blue,
                  }}
                />
                <div
                  style={{
                    width: `${(earn / netWorth) * 100}%`,
                    background: BRAND.blue400,
                  }}
                />
                <div
                  style={{
                    width: `${(futures / netWorth) * 100}%`,
                    background: BRAND.blue200,
                  }}
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "10px 16px",
                  marginTop: 12,
                }}
              >
                <Legend color={BRAND.deep900} label="Cash" value={total} />
                <Legend color={BRAND.blue} label="Invest" value={invest} />
                <Legend color={BRAND.blue400} label="Earn" value={earn} />
                <Legend color={BRAND.blue200} label="Futures" value={futures} />
              </div>
            </div>
          </div>
        </div>
      </Screen>
    </Stage>
  );
};

const RailTile: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div
    style={{
      background: "rgba(255,255,255,0.08)",
      border: "1px solid rgba(255,255,255,0.14)",
      borderRadius: 14,
      padding: "10px 14px",
    }}
  >
    <div
      style={{
        fontFamily: plexMono,
        fontSize: 11,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: BRAND.blue200,
      }}
    >
      {label}
    </div>
    <div
      style={{
        fontFamily: plexMono,
        fontVariantNumeric: "tabular-nums",
        fontWeight: 600,
        fontSize: 17,
        color: "#fff",
        marginTop: 4,
      }}
    >
      {value}
    </div>
  </div>
);

const QuickAction: React.FC<{ label: string; primary?: boolean }> = ({
  label,
  primary,
}) => (
  <div
    style={{
      padding: "14px 8px",
      background: "#fff",
      border: `1px solid ${BRAND.ink100}`,
      borderRadius: 18,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 8,
    }}
  >
    <div
      style={{
        width: 40,
        height: 40,
        borderRadius: 12,
        background: primary ? BRAND.blue : BRAND.blue50,
        color: primary ? "#fff" : BRAND.blue700,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: sora,
        fontWeight: 800,
        fontSize: 18,
      }}
    >
      {label === "Add money"
        ? "+"
        : label === "Convert"
          ? "⇄"
          : label === "Send"
            ? "↗"
            : "▢"}
    </div>
    <div
      style={{
        fontFamily: hanken,
        fontSize: 11.5,
        fontWeight: 600,
        color: BRAND.ink,
        textAlign: "center",
        lineHeight: 1.1,
      }}
    >
      {label}
    </div>
  </div>
);

const Legend: React.FC<{ color: string; label: string; value: number }> = ({
  color,
  label,
  value,
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 8,
    }}
  >
    <span
      style={{ width: 10, height: 10, borderRadius: 999, background: color }}
    />
    <span style={{ fontFamily: hanken, fontSize: 13, color: BRAND.ink700, flex: 1 }}>
      {label}
    </span>
    <span
      style={{
        fontFamily: plexMono,
        fontVariantNumeric: "tabular-nums",
        fontWeight: 600,
        fontSize: 13,
        color: BRAND.ink,
      }}
    >
      {fmtUSD(value)}
    </span>
  </div>
);
