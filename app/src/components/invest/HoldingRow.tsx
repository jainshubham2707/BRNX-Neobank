import Link from "next/link";
import type { Holding } from "@/lib/types";
import { InstrumentLogo } from "./InstrumentLogo";
import { findInstrument } from "@/lib/mock-data/instruments";
import { fmtUSD, fmtPct, fmtNum } from "@/lib/format";
import { cn } from "@/lib/cn";

/**
 * Holding row — clean three-column layout:
 *   logo │ symbol + name + units │ market value + PnL
 * No rail badges; the parent section already conveys the rail.
 */
export function HoldingRow({ holding }: { holding: Holding }) {
  const mkt = holding.quantity * holding.lastPrice;
  const cost = holding.quantity * holding.avgCost;
  const pnl = mkt - cost;
  const pnlPct = cost > 0 ? (pnl / cost) * 100 : 0;

  const inst = findInstrument(holding.symbol);
  const base = holding.symbol.replace(/x$/, "");

  return (
    <Link
      href={`/invest/${holding.symbol}`}
      className="flex items-center gap-3 px-3 py-3.5 border-b border-ink-100 last:border-0 active:bg-brand-50/40"
    >
      {inst ? (
        <InstrumentLogo instrument={inst} size={40} />
      ) : (
        <div
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center font-display font-bold text-white text-[11px]",
            holding.rail === "USDC" ? "bg-deep" : "bg-brand"
          )}
        >
          {base.slice(0, 3)}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="font-display font-semibold text-[15px] text-ink leading-tight truncate">
          {holding.symbol}
        </div>
        <div className="text-[12px] text-ink-500 mt-0.5 font-mono tabular">
          {fmtNum(holding.quantity, 2)} @ {fmtUSD(holding.avgCost)}
        </div>
      </div>
      <div className="text-right shrink-0">
        <div className="font-mono tabular text-[15px] font-semibold text-ink leading-tight">
          {fmtUSD(mkt)}
        </div>
        <div
          className={cn(
            "font-mono tabular text-[12px] mt-0.5",
            pnl > 0 ? "text-emerald" : pnl < 0 ? "text-rose" : "text-ink-500"
          )}
        >
          {pnl >= 0 ? "+" : "−"}
          {fmtUSD(Math.abs(pnl))} · {pnlPct >= 0 ? "+" : ""}
          {fmtPct(pnlPct)}
        </div>
      </div>
    </Link>
  );
}
