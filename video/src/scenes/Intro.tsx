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

export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Mark scales + rotates in
  const markEnter = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 110, mass: 0.8 },
  });
  const markScale = interpolate(markEnter, [0, 1], [0.4, 1]);
  const markRotate = interpolate(markEnter, [0, 1], [-90, 0]);

  // Wordmark slides in after the mark
  const wordEnter = spring({
    frame: frame - 8,
    fps,
    config: { damping: 22, stiffness: 180 },
  });

  // Tagline appears later
  const tagEnter = spring({
    frame: frame - 22,
    fps,
    config: { damping: 22, stiffness: 180 },
  });

  // Soft fade out at the very end so the transition feels clean
  const exitFade = interpolate(
    frame,
    [durationInFrames - 10, durationInFrames],
    [1, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        background: BRAND.brandDeepGradient,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 60,
        color: "#fff",
        opacity: exitFade,
      }}
    >
      {/* Background orbs */}
      <div
        style={{
          position: "absolute",
          width: 1000,
          height: 1000,
          right: -200,
          top: -200,
          background:
            "radial-gradient(circle at center, rgba(34,211,238,0.22), transparent 60%)",
          filter: "blur(40px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1200,
          height: 1200,
          left: -300,
          bottom: -300,
          background:
            "radial-gradient(circle at center, rgba(143,181,225,0.18), transparent 60%)",
          filter: "blur(80px)",
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 32,
          transform: `scale(${markScale})`,
        }}
      >
        <div
          style={{
            transform: `rotate(${markRotate}deg)`,
          }}
        >
          <Mark size={180} knockout />
        </div>
        <div
          style={{
            opacity: wordEnter,
            transform: `translateX(${interpolate(wordEnter, [0, 1], [40, 0])}px)`,
            fontFamily: sora,
            fontWeight: 800,
            fontSize: 220,
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
          opacity: tagEnter,
          transform: `translateY(${interpolate(tagEnter, [0, 1], [20, 0])}px)`,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: plexMono,
            fontSize: 22,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: BRAND.blue200,
            marginBottom: 16,
          }}
        >
          dual-rail money
        </div>
        <div
          style={{
            fontFamily: sora,
            fontWeight: 700,
            fontSize: 60,
            letterSpacing: "-0.02em",
            color: "#fff",
          }}
        >
          Hold dollars. Spend borderless.
        </div>
      </div>
    </AbsoluteFill>
  );
};
