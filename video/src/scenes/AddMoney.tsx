import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Stage } from "../ui/Stage";
import { Screen, ScreenTopBar, SectionLabel } from "../ui/Screen";
import { BRAND } from "../theme";
import { sora, plexMono, hanken } from "../fonts";

type Option = { title: string; subtitle: string; eta: string };

const FIAT: Option[] = [
  {
    title: "SWIFT",
    subtitle: "Wire money from any bank",
    eta: "1–2 business days",
  },
];

const STABLECOIN: Option[] = [
  {
    title: "Onramp from Local Bank Account",
    subtitle: "Fund in AED, receive USDC",
    eta: "Under 5 minutes",
  },
  {
    title: "From external wallet",
    subtitle: "Send to your wallet address",
    eta: "Credits after ~30s",
  },
];

export const AddMoney: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fiatIn = spring({
    frame: frame - 10,
    fps,
    config: { damping: 22, stiffness: 180 },
  });
  const usdcIn = spring({
    frame: frame - 26,
    fps,
    config: { damping: 22, stiffness: 180 },
  });

  return (
    <Stage
      index={4}
      count={14}
      eyebrow="Add money"
      title="Top up either rail."
      description="SWIFT wire to your USD account, or onramp from a local AED account straight into USDC."
    >
      <Screen topInset={0}>
        <ScreenTopBar title="Add money" />
        <div style={{ display: "flex", flexDirection: "column", gap: 18, paddingTop: 12 }}>
          <div
            style={{
              opacity: fiatIn,
              transform: `translateY(${interpolate(fiatIn, [0, 1], [16, 0])}px)`,
            }}
          >
            <SectionLabel>To USD</SectionLabel>
            <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 10 }}>
              {FIAT.map((o) => (
                <OptionRow key={o.title} option={o} />
              ))}
            </div>
          </div>
          <div
            style={{
              opacity: usdcIn,
              transform: `translateY(${interpolate(usdcIn, [0, 1], [16, 0])}px)`,
            }}
          >
            <SectionLabel>To USDC</SectionLabel>
            <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 10 }}>
              {STABLECOIN.map((o) => (
                <OptionRow key={o.title} option={o} />
              ))}
            </div>
          </div>
        </div>
      </Screen>
    </Stage>
  );
};

const OptionRow: React.FC<{ option: Option }> = ({ option }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      padding: 16,
      gap: 12,
      background: "#fff",
      border: `1px solid ${BRAND.ink100}`,
      borderRadius: 18,
      boxShadow: "0 1px 2px rgba(2,31,64,.04)",
    }}
  >
    <div style={{ flex: 1 }}>
      <div
        style={{
          fontFamily: sora,
          fontWeight: 600,
          fontSize: 15,
          color: BRAND.ink,
        }}
      >
        {option.title}
      </div>
      <div
        style={{
          fontFamily: hanken,
          fontSize: 13,
          color: BRAND.ink500,
          marginTop: 2,
        }}
      >
        {option.subtitle}
      </div>
      <div
        style={{
          fontFamily: plexMono,
          fontSize: 11.5,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: BRAND.blue700,
          marginTop: 4,
        }}
      >
        {option.eta}
      </div>
    </div>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M9 6l6 6-6 6"
        stroke={BRAND.ink500}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </svg>
  </div>
);
