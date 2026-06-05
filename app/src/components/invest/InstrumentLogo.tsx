"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { logoUrl, type Instrument } from "@/lib/mock-data/instruments";

type Props = {
  instrument: Pick<Instrument, "base" | "domain" | "brandColor">;
  size?: number;
  className?: string;
};

export function InstrumentLogo({ instrument, size = 40, className }: Props) {
  const [failed, setFailed] = useState(false);
  const initials = instrument.base.replace(/x$/, "").slice(0, 3);

  if (failed) {
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
        "rounded-xl bg-white border border-ink-100 flex items-center justify-center shrink-0 overflow-hidden",
        className
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logoUrl(instrument.domain)}
        alt=""
        aria-hidden
        onError={() => setFailed(true)}
        loading="lazy"
        style={{ width: size * 0.7, height: size * 0.7, objectFit: "contain" }}
      />
    </div>
  );
}
