import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Stage } from "../ui/Stage";
import { Screen, ScreenTopBar, Card, Eyebrow, Mono } from "../ui/Screen";
import { BRAND } from "../theme";
import { sora, plexMono, hanken } from "../fonts";
import { fmtNum, fmtUSD } from "../format";

const AED_INPUT = 5000;
const RATE = 3.6725;
const SPREAD = 0.0035;

export const AedOnramp: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const counter = spring({
    frame: frame - 2,
    fps,
    config: { damping: 22, stiffness: 100 },
    durationInFrames: 35,
  });
  const aed = AED_INPUT * counter;

  const usdc = (aed / RATE) * (1 - SPREAD);
  const fee = (aed / RATE) * SPREAD;

  const detailsIn = spring({
    frame: frame - 20,
    fps,
    config: { damping: 22, stiffness: 180 },
  });
  const btnIn = spring({
    frame: frame - 36,
    fps,
    config: { damping: 22, stiffness: 200 },
  });

  return (
    <Stage
      index={5}
      count={14}
      eyebrow="AED → USDC"
      title="Onramp from your local bank."
      description="Push AED from a UAE bank account or card and receive USDC in minutes — no card-swipe FX surprises."
    >
      <Screen topInset={0}>
        <ScreenTopBar title="AED → USDC" />
        <div style={{ padding: "12px 20px 18px", display: "flex", flexDirection: "column", gap: 18 }}>
          {/* You pay */}
          <div>
            <Eyebrow>You pay</Eyebrow>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 10,
                marginTop: 6,
              }}
            >
              <span
                style={{
                  fontFamily: sora,
                  fontWeight: 800,
                  fontSize: 18,
                  color: BRAND.ink300,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                AED
              </span>
              <span
                style={{
                  fontFamily: sora,
                  fontWeight: 800,
                  fontSize: 50,
                  color: BRAND.ink,
                  letterSpacing: "-0.025em",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {fmtNum(aed, 0)}
              </span>
            </div>
            <div
              style={{
                fontFamily: hanken,
                fontSize: 12,
                color: BRAND.ink500,
                marginTop: 4,
              }}
            >
              From your AED bank account or card
            </div>
          </div>

          {/* Arrow */}
          <div style={{ display: "flex", justifyContent: "center" }}>
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
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 5v14M6 13l6 6 6-6"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* You get */}
          <div>
            <Eyebrow>You get</Eyebrow>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 12,
                marginTop: 4,
              }}
            >
              <span
                style={{
                  fontFamily: sora,
                  fontWeight: 800,
                  fontSize: 50,
                  color: BRAND.ink,
                  letterSpacing: "-0.025em",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {fmtNum(usdc)}
              </span>
              <span
                style={{
                  fontFamily: sora,
                  fontWeight: 800,
                  fontSize: 22,
                  color: BRAND.ink500,
                  letterSpacing: "0.04em",
                }}
              >
                USDC
              </span>
            </div>
            <div style={{ fontFamily: hanken, fontSize: 12, color: BRAND.ink500, marginTop: 4 }}>
              Credited to your wallet
            </div>
          </div>

          {/* Details card */}
          <div
            style={{
              opacity: detailsIn,
              transform: `translateY(${interpolate(detailsIn, [0, 1], [12, 0])}px)`,
            }}
          >
            <Card style={{ padding: 0 }}>
              <KV label="Rate" value={<Mono>1 USD = {RATE.toFixed(4)} AED</Mono>} />
              <KV label="Spread" value={<Mono>0.35%</Mono>} />
              <KV label="Fee" value={<Mono>{fmtUSD(fee)}</Mono>} />
              <KV label="ETA" value={<span style={{ fontFamily: hanken, fontSize: 14, fontWeight: 600 }}>Under 5 minutes</span>} last />
            </Card>
          </div>

          {/* Button */}
          <div
            style={{
              opacity: btnIn,
              transform: `translateY(${interpolate(btnIn, [0, 1], [10, 0])}px)`,
              height: 56,
              borderRadius: 18,
              background: BRAND.blue,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 6px 18px rgba(7,90,189,.32)",
            }}
          >
            <span style={{ fontFamily: sora, fontWeight: 700, fontSize: 15, color: "#fff" }}>
              Onramp AED {fmtNum(AED_INPUT, 0)}
            </span>
          </div>
        </div>
      </Screen>
    </Stage>
  );
};

const KV: React.FC<{ label: string; value: React.ReactNode; last?: boolean }> = ({
  label,
  value,
  last,
}) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline",
      padding: "12px 16px",
      borderBottom: last ? "none" : `1px solid ${BRAND.ink100}`,
    }}
  >
    <span style={{ fontFamily: hanken, fontSize: 13, color: BRAND.ink500 }}>
      {label}
    </span>
    <span style={{ fontFamily: hanken, fontSize: 14, color: BRAND.ink, fontWeight: 600 }}>
      {value}
    </span>
  </div>
);
