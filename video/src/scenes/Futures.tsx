import React from "react";
import {
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Stage } from "../ui/Stage";
import { Screen, ScreenTopBar, Card, Eyebrow, Chip } from "../ui/Screen";
import { BRAND } from "../theme";
import { sora, plexMono, hanken } from "../fonts";
import { KARIM } from "../data";
import { fmtPct, fmtUSD } from "../format";

const MARKETS = [
  { symbol: "NVDA-FUT", base: "NVDA", mark: 146.1, change24h: 2.21 },
  { symbol: "TSLA-FUT", base: "TSLA", mark: 322.5, change24h: -1.35 },
  { symbol: "PRE-OPENAI", base: "OPENAI", mark: 1_215.0, change24h: -2.4 },
  { symbol: "PRE-STRIPE", base: "STRIPE", mark: 92.5, change24h: 0.0 },
  { symbol: "XAU-PERP", base: "XAU", mark: 2_705.4, change24h: 0.46 },
];

export const Futures: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const totalMargin = KARIM.futures.reduce((s, p) => s + p.margin, 0);
  const freeMargin = KARIM.futuresWallet;
  const collateral = totalMargin + freeMargin;
  const pnl = KARIM.futures.reduce((s, p) => s + p.pnl, 0);

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
  const marketsIn = spring({
    frame: frame - 30,
    fps,
    config: { damping: 22, stiffness: 180 },
  });

  return (
    <Stage
      index={11}
      count={14}
      eyebrow="Invest · Futures"
      title="Stocks, commodities, pre-IPO."
      description="Trade perpetuals via Hyperliquid builder codes — collateral is isolated in a separate futures wallet."
    >
      <Screen topInset={0}>
        <ScreenTopBar title="Invest" />
        <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Filter tabs */}
          <div style={{ display: "flex", gap: 8 }}>
            <Pill label="Stocks" />
            <Pill label="xStocks" />
            <Pill label="Futures" active />
          </div>

          {/* Wallet hero */}
          <div
            style={{
              opacity: heroIn,
              transform: `translateY(${interpolate(heroIn, [0, 1], [10, 0])}px)`,
              background: `linear-gradient(135deg, ${BRAND.deep900} 0%, ${BRAND.deep} 60%, ${BRAND.blue} 100%)`,
              color: "#fff",
              padding: 16,
              borderRadius: 18,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div
                  style={{
                    fontFamily: plexMono,
                    fontSize: 11.5,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: BRAND.blue200,
                  }}
                >
                  Futures wallet
                </div>
                <div
                  style={{
                    fontFamily: sora,
                    fontWeight: 800,
                    fontSize: 30,
                    fontVariantNumeric: "tabular-nums",
                    marginTop: 4,
                  }}
                >
                  {fmtUSD(collateral)}
                </div>
                <div style={{ fontFamily: hanken, fontSize: 12, color: BRAND.blue200, marginTop: 4 }}>
                  Isolated from your spendable balance
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    fontFamily: plexMono,
                    fontSize: 11.5,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: BRAND.blue200,
                  }}
                >
                  Open PnL
                </div>
                <div
                  style={{
                    fontFamily: sora,
                    fontWeight: 800,
                    fontSize: 22,
                    color: pnl >= 0 ? BRAND.emerald : BRAND.rose,
                    fontVariantNumeric: "tabular-nums",
                    marginTop: 4,
                  }}
                >
                  +{fmtUSD(Math.abs(pnl))}
                </div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 12 }}>
              <Tile label="In margin" value={fmtUSD(totalMargin)} />
              <Tile label="Free" value={fmtUSD(freeMargin)} />
            </div>
          </div>

          {/* Positions */}
          <div
            style={{
              opacity: positionsIn,
              transform: `translateY(${interpolate(positionsIn, [0, 1], [10, 0])}px)`,
            }}
          >
            <Card style={{ padding: 0 }}>
              {KARIM.futures.map((p, i) => (
                <div
                  key={p.symbol}
                  style={{
                    padding: "14px 16px",
                    borderBottom:
                      i === KARIM.futures.length - 1 ? "none" : `1px solid ${BRAND.ink100}`,
                    display: "flex",
                    gap: 12,
                  }}
                >
                  <LogoTile base={p.symbol.replace("-FUT", "").replace("PRE-", "")} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: sora, fontWeight: 700, fontSize: 15, color: BRAND.ink }}>
                      {p.symbol}
                    </div>
                    <div style={{ marginTop: 4 }}>
                      <Chip variant={p.side === "long" ? "earn" : "fail"}>
                        {p.side === "long" ? "Long" : "Short"} {p.lev}×
                      </Chip>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        fontFamily: plexMono,
                        fontWeight: 600,
                        fontSize: 15,
                        color: p.pnl >= 0 ? BRAND.emerald : BRAND.rose,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {p.pnl >= 0 ? "+" : "−"}
                      {fmtUSD(Math.abs(p.pnl))}
                    </div>
                    <div
                      style={{
                        fontFamily: plexMono,
                        fontSize: 12,
                        marginTop: 2,
                        color: p.pnlPct >= 0 ? BRAND.emerald : BRAND.rose,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {p.pnlPct >= 0 ? "+" : ""}
                      {fmtPct(p.pnlPct)}
                    </div>
                  </div>
                </div>
              ))}
            </Card>
          </div>

          {/* Markets */}
          <div
            style={{
              opacity: marketsIn,
              transform: `translateY(${interpolate(marketsIn, [0, 1], [10, 0])}px)`,
            }}
          >
            <Card style={{ padding: 0 }}>
              {MARKETS.map((m, i) => (
                <div
                  key={m.symbol}
                  style={{
                    padding: "12px 14px",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    borderBottom:
                      i === MARKETS.length - 1 ? "none" : `1px solid ${BRAND.ink100}`,
                  }}
                >
                  <LogoTile base={m.base} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: hanken, fontWeight: 600, fontSize: 14, color: BRAND.ink }}>
                      {m.symbol}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        fontFamily: plexMono,
                        fontWeight: 600,
                        fontSize: 14,
                        color: BRAND.ink,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {fmtUSD(m.mark)}
                    </div>
                    <div
                      style={{
                        fontFamily: plexMono,
                        fontSize: 12,
                        marginTop: 2,
                        color: m.change24h > 0 ? BRAND.emerald : m.change24h < 0 ? BRAND.rose : BRAND.ink500,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {m.change24h > 0 ? "+" : ""}
                      {fmtPct(m.change24h)}
                    </div>
                  </div>
                </div>
              ))}
            </Card>
          </div>
        </div>
      </Screen>
    </Stage>
  );
};

