import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  staticFile,
  useVideoConfig,
} from "remotion";
import {
  TransitionSeries,
  linearTiming,
  springTiming,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";

import { Intro } from "./scenes/Intro";
import { Signin } from "./scenes/Signin";
import { Otp } from "./scenes/Otp";
import { Home } from "./scenes/Home";
import { AddMoney } from "./scenes/AddMoney";
import { AedOnramp } from "./scenes/AedOnramp";
import { Convert } from "./scenes/Convert";
import { Cards } from "./scenes/Cards";
import { Send } from "./scenes/Send";
import { Invest } from "./scenes/Invest";
import { Futures } from "./scenes/Futures";
import { Earn } from "./scenes/Earn";
import { Activity } from "./scenes/Activity";
import { Outro } from "./scenes/Outro";

/** Per-scene duration in frames @30fps. */
export const SCENE_DURATIONS = {
  intro: 110,
  signin: 110,
  otp: 130,
  home: 145,
  addMoney: 110,
  aed: 125,
  convert: 130,
  cards: 145,
  send: 140,
  investStocks: 130,
  investTokenized: 120,
  futures: 140,
  earn: 140,
  activity: 140,
  outro: 130,
} as const;

const FADE_FRAMES = 16;

/** Compute the total composition length the same way Remotion does:
 *  sum of all scene durations minus the overlap of every transition. */
export function totalDuration() {
  const sum = Object.values(SCENE_DURATIONS).reduce((a, b) => a + b, 0);
  const transitionCount = Object.keys(SCENE_DURATIONS).length - 1;
  return sum - transitionCount * FADE_FRAMES;
}

const fadeT = () =>
  fade();
const slideT = (
  direction:
    | "from-left"
    | "from-right"
    | "from-top"
    | "from-bottom" = "from-right"
) => slide({ direction });

const timing = linearTiming({ durationInFrames: FADE_FRAMES });
const springT = springTiming({
  config: { damping: 200 },
  durationInFrames: FADE_FRAMES,
});

export const BrnxJourney: React.FC = () => {
  const { durationInFrames, fps } = useVideoConfig();
  // 1s fade in + 1s fade out on BGM
  const audioFadeIn = 1 * fps;
  const audioFadeOut = 1 * fps;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0B1220" }}>
      {/* Background music — quiet enough to support voice-over or narration */}
      <Audio
        src={staticFile("Audio/BGM-MUSIC.mp3")}
        volume={(f) =>
          interpolate(
            f,
            [
              0,
              audioFadeIn,
              durationInFrames - audioFadeOut,
              durationInFrames,
            ],
            [0, 0.5, 0.5, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          )
        }
      />

      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.intro}>
          <Intro />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition presentation={fadeT()} timing={springT} />

        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.signin}>
          <Signin />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slideT("from-right")}
          timing={timing}
        />

        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.otp}>
          <Otp />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition presentation={fadeT()} timing={springT} />

        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.home}>
          <Home />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slideT("from-right")}
          timing={timing}
        />

        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.addMoney}>
          <AddMoney />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slideT("from-right")}
          timing={timing}
        />

        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.aed}>
          <AedOnramp />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition presentation={fadeT()} timing={springT} />

        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.convert}>
          <Convert />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition presentation={fadeT()} timing={springT} />

        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.cards}>
          <Cards />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slideT("from-right")}
          timing={timing}
        />

        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.send}>
          <Send />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition presentation={fadeT()} timing={springT} />

        <TransitionSeries.Sequence
          durationInFrames={SCENE_DURATIONS.investStocks}
        >
          <Invest
            filter="Stocks"
            index={9}
            eyebrow="Invest · Stocks"
            title="Buy US equities in fractions."
            description="Apple, NVIDIA, Microsoft, Tesla — fractional shares funded straight from your USD balance."
          />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slideT("from-right")}
          timing={timing}
        />

        <TransitionSeries.Sequence
          durationInFrames={SCENE_DURATIONS.investTokenized}
        >
          <Invest
            filter="xStocks"
            index={10}
            eyebrow="Invest · xStocks"
            title="Same stocks, settled in USDC."
            description="Tokenized equities via xStocks — held in your wallet, tradeable around the clock."
          />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slideT("from-right")}
          timing={timing}
        />

        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.futures}>
          <Futures />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition presentation={fadeT()} timing={springT} />

        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.earn}>
          <Earn />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition presentation={fadeT()} timing={springT} />

        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.activity}>
          <Activity />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition presentation={fadeT()} timing={springT} />

        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.outro}>
          <Outro />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
