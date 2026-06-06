import React from "react";
import {
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Stage } from "../ui/Stage";
import { Screen, ScreenTopBar, Card, Eyebrow, SectionLabel } from "../ui/Screen";
import { BRAND } from "../theme";
import { sora, plexMono, hanken } from "../fonts";
import { KARIM, sumInvest } from "../data";
import { fmtPct, fmtUSD } from "../format";

type Filter = "Stocks" | "xStocks" | "Futures";

export const Invest: React.FC<{ filter?: Filter; index?: number; eyebrow?: string; title?: string; description?: string }> = ({
  filter = "Stocks",
  index = 9,
  eyebrow = "Invest · Stocks",
  title = "Buy US equities in fractions.",
  description = "Apple, NVIDIA, Microsoft, Tesla — fractional shares funded straight from your USD balance.",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const summary = sumInvest();
  const pnl =
    summary -
    KARIM.holdings.reduce((s, h) => s + h.qty * h.avg, 0);

  // Hero card grows in
  const heroIn = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 110 },
  });
  const filterIn = spring({
    frame: frame - 10,
    fps,
    config: { damping: 22, stiffness: 180 },
  });

  // Catalog list — show 6 fiat or tokenized
  const stocksCatalog = [
    { sym: "AAPL", name: "Apple Inc.", price: 232.41, dayPct: 0.82 },
    { sym: "NVDA", name: "NVIDIA Corporation", price: 146.07, dayPct: 2.14 },
    { sym: "MSFT", name: "Microsoft Corp.", price: 446.92, dayPct: -0.21 },
    { sym: "TSLA", name: "Tesla, Inc.", price: 322.55, dayPct: -1.35 },
    { sym: "META", name: "Meta Platforms", price: 624.1, dayPct: 0.42 },
    { sym: "GOOGL", name: "Alphabet (Google)", price: 188.4, dayPct: 0.97 },
  ];

  const tokenizedCatalog = [
    { sym: "AAPLx", base: "AAPL", name: "Apple Inc.", price: 231.94, dayPct: 0.77 },
    { sym: "NVDAx", base: "NVDA", name: "NVIDIA Corporation", price: 145.78, dayPct: 2.09 },
    { sym: "TSLAx", base: "TSLA", name: "Tesla, Inc.", price: 321.91, dayPct: -1.4 },
    { sym: "COINx", base: "COIN", name: "Coinbase Global", price: 311.83, dayPct: 2.29 },
    { sym: "MSTRx", base: "MSTR", name: "Strategy (MicroStrategy)", price: 411.72, dayPct: 3.13 },
    { sym: "METAx", base: "META", name: "Meta Platforms", price: 622.85, dayPct: 0.37 },
  ];

  const catalog = filter === "xStocks" ? tokenizedCatalog : stocksCatalog;

  const rowsIn = spring({
    frame: frame - 24,
    fps,
    config: { damping: 24, stiffness: 160 },
  });

  return (
    <Stage
      index={index}
      count={14}
      eyebrow={eyebrow}
      title={title}
      description={description}
    >
      <Screen topInset={0}>
        <ScreenTopBar title="Invest" />
        <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Portfolio hero */}
          <div
            style={{
              opacity: heroIn,
              transform: `translateY(${interpolate(heroIn, [0, 1], [10, 0])}px)`,
              background: BRAND.brandDeepGradient,
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
                color: BRAND.blue200,
              }}
            >
              Portfolio
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
              {fmtUSD(summary)}
            </div>
            <div
              style={{
                fontFamily: plexMono,
                fontSize: 13,
                color: pnl >= 0 ? BRAND.emerald : BRAND.rose,
                marginTop: 4,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              +{fmtUSD(pnl)} all-time
            </div>
          </div>

          {/* Filter chips */}
          <div
            style={{
              display: "flex",
              gap: 8,
              opacity: filterIn,
              transform: `translateY(${interpolate(filterIn, [0, 1], [8, 0])}px)`,
            }}
          >
            {(["Stocks", "xStocks", "Futures"] as Filter[]).map((f) => (
              <div
                key={f}
                style={{
                  padding: "6px 14px",
                  borderRadius: 999,
                  fontFamily: sora,
                  fontWeight: 600,
                  fontSize: 12,
                  background: filter === f ? BRAND.ink : "#fff",
                  color: filter === f ? "#fff" : BRAND.ink700,
                  border: filter === f ? "none" : `1px solid ${BRAND.ink100}`,
                }}
              >
                {f}
              </div>
            ))}
          </div>

          {/* Catalog rows */}
          <Card style={{ padding: 0 }}>
            {catalog.map((row, i) => {
              const rowOffset = i * 4;
              const rowOp = interpolate(
                rowsIn,
                [0, 1],
                [Math.max(0, 1 - rowOffset * 0.2), 1]
              );
              return (
                <div
                  key={row.sym}
                  style={{
                    padding: "12px 14px",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    borderBottom:
                      i === catalog.length - 1 ? "none" : `1px solid ${BRAND.ink100}`,
                    opacity: rowOp,
                  }}
                >
                  <LogoTile
                    symbol={"base" in row ? (row as { base: string }).base : row.sym}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: hanken, fontWeight: 600, fontSize: 14.5, color: BRAND.ink }}>
                      {row.sym}
                    </div>
                    <div
                      style={{
                        fontFamily: hanken,
                        fontSize: 12,
                        color: BRAND.ink500,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {row.name}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        fontFamily: plexMono,
                        fontVariantNumeric: "tabular-nums",
                        fontWeight: 600,
                        fontSize: 14,
                        color: BRAND.ink,
                      }}
                    >
                      {fmtUSD(row.price)}
                    </div>
                    <div
                      style={{
                        fontFamily: plexMono,
                        fontSize: 12,
                        marginTop: 2,
                        color:
                          row.dayPct > 0 ? BRAND.emerald : row.dayPct < 0 ? BRAND.rose : BRAND.ink500,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {row.dayPct > 0 ? "+" : ""}
                      {fmtPct(row.dayPct)}
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

const LogoTile: React.FC<{ symbol: string }> = ({ symbol }) => {
  const path = `/logos/${symbol.replace(/x$/, "")}.png`;
  // GOOGL is JPG
  const isGoogl = symbol === "GOOGL";
  const src = isGoogl ? "/logos/GOOGL.jpg" : path;
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
        src={staticFile(src)}
        alt=""
        style={{ width: 28, height: 28, objectFit: "contain" }}
      />
    </div>
  );
};