const Tile: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div
    style={{
      borderRadius: 12,
      background: "rgba(255,255,255,0.10)",
      border: "1px solid rgba(255,255,255,0.15)",
      padding: "8px 12px",
    }}
  >
    <div
      style={{
        fontFamily: plexMono,
        fontSize: 10.5,
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
        fontWeight: 600,
        fontSize: 15,
        color: "#fff",
        marginTop: 2,
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {value}
    </div>
  </div>
);

const Pill: React.FC<{ label: string; active?: boolean }> = ({ label, active }) => (
  <div
    style={{
      padding: "6px 14px",
      borderRadius: 999,
      fontFamily: sora,
      fontWeight: 600,
      fontSize: 12,
      background: active ? BRAND.ink : "#fff",
      color: active ? "#fff" : BRAND.ink700,
      border: active ? "none" : `1px solid ${BRAND.ink100}`,
    }}
  >
    {label}
  </div>
);

const LogoTile: React.FC<{ base: string }> = ({ base }) => {
  const isGoogl = base === "GOOGL";
  return (
    <div
      style={{
        width: 40,
        height: 40,
        borderRadius: 12,
        background: "#fff",
        border: `1px solid ${BRAND.ink100}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <img
        src={staticFile(isGoogl ? "/logos/GOOGL.jpg" : `/logos/${base}.png`)}
        alt=""
        style={{ width: 28, height: 28, objectFit: "contain" }}
      />
    </div>
  );
};
