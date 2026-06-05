"use client";

import { useState } from "react";
import { Mark } from "@/components/brand/Mark";
import { fmtUSD } from "@/lib/format";
import { cn } from "@/lib/cn";

type Props = {
  totalUSD: number;
  fiatUSD: number | null;
  usdcUSD: number;
};

/**
 * Hero balance card.
 *  - Dual-rail users see the total at the top and a two-tile breakdown below.
 *  - Stablecoin-only users see the balance once (no breakdown — the total
 *    already equals the only rail).
 */
export function BalanceCard({ totalUSD, fiatUSD, usdcUSD }: Props) {
  const [expanded, setExpanded] = useState(false);
  const dual = fiatUSD !== null;
  return (
    <div className="relative mx-4 rounded-3xl bg-brand-deep text-white shadow-lift overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(380px 380px at 95% -10%, rgba(34,211,238,.32), transparent 60%), radial-gradient(420px 420px at 0% 110%, rgba(143,181,225,.18), transparent 60%)",
        }}
      />
      <div className="absolute -right-3 -top-3 opacity-15">
        <Mark size={180} knockout twoTone={false} />
      </div>

      <div className="relative px-5 pt-5 pb-5">
        <div className="flex items-center justify-between">
          <span className="text-[12px] text-brand-200 tracking-[0.18em] uppercase font-mono">
            {dual ? "Total balance" : "Balance"}
          </span>
        </div>
        <div className="font-display font-extrabold text-[44px] tabular leading-[1.04] mt-1.5">
          {fmtUSD(totalUSD)}
        </div>

        {dual && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="mt-4 grid grid-cols-2 gap-2.5 w-full text-left"
          >
            <RailTile label="USD" value={fmtUSD(fiatUSD!)} />
            <RailTile label="USDC" value={fmtUSD(usdcUSD)} />
          </button>
        )}

        {expanded && dual && (
          <div className="mt-3 rounded-xl bg-white/8 border border-white/15 px-3.5 py-2.5 text-[12px] text-brand-100 leading-snug">
            Both rails sit behind one balance. USDC is shown at $1.00 — we
            warn you if it drifts.
          </div>
        )}
      </div>
    </div>
  );
}

function RailTile({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className={cn("glass rounded-xl px-3.5 py-3")}>
      <div className="text-[11px] text-brand-200 uppercase tracking-wider">
        {label}
      </div>
      <div className="font-mono tabular font-semibold text-[17px] mt-1">
        {value}
      </div>
    </div>
  );
}
