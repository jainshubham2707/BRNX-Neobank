import React from "react";
import { Composition } from "remotion";
import { BrnxJourney, totalDuration } from "./Composition";

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="BrnxJourney"
        component={BrnxJourney}
        durationInFrames={totalDuration()}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
