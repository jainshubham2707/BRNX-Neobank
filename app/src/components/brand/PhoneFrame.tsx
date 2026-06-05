import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Show device chrome (notch, side buttons) on desktop. */
  chrome?: boolean;
};

/**
 * Mobile: fullscreen with safe-area top padding.
 *
 * Desktop (md+): renders inside a 390×844 phone bezel. The scrollable area
 * fills the inner rounded rect edge-to-edge, so each page can paint its
 * own background straight through to the top. The fake dynamic island is
 * an overlay at z-30; pages are responsible for clearing it with internal
 * top padding (TopBar bakes that in; full-bleed pages like /start use
 * `pt-12` or larger).
 */
export function PhoneFrame({ children, chrome = true }: Props) {
  return (
    <div className="outside-bg min-h-dvh w-full flex md:items-center md:justify-center">
      {/* Desktop / large screens: phone bezel */}
      <div className="hidden md:block">
        <div
          className={[
            "relative",
            "w-[390px] h-[844px]",
            "rounded-[52px]",
            "bg-black",
            "shadow-[0_60px_120px_-20px_rgba(0,0,0,0.7),0_30px_60px_-10px_rgba(7,90,189,0.25)]",
            chrome ? "p-[8px]" : "",
          ].join(" ")}
        >
          <div className="relative h-full w-full rounded-[44px] overflow-hidden">
            <div className="absolute inset-0 overflow-y-auto scrollbar-hide">
              {children}
            </div>
            {/* Dynamic island — float on top of whatever the page paints */}
            {chrome && (
              <div className="absolute z-30 top-0 left-0 right-0 h-11 flex items-end justify-center pb-1.5 pointer-events-none">
                <div className="h-7 w-28 bg-black rounded-full" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile: fullscreen, no fake bezel, respect device safe-area */}
      <div
        className="md:hidden w-full min-h-dvh"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        {children}
      </div>
    </div>
  );
}
