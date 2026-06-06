import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Stage } from "../ui/Stage";
import { Screen, ScreenTopBar, Card, Eyebrow, Mono } from "../ui/Screen";
import { Mark } from "../ui/Mark";
import { BRAND } from "../theme";
import { sora, plexMono, hanken } from "../fonts";
import { KARIM } from "../data";
import { fmtUSD } from "../format";

export const Cards: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Flip from fiat card to stablecoin card
  const flipStart = 28;
  const flipProgress = spring({
    frame: frame - flipStart,
    fps,
    config: { damping: 24, stiffness: 110 },
    durationInFrames: 30,
  });

  const cardEnter = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 110, mass: 0.9 },
  });

  const tilesIn = spring({
    frame: frame - 18,
    fps,
    config: { damping: 22, stiffness: 180 },
  });

  // Two cards stacked, the top one flips out
  const flipDeg = interpolate(flipProgress, [0, 1], [0, 180]);
  const showBack = flipProgress > 0.5;

  return (
    <Stage
      index={7}
      count={14}
      eyebrow="Cards"
      title="One identity, two cards."
      description="Spend from USD on the fiat card or USDC on the stablecoin card. USDC converts to USD at the moment of the swipe."
    >
      <Screen topInset={0}>
        <ScreenTopBar title="Cards" />
        <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Tab pills */}
          <div style={{ display: "flex", gap: 8 }}>
            <Tab label="Fiat card" active={!showBack} />
            <Tab label="Stablecoin card" active={showBack} />
          </div>

          {/* Card visual with 3D flip */}
          <div
            style={{
              perspective: 1400,
              transform: `scale(${interpolate(cardEnter, [0, 1], [0.94, 1])})`,
            }}
          >
            <div
              style={{
                width: "100%",
                height: 220,
                position: "relative",
                transformStyle: "preserve-3d",
                transform: `rotateY(${flipDeg}deg)`,
              }}
            >
              {/* Front */}
              <CardFace
                rail="USD"
                last4="0042"
                expMonth={4}
                expYear={29}
                holder={KARIM.name}
                gradient={`linear-gradient(135deg, ${BRAND.blue800} 0%, ${BRAND.blue600} 50%, ${BRAND.blue400} 100%)`}
              />
              {/* Back (rotated) */}
              <div style={{ position: "absolute", inset: 0, transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}>
                <CardFace
                  rail="USDC"
                  last4="4242"
                  expMonth={4}
                  expYear={29}
                  holder={KARIM.name}
                  gradient={`linear-gradient(135deg, ${BRAND.deep900} 0%, ${BRAND.deep} 60%, ${BRAND.blue} 100%)`}
                />
              </div>
            </div>
          </div>

          {/* Balance card */}
          <div
            style={{
              opacity: tilesIn,
              transform: `translateY(${interpolate(tilesIn, [0, 1], [10, 0])}px)`,
            }}
          >
            <Card
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <Eyebrow>Spendable balance</Eyebrow>
                <div
                  style={{
                    fontFamily: sora,
                    fontWeight: 700,
                    fontSize: 24,
                    color: BRAND.ink,
                    fontVariantNumeric: "tabular-nums",
                    marginTop: 4,
                  }}
                >
                  {showBack ? fmtUSD(KARIM.usdcUsdc) : fmtUSD(KARIM.fiatUsd)}
                </div>
                {showBack && (
                  <div style={{ fontFamily: hanken, fontSize: 12, color: BRAND.ink500, marginTop: 4 }}>
                    Converts to USD at the moment you tap
                  </div>
                )}
              </div>
              <div
                style={{
                  background: BRAND.blue50,
                  color: BRAND.blue700,
                  padding: "4px 12px",
                  borderRadius: 999,
                  fontFamily: sora,
                  fontWeight: 700,
                  fontSize: 11,
                }}
              >
                Default
              </div>
            </Card>
          </div>

          {/* Action tiles */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
            {["Freeze", "Limits", "Details", "Settings"].map((label) => (
              <div
                key={label}
                style={{
                  padding: "12px 6px",
                  background: "#fff",
                  border: `1px solid ${BRAND.ink100}`,
                  borderRadius: 18,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    background: BRAND.blue50,
                    color: BRAND.blue700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  ✦
                </div>
                <span
                  style={{
                    fontFamily: hanken,
                    fontWeight: 600,
                    fontSize: 11.5,
                    color: BRAND.ink,
                  }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Screen>
    </Stage>
  );
};

const Tab: React.FC<{ label: string; active: boolean }> = ({ label, active }) => (
  <div
    style={{
      padding: "6px 12px",
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

const CardFace: React.FC<{
  rail: "USD" | "USDC";
  last4: string;
  expMonth: number;
  expYear: number;
  holder: string;
  gradient: string;
}> = ({ rail, last4, expMonth, expYear, holder, gradient }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      borderRadius: 22,
      background: gradient,
      color: "#fff",
      padding: 16,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      overflow: "hidden",
      backfaceVisibility: "hidden",
      boxShadow: "0 30px 80px -20px rgba(5,64,134,.45)",
    }}
  >
    <div
      style={{
        position: "absolute",
        right: -30,
        top: -30,
        opacity: 0.2,
      }}
    >
      <Mark size={200} knockout twoTone={false} />
    </div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div
        style={{
          fontFamily: plexMono,
          fontSize: 10.5,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          opacity: 0.85,
        }}
      >
        {rail === "USD" ? "Fiat · USD" : "Stablecoin · USDC"}
      </div>
      <div
        style={{
          fontFamily: plexMono,
          fontSize: 11,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          opacity: 0.85,
        }}
      >
        Visa
      </div>
    </div>
    <div>
      <div
        style={{
          fontFamily: sora,
          fontWeight: 600,
          fontSize: 15,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
        }}
      >
        {holder}
      </div>
      <div
        style={{
          fontFamily: plexMono,
          fontVariantNumeric: "tabular-nums",
          fontSize: 16,
          letterSpacing: "0.18em",
          marginTop: 6,
        }}
      >
        •••• •••• •••• {last4}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginTop: 6,
        }}
      >
        <div
          style={{
            fontFamily: plexMono,
            fontSize: 11,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            opacity: 0.85,
          }}
        >
          {String(expMonth).padStart(2, "0")}/{expYear}
        </div>
        <div
          style={{
            fontFamily: sora,
            fontWeight: 800,
            fontSize: 18,
            fontStyle: "italic",
            letterSpacing: "-0.02em",
          }}
        >
          VISA
        </div>
      </div>
    </div>
  </div>
);
