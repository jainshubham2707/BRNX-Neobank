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
import { KARIM } from "../data";

export const Signin: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Type the phone digits one at a time
  const phoneDigits = KARIM.phone.replace(/^\+971\s?/, ""); // "50 555 0042"
  const charsVisible = Math.min(
    phoneDigits.length,
    Math.max(0, Math.floor((frame - 12) / 3))
  );
  const phoneShown = phoneDigits.slice(0, charsVisible);

  // Caret blink
  const showCaret = Math.floor(frame / 8) % 2 === 0;

  // Send-button press near the end
  const pressOpen = spring({
    frame: frame - 60,
    fps,
    config: { damping: 22, stiffness: 200 },
  });

  return (
    <Stage
      index={1}
      count={14}
      eyebrow="Sign in"
      title="Sign in with your mobile number."
      description="One number, one identity. We'll text a six-digit code to confirm it's you."
    >
      <Screen>
        <div style={{ padding: "44px 22px 0" }}>
          <Logo size={22} />
        </div>

        <div style={{ padding: "32px 24px", flex: 1 }}>
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
            What&apos;s your mobile number?
          </div>
          <div
            style={{
              fontFamily: hanken,
              fontSize: 14.5,
              color: BRAND.ink500,
              marginTop: 8,
              lineHeight: 1.4,
            }}
          >
            We&apos;ll send a one-time code to sign you in.
          </div>

          {/* Country + input */}
          <div
            style={{
              marginTop: 24,
              borderRadius: 18,
              background: "#fff",
              border: `1px solid ${BRAND.ink100}`,
              display: "flex",
              alignItems: "center",
              overflow: "hidden",
              boxShadow: "0 1px 2px rgba(2,31,64,.04)",
            }}
          >
            <div
              style={{
                padding: "14px 16px",
                fontFamily: plexMono,
                fontSize: 15,
                color: BRAND.ink700,
                borderRight: `1px solid ${BRAND.ink100}`,
              }}
            >
              +971
            </div>
            <div
              style={{
                flex: 1,
                padding: "14px 12px",
                fontFamily: plexMono,
                fontSize: 17,
                color: BRAND.ink,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {phoneShown}
              {showCaret && (
                <span
                  style={{
                    display: "inline-block",
                    width: 2,
                    height: 18,
                    background: BRAND.blue,
                    verticalAlign: "middle",
                    marginLeft: 2,
                  }}
                />
              )}
            </div>
          </div>

          {/* Send code button */}
          <div
            style={{
              marginTop: 16,
              height: 56,
              borderRadius: 18,
              background: BRAND.blue,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 6px 18px rgba(7,90,189,.32)",
              transform: `scale(${interpolate(pressOpen, [0, 1], [1, 0.97])})`,
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
              Send code
            </span>
          </div>

          <div
            style={{
              fontFamily: hanken,
              fontSize: 12,
              color: BRAND.ink500,
              textAlign: "center",
              marginTop: 12,
            }}
          >
            By continuing, you agree to our Terms and Privacy Policy.
          </div>
        </div>
      </Screen>
    </Stage>
  );
};
