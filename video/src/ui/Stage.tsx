import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing, spring } from "remotion";
import { PhoneFrame } from "./PhoneFrame";
import { sora, hanken, plexMono } from "../fonts";
import { BRAND } from "../theme";

/**
 * Full-frame stage with a soft dark backdrop, an animated header strip on
 * the left, and the phone frame on the right. Used by every scene.
 *
 * The header (eyebrow + title + description) animates in with a spring on
 * scene entrance.
 */
export const Stage: React.FC<{
  index?: number;
  count?: number;
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
  /** Optional accent — a sub-line under the description. */
  accent?: React.ReactNode;
}> = ({ index, count, eyebrow, title, description, children, accent }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const reveal = spring({
    frame,
    fps,
    config: { damping: 22, stiffness: 180, mass: 1 },
  });
  const slide = interpolate(reveal, [0, 1], [40, 0]);
  const opacity = interpolate(reveal, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Subtitle (eyebrow) ticks in first, then title, then description
  const introTitle = spring({
    frame: frame - 4,
    fps,
    config: { damping: 22, stiffness: 180 },
  });
  const introDesc = spring({
    frame: frame - 10,
    fps,
    config: { damping: 22, stiffness: 180 },
  });

  // Subtle pan for the phone
  const phoneScale = interpolate(frame, [0, 30], [0.96, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  return (
    <AbsoluteFill
      style={{
        background: BRAND.stageBg,
        fontFamily: hanken,
        color: "#fff",
        overflow: "hidden",
      }}
    >
      {/* Decorative gradient orbs */}
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 900,
          left: -200,
          top: -300,
          background:
            "radial-gradient(circle at center, rgba(7,90,189,0.35), transparent 60%)",
          filter: "blur(60px)",
          opacity: 0.55,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          right: -120,
          bottom: -100,
          background:
            "radial-gradient(circle at center, rgba(34,211,238,0.18), transparent 60%)",
          filter: "blur(80px)",
          opacity: 0.5,
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          padding: "60px 90px",
          gap: 90,
        }}
      >
        {/* LEFT — header */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 18,
            maxWidth: 720,
          }}
        >
          {/* Step counter */}
          {typeof index === "number" && typeof count === "number" && (
            <div
              style={{
                opacity: opacity * 0.8,
                transform: `translateY(${slide}px)`,
                fontFamily: plexMono,
                fontSize: 16,
                letterSpacing: "0.25em",
                color: BRAND.blue200,
                textTransform: "uppercase",
              }}
            >
              {String(index).padStart(2, "0")} / {String(count).padStart(2, "0")}
            </div>
          )}
          {/* Eyebrow */}
          <div
            style={{
              opacity,
              transform: `translateY(${slide}px)`,
              fontFamily: plexMono,
              fontSize: 18,
              letterSpacing: "0.22em",
              color: BRAND.cyan,
              textTransform: "uppercase",
            }}
          >
            {eyebrow}
          </div>
          {/* Title */}
          <div
            style={{
              opacity: introTitle,
              transform: `translateY(${interpolate(introTitle, [0, 1], [40, 0])}px)`,
              fontFamily: sora,
              fontWeight: 800,
              fontSize: 76,
              lineHeight: 1.02,
              letterSpacing: "-0.025em",
              color: "#fff",
            }}
          >
            {title}
          </div>
          {/* Description */}
          <div
            style={{
              opacity: introDesc * 0.92,
              transform: `translateY(${interpolate(introDesc, [0, 1], [30, 0])}px)`,
              fontFamily: hanken,
              fontWeight: 400,
              fontSize: 26,
              lineHeight: 1.45,
              color: "#cdd9ee",
              maxWidth: 640,
            }}
          >
            {description}
          </div>
          {accent && (
            <div
              style={{
                opacity: introDesc * 0.92,
                transform: `translateY(${interpolate(introDesc, [0, 1], [30, 0])}px)`,
                marginTop: 8,
              }}
            >
              {accent}
            </div>
          )}
        </div>

        {/* RIGHT — phone */}
        <div
          style={{
            transform: `scale(${phoneScale})`,
            transformOrigin: "center center",
          }}
        >
          <PhoneFrame>{children}</PhoneFrame>
        </div>
      </div>
    </AbsoluteFill>
  );
};
