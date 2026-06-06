import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Stage } from "../ui/Stage";
import { Screen, ScreenTopBar, Card, Chip } from "../ui/Screen";
import { BRAND } from "../theme";
import { sora, plexMono, hanken } from "../fonts";
import { KARIM, sumEarn } from "../data";
import { fmtPct, fmtUSD } from "../format";

const PRODUCTS = [
  {
    name: "US T-Bill",
    rail: "USD",
    rate: 3.5,
    range: null,
    tier: "low" as const,
    note: "Idle USD parked in short-duration T-Bills. Daily liquidity.",
  },
  {
    name: "USDC Treasury",
    rail: "USDC",
    rate: 4.85,
    range: "4.6%–5.05%",
    tier: "low" as const,
    note: "Tokenized T-Bill vault, settle same-day.",
  },
  {
    name: "USDC Lending",
    rail: "USDC",
    rate: 6.0,
    range: "5.2%–7.4%",
    tier: "medium" as const,
    note: "Over-collateralized lending against blue-chip crypto.",
  },
];

export const Earn: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const total = sumEarn();
  const accrued = KARIM.earn.reduce((s, p) => s + p.accrued, 0);

  const heroIn = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 110 },
  });
  const positionsIn = spring({
    frame: frame - 14,
    fps,
    config: { damping: 22, stiffness: 180 },
  });
  const productsIn = spring({
    frame: frame - 30,
    fps,
    config: { damping: 22, stiffness: 180 },
  });

  return (
    <Stage
      index={12}
      count={14}
      eyebrow="Earn"
      title="Put idle balances to work."
      description="3.5% fixed on USD T-Bills, 4.85% APY on USDC Treasury, 6% on the USDC lending vault — all with same-day liquidity."
    >
      <Screen topInset={0}>
        <ScreenTopBar title="Earn" />
        <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Hero */}
          <div
            style={{
              opacity: heroIn,
              transform: `translateY(${interpolate(heroIn, [0, 1], [10, 0])}px)`,
              background: BRAND.emerald,
              color: "#fff",
              padding: 16,
              borderRadius: 18,
            }}
          >
            <div
              style={{
                fontFamily: plexMono,
                fontSize: 11.5,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.85)",
              }}
            >
              Earning
            </div>
            <div
              style={{
                fontFamily: sora,
                fontWeight: 800,
                fontSize: 36,
                fontVariantNumeric: "tabular-nums",
                letterSpacing: "-0.02em",
                marginTop: 4,
              }}
            >
              {fmtUSD(total)}
            </div>
            <div style={{ fontFamily: hanken, fontSize: 12.5, color: "rgba(255,255,255,0.85)", marginTop: 4 }}>
              +{fmtUSD(accrued)} accrued · still your money, working
            </div>
          </div>

          {/* Positions */}
          <div
            style={{
              opacity: positionsIn,
              transform: `translateY(${interpolate(positionsIn, [0, 1], [10, 0])}px)`,
            }}
          >
            <SectionLabel>Your positions</SectionLabel>
            <Card style={{ padding: 0 }}>
              {KARIM.earn.map((p, i) => (
                <div
                  key={p.name}
                  style={{
                    padding: "12px 16px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    borderBottom: i === KARIM.earn.length - 1 ? "none" : `1px solid ${BRAND.ink100}`,
                  }}
                >
                  <div>
                    <div style={{ fontFamily: sora, fontWeight: 600, fontSize: 14.5, color: BRAND.ink }}>
                      {p.name}
                    </div>
                    <div style={{ marginTop: 4 }}>
                      <Chip variant={p.tier === "low" ? "earn" : "warn"}>
                        {p.tier === "low" ? "Low risk" : "Medium risk"}
                      </Chip>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        fontFamily: plexMono,
                        fontWeight: 600,
                        fontSize: 14.5,
                        color: BRAND.ink,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {fmtUSD(p.principal + p.accrued)}
                    </div>
                    <div
                      style={{
                        fontFamily: plexMono,
                        fontSize: 12,
                        color: BRAND.emerald,
                        marginTop: 2,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      +{fmtUSD(p.accrued)} · {fmtPct(p.rate)}
                    </div>
                  </div>
                </div>
              ))}
            </Card>
          </div>

          {/* Products */}
          <div
            style={{
              opacity: productsIn,
              transform: `translateY(${interpolate(productsIn, [0, 1], [10, 0])}px)`,
            }}
          >
            <SectionLabel>Earn products</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {PRODUCTS.map((p) => (
                <Card key={p.name}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: sora, fontWeight: 700, fontSize: 15, color: BRAND.ink }}>
                        {p.name}
                      </div>
                      <div
                        style={{
                          fontFamily: hanken,
                          fontSize: 12.5,
                          color: BRAND.ink500,
                          marginTop: 4,
                          lineHeight: 1.35,
                        }}
                      >
                        {p.note}
                      </div>
                      <div style={{ marginTop: 8 }}>
                        <Chip variant={p.tier === "low" ? "earn" : "warn"}>
                          {p.tier === "low" ? "Low risk" : "Medium risk"}
                        </Chip>
                      </div>
                    </div>
                    <div style={{ marginLeft: 12, textAlign: "right" }}>
                      <div
                        style={{
                          fontFamily: plexMono,
                          fontWeight: 800,
                          fontSize: 20,
                          color: BRAND.emerald,
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        {fmtPct(p.rate)}
                      </div>
                      <div
                        style={{
                          fontFamily: plexMono,
                          fontSize: 10.5,
                          color: BRAND.ink500,
                          marginTop: 2,
                        }}
                      >
                        {p.range ? `APY · ${p.range}` : "Rate · fixed"}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </Screen>
    </Stage>
  );
};

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      fontFamily: sora,
      fontWeight: 600,
      fontSize: 15,
      color: BRAND.ink,
      marginBottom: 8,
    }}
  >
    {children}
  </div>
);
