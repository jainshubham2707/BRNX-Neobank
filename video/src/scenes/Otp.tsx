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
import { BRAND } from "../theme";
import { sora, plexMono, hanken } from "../fonts";

const CODE = "428013";

export const Otp: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Fill each cell with a small stagger
  const filledCount = Math.min(6, Math.max(0, Math.floor((frame - 16) / 6)));

  // Verify button press at the end
  const verifyPress = spring({
    frame: frame - 70,
    fps,
    config: { damping: 22, stiffness: 200 },
  });

  return (
    <Stage
      index={2}
      count={14}
      eyebrow="Verify"
      title="Enter the six-digit code."
      description="Auto-advances as you type — paste from your messages app and the whole code lands at once."
    >
      <Screen>
        <div style={{ padding: "44px 22px 0" }}>
          <Logo size={22} />
        </div>

        <div style={{ padding: "24px 24px", flex: 1 }}>
          <div
            style={{
              fontFamily: sora,
              fontWeight: 800,
              fontSize: 28,
              letterSpacing: "-0.02em",
              color: BRAND.ink,
              lineHeight: 1.05,
            }}
          >
            Enter the 6-digit code
          </div>
          <div
            style={{
              fontFamily: hanken,
              fontSize: 14.5,
              color: BRAND.ink500,
              marginTop: 8,
            }}
          >
            Sent to{" "}
            <span
              style={{
                fontFamily: plexMono,
                color: BRAND.ink,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              +971 50 555 0042
            </span>
            .
          </div>

          {/* 6 OTP cells */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)",
              gap: 8,
              marginTop: 24,
            }}
          >
            {Array.from({ length: 6 }).map((_, i) => {
              const filled = i < filledCount;
              const justFilled = i === filledCount - 1;
              const pop = justFilled
                ? spring({
                    frame: frame - (16 + (i + 1) * 6),
                    fps,
                    config: { damping: 14, stiffness: 240 },
                    durationInFrames: 14,
                  })
                : 1;
              return (
                <div
                  key={i}
                  style={{
                    height: 56,
                    borderRadius: 14,
                    background: "#fff",
                    border: `1.5px solid ${filled ? BRAND.blue : BRAND.ink100}`,
                    boxShadow: filled
                      ? "0 0 0 4px rgba(7,90,189,0.16)"
                      : "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: sora,
                    fontWeight: 800,
                    fontSize: 26,
                    color: BRAND.ink,
                    transform: filled
                      ? `scale(${interpolate(pop, [0, 1], [1.15, 1])})`
                      : "scale(1)",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {filled ? CODE[i] : ""}
                </div>
              );
            })}
          </div>

          {/* Verify */}
          <div
            style={{
              marginTop: 20,
              height: 56,
              borderRadius: 18,
              background: filledCount === 6 ? BRAND.blue : BRAND.ink300,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow:
                filledCount === 6 ? "0 6px 18px rgba(7,90,189,.32)" : "none",
              transform: `scale(${interpolate(verifyPress, [0, 1], [1, 0.97])})`,
            }}
          >
            <span
              style={{
                fontFamily: sora,
                fontWeight: 700,
                fontSize: 15,
                color: "#fff",
              }}
            >
              Verify
            </span>
          </div>

          <div
            style={{
              fontFamily: hanken,
              fontSize: 13,
              color: BRAND.ink500,
              textAlign: "center",
              marginTop: 16,
            }}
          >
            Didn&apos;t get it?{" "}
            <span style={{ color: BRAND.ink500 }}>Resend in 18s</span>
          </div>
        </div>
      </Screen>
    </Stage>
  );
};
