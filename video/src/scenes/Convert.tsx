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
import { fmtNum } from "../format";

const RATE = 0.9992;
const FROM = 8_000;

export const Convert: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const counter = spring({
    frame: frame - 4,
    fps,
    config: { damping: 22, stiffness: 100 },
    durationInFrames: 30,
  });

  const fromAmount = FROM * counter;
  const toAmount = fromAmount * RATE;

  const detailsIn = spring({
    frame: frame - 22,
    fps,
    config: { damping: 22, stiffness: 180 },
  });
  const btnIn = spring({
    frame: frame - 40,
    fps,
    config: { damping: 22, stiffness: 200 },
  });

  return (
    <Stage
      index={6}
      count={14}
      eyebrow="Convert"
      title="USD ⇄ USDC in one tap."
      description="Near 1:1, with the spread shown before you confirm. Settles when the rail confirms — no fronted balance."
    >
      <Screen topInset={0}>
        <ScreenTopBar title="Convert" />
        <div style={{ padding: "12px 16px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
          {/* From card */}
          <Card style={{ padding: 0 }}>
            <RailRow label="From" rail="USDC" amount={fmtNum(fromAmount)} />
            <div
              style={{
                position: "relative",
                height: 1,
                background: BRAND.ink100,
                margin: "0 12px",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: -20,
                  transform: "translateX(-50%)",
                  width: 40,
                  height: 40,
                  borderRadius: 14,
                  background: BRAND.blue50,
                  border: `1px solid ${BRAND.blue200}`,
                  color: BRAND.blue700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 1px 2px rgba(2,31,64,.04)",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M7 4v12m0 0l-3-3m3 3l3-3M17 20V8m0 0l-3 3m3-3l3 3"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            <RailRow label="To" rail="USD" amount={fmtNum(toAmount)} mute />
          </Card>

          {/* Rate strip */}
          <div
            style={{
              padding: "0 8px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontFamily: hanken,
              fontSize: 12.5,
              color: BRAND.ink500,
            }}
          >
            <span>
              <Mono size={12} color={BRAND.ink}>
                1 USDC
              </Mono>{" "}
              ={" "}
              <Mono size={12} color={BRAND.ink}>
                {RATE.toFixed(5)} USD
              </Mono>
            </span>
            <span style={{ fontFamily: plexMono, fontVariantNumeric: "tabular-nums" }}>
              spread 0.08%
            </span>
          </div>

          {/* Details card */}
          <div
            style={{
              opacity: detailsIn,
              transform: `translateY(${interpolate(detailsIn, [0, 1], [12, 0])}px)`,
            }}
          >
            <Card style={{ padding: 0 }}>
              <KV
                label="Rate"
                value={<Mono>1 USDC = {RATE.toFixed(5)} USD</Mono>}
              />
              <KV
                label="Spread fee"
                value={<Mono>${fmtNum(FROM * 0.0008)}</Mono>}
              />
              <KV
                label="Settlement"
                value={<span style={{ fontFamily: hanken, fontWeight: 600, fontSize: 14 }}>On rail confirmation · ~30s</span>}
                last
              />
            </Card>
          </div>

          {/* Confirm button */}
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
              marginTop: 4,
            }}
          >
            <span style={{ fontFamily: sora, fontWeight: 700, fontSize: 15, color: "#fff" }}>
              Convert
            </span>
          </div>
        </div>
      </Screen>
    </Stage>
  );
};

const RailRow: React.FC<{
  label: string;
  rail: "USD" | "USDC";
  amount: string;
  mute?: boolean;
}> = ({ label, rail, amount, mute }) => (
  <div style={{ padding: "16px 16px 14px" }}>
    <div
      style={{
        fontFamily: plexMono,
        fontSize: 11.5,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: BRAND.ink500,
      }}
    >
      {label}
    </div>
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
          fontSize: 38,
          fontVariantNumeric: "tabular-nums",
          letterSpacing: "-0.02em",
          color: mute ? BRAND.ink700 : BRAND.ink,
        }}
      >
        {amount}
      </span>
      <span
        style={{
          fontFamily: plexMono,
          fontSize: 14,
          color: BRAND.ink500,
        }}
      >
        {rail}
      </span>
    </div>
  </div>
);

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
