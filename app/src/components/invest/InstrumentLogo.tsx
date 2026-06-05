"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import {
  assetLogo,
  logoUrl,
  type Instrument,
} from "@/lib/mock-data/instruments";

type Props = {
  instrument: Pick<Instrument, "base" | "domain" | "brandColor">;
  size?: number;
  className?: string;
};

/**
 * Render order:
 *  1. local /public/logos/<SYMBOL>.png if we ship one (assetLogo)
 *  2. Clearbit logo fetched from the brand domain
 *  3. Colored monogram tile (offline-safe fallback)
 */
export function InstrumentLogo({ instrument, size = 40, className }: Props) {
  const initials = instrument.base.replace(/x$/, "").slice(0, 3);
  const local = assetLogo(instrument.base);
  const remote = logoUrl(instrument.domain);

  const [src, setSrc] = useState<string | null>(local ?? remote);
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        style={{
          width: size,
          height: size,
          backgroundColor: instrument.brandColor,
        }}
        className={cn(
          "rounded-xl flex items-center justify-center text-white font-display font-bold text-[11px] tracking-tight shrink-0",
          className
        )}
      >
        {initials}
      </div>
    );
  }

  return (
    <div
      style={{ width: size, height: size }}
      className={cn(
        "rounded-xl bg-surface border border-ink-100 flex items-center justify-center shrink-0 overflow-hidden",
        className
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        aria-hidden
        onError={() => {
          // If the local logo somehow failed, try Clearbit before giving up.
          if (src === local && remote) {
            setSrc(remote);
          } else {
            setFailed(true);
          }
        }}
        loading="lazy"
        style={{ width: size * 0.72, height: size * 0.72, objectFit: "contain" }}
      />
    </div>
  );
}
