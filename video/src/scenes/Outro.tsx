import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Mark } from "../ui/Mark";
import { sora, plexMono } from "../fonts";
import { BRAND } from "../theme";

export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const enter = spring({
    frame,
    fps,
    config: { damping: 22, stiffness: 110 },
  });

  const lineEnter = spring({
    frame: frame - 12,
    fps,
    config: { damping: 22, stiffness: 180 },
  });

  const taglineEnter = spring({
    frame: frame - 26,
    fps,
    config: { damping: 22, stiffness: 180 },
  });

  const fadeOut = interpolate(
    frame,
    [durationInFrames - 18, durationInFrames - 4],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        background: BRAND.brandDeepGradient,
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 60,
        opacity: fadeOut,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 36,
          transform: `scale(${interpolate(enter, [0, 1], [0.85, 1])})`,
          opacity: enter,
        }}
      >
        <Mark size={200} knockout />
        <div
          style={{
            fontFamily: sora,
            fontWeight: 800,
            fontSize: 260,
            letterSpacing: "-0.04em",
            color: "#fff",
            lineHeight: 1,
          }}
        >
          BRNX
        </div>
      </div>

      <div
        style={{
          opacity: lineEnter,
          transform: `translateY(${interpolate(lineEnter, [0, 1], [16, 0])}px)`,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: sora,
            fontWeight: 700,
            fontSize: 72,
            letterSpacing: "-0.02em",
            color: "#fff",
            lineHeight: 1.05,
          }}
        >
          Hold dollars. Spend borderless.
        </div>
      </div>

      <div
        style={{
          opacity: taglineEnter,
          transform: `translateY(${interpolate(taglineEnter, [0, 1], [12, 0])}px)`,
          fontFamily: plexMono,
          fontSize: 22,
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          color: BRAND.cyan,
        }}
      >
        Dual-rail money · UAE
      </div>
    </AbsoluteFill>
  );
};
