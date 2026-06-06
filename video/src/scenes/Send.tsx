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
import { fmtUSD } from "../format";

export const Send: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sourceIn = spring({
    frame: frame - 2,
    fps,
    config: { damping: 22, stiffness: 180 },
  });
  const beneIn = spring({
    frame: frame - 14,
    fps,
    config: { damping: 22, stiffness: 180 },
  });
  const amountIn = spring({
    frame: frame - 26,
    fps,
    config: { damping: 22, stiffness: 180 },
  });
  const btnIn = spring({
    frame: frame - 42,
    fps,
    config: { damping: 22, stiffness: 200 },
  });

  return (
    <Stage
      index={8}
      count={14}
      eyebrow="Send"
      title="Wire to any bank, from either rail."
      description="Send USD out the front door, or off-ramp USDC at the live rate — the recipient sees clean USD either way."
    >
      <Screen topInset={0}>
        <ScreenTopBar title="Send to bank" />
        <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Source toggle */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 4,
              padding: 4,
              background: BRAND.ink100,
              borderRadius: 18,
            }}
          >
            <div
              style={{
                padding: "8px 0",
                textAlign: "center",
                borderRadius: 14,
                background: "#fff",
                fontFamily: sora,
                fontWeight: 600,
                fontSize: 13,
                color: BRAND.ink,
                boxShadow: "0 1px 2px rgba(2,31,64,.04)",
              }}
            >
              From USD
            </div>
            <div
              style={{
                padding: "8px 0",
                textAlign: "center",
                fontFamily: sora,
                fontWeight: 600,
                fontSize: 13,
                color: BRAND.ink500,
              }}
            >
              From USDC
            </div>
          </div>

          {/* From card */}
          <div
            style={{
              opacity: sourceIn,
              transform: `translateY(${interpolate(sourceIn, [0, 1], [10, 0])}px)`,
            }}
          >
            <div
              style={{
                background: "rgba(7,90,189,0.06)",
                border: `1px solid ${BRAND.blue200}`,
                borderRadius: 18,
                padding: 14,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <Eyebrow>From</Eyebrow>
                <div
                  style={{
                    fontFamily: sora,
                    fontWeight: 600,
                    fontSize: 14.5,
                    color: BRAND.ink,
                    marginTop: 4,
                  }}
                >
                  USD account
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <Eyebrow>Available</Eyebrow>
                <div
                  style={{
                    fontFamily: plexMono,
                    fontVariantNumeric: "tabular-nums",
                    fontWeight: 600,
                    fontSize: 14,
                    color: BRAND.ink,
                    marginTop: 4,
                  }}
                >
                  $38,412.55
                </div>
              </div>
            </div>
          </div>

          {/* Beneficiary */}
          <div
            style={{
              opacity: beneIn,
              transform: `translateY(${interpolate(beneIn, [0, 1], [10, 0])}px)`,
            }}
          >
            <Card style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
              <Eyebrow>Beneficiary</Eyebrow>
              <Field label="Name" value="Yara Khoury" />
              <Field label="IBAN / account number" value="AE07 0331 2345 6789 0123" mono />
              <Field label="SWIFT / BIC" value="EBILAEAD" mono />
            </Card>
          </div>

          {/* Amount */}
          <div
            style={{
              opacity: amountIn,
              transform: `translateY(${interpolate(amountIn, [0, 1], [10, 0])}px)`,
            }}
          >
            <Card>
              <Eyebrow>Amount to send</Eyebrow>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 8,
                  marginTop: 4,
                }}
              >
                <span style={{ fontFamily: sora, fontWeight: 800, fontSize: 44, color: BRAND.ink300, letterSpacing: "-0.02em" }}>
                  $
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
                  2,500
                </span>
              </div>
              <div
                style={{
                  fontFamily: hanken,
                  fontSize: 12,
                  color: BRAND.ink500,
                  marginTop: 6,
                }}
              >
                Wire fee {fmtUSD(4)} · You&apos;ll be debited{" "}
                <Mono size={12}>$2,504.00</Mono>
              </div>
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
              marginTop: 2,
            }}
          >
            <span style={{ fontFamily: sora, fontWeight: 700, fontSize: 15, color: "#fff" }}>
              Review send
            </span>
          </div>
        </div>
      </Screen>
    </Stage>
  );
};

const Field: React.FC<{ label: string; value: string; mono?: boolean }> = ({
  label,
  value,
  mono,
}) => (
  <div>
    <div
      style={{
        fontFamily: plexMono,
        fontSize: 11,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: BRAND.ink500,
        marginBottom: 4,
      }}
    >
      {label}
    </div>
    <div
      style={{
        height: 40,
        borderRadius: 12,
        border: `1px solid ${BRAND.ink100}`,
        background: BRAND.canvas,
        padding: "0 12px",
        display: "flex",
        alignItems: "center",
        fontFamily: mono ? plexMono : hanken,
        fontVariantNumeric: mono ? "tabular-nums" : "normal",
        fontSize: 14,
        color: BRAND.ink,
      }}
    >
      {value}
    </div>
  </div>
);
