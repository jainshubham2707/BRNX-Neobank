"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { TopBar } from "@/components/ui/TopBar";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { Chip } from "@/components/ui/Chip";
import { RailBadge } from "@/components/ui/RailBadge";
import { HoldingRow } from "@/components/invest/HoldingRow";
import { InstrumentLogo } from "@/components/invest/InstrumentLogo";
import { FuturesView } from "@/components/futures/FuturesView";
import { useUser } from "@/lib/persona-store";
import { INSTRUMENTS } from "@/lib/mock-data/instruments";
import { fmtUSD, fmtPct } from "@/lib/format";
import { cn } from "@/lib/cn";

type Filter = "USD" | "USDC" | "futures";

export default function InvestPage() {
  const user = useUser();
  const hasFiat = user.productAccess.fiat;
  const [filter, setFilter] = useState<Filter>(hasFiat ? "USD" : "USDC");

  const summary = useMemo(() => {
    const mkt = user.holdings.reduce(
      (s, h) => s + h.quantity * h.lastPrice,
      0
    );
    const cost = user.holdings.reduce((s, h) => s + h.quantity * h.avgCost, 0);
    const pnl = mkt - cost;
    const pnlPct = cost > 0 ? (pnl / cost) * 100 : 0;
    return { mkt, cost, pnl, pnlPct };
  }, [user.holdings]);

  const showSuitabilityNote = user.kycTier !== "enhanced";

  const tabs: { key: Filter; label: string; aria: string }[] = [
    ...(hasFiat
      ? [{ key: "USD" as const, label: "Stocks", aria: "Stocks" }]
      : []),
    { key: "USDC", label: "xStocks", aria: "xStocks" },
    { key: "futures", label: "Futures", aria: "Futures" },
  ];

  return (
    <>
      <TopBar title="Invest" back="/home" />
      <div className="px-4 space-y-4">
        {filter !== "futures" && (
          <Card className="bg-brand-deep text-white border-0">
            <div className="text-[11.5px] uppercase tracking-wider text-brand-200 font-mono">
              Portfolio
            </div>
            <div className="font-display font-extrabold text-[36px] tabular mt-0.5 leading-tight">
              {fmtUSD(summary.mkt)}
            </div>
            <div className="flex items-center gap-3 mt-1">
              <span
                className={cn(
                  "font-mono tabular text-[14px]",
                  summary.pnl >= 0 ? "text-emerald" : "text-rose"
                )}
              >
                {summary.pnl >= 0 ? "+" : "−"}
                {fmtUSD(Math.abs(summary.pnl))}
              </span>
              <span className="text-brand-100/80 font-mono text-[12.5px]">
                {summary.pnlPct >= 0 ? "+" : ""}
                {fmtPct(summary.pnlPct)} all-time
              </span>
            </div>
          </Card>
        )}

        {showSuitabilityNote && filter !== "futures" && (
          <Card className="bg-amber/5 border-amber/30">
            <div className="font-display font-semibold text-amber text-[14px]">
              One step to start investing
            </div>
            <p className="text-[13px] text-ink-700 mt-1 leading-snug">
              Complete the appropriateness questionnaire (~2 min). Required for
              securities trading.
            </p>
            <Link
              href="/profile"
              className="inline-flex items-center mt-2 font-display font-semibold text-[13px] text-amber"
            >
              Take it now →
            </Link>
          </Card>
        )}

        {/* Filter chips */}
        <div className="flex gap-2">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setFilter(t.key)}
              className={cn(
                "px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition-colors",
                filter === t.key
                  ? "bg-ink text-white"
                  : "bg-white text-ink-700 border border-ink-100"
              )}
              aria-label={t.aria}
            >
              {t.label}
            </button>
          ))}
        </div>

        {filter === "futures" ? (
          <FuturesView />
        ) : (
          <>
            <Section title="Your holdings" className="px-0">
              <Card padded={false}>
                {user.holdings.filter((h) => h.rail === filter).length === 0 ? (
                  <div className="px-4 py-6 text-center text-ink-500 text-[14px]">
                    Nothing here yet. Browse the catalog below.
                  </div>
                ) : (
                  user.holdings
                    .filter((h) => h.rail === filter)
                    .map((h) => <HoldingRow key={h.id} holding={h} />)
                )}
              </Card>
            </Section>

            <Section title="Browse" className="px-0">
              <Card padded={false}>
                {INSTRUMENTS.filter((i) => i.rail === filter).map((i) => (
                  <Link
                    key={i.symbol}
                    href={`/invest/${i.symbol}`}
                    className="flex items-center gap-3 px-3 py-3 border-b border-ink-100 last:border-0 active:bg-brand-50/40"
                  >
                    <InstrumentLogo instrument={i} />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-[14.5px] text-ink">
                        {i.symbol}
                      </div>
                      <div className="text-[12px] text-ink-500 truncate">
                        {i.name}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-mono tabular text-[14px] font-semibold text-ink">
                        {fmtUSD(i.price)}
                      </div>
                      <div
                        className={cn(
                          "font-mono tabular text-[12px] mt-0.5",
                          i.changePct > 0
                            ? "text-emerald"
                            : i.changePct < 0
                              ? "text-rose"
                              : "text-ink-500"
                        )}
                      >
                        {i.changePct > 0 ? "+" : ""}
                        {fmtPct(i.changePct)}
                      </div>
                    </div>
                  </Link>
                ))}
              </Card>
            </Section>
          </>
        )}

        <div className="h-6" />
      </div>
    </>
  );
}
