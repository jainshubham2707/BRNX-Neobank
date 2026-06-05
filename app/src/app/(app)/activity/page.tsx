"use client";

import { useMemo, useState } from "react";
import { TopBar } from "@/components/ui/TopBar";
import { Card } from "@/components/ui/Card";
import { TxRow } from "@/components/ui/TxRow";
import { usePersona, useUser } from "@/lib/persona-store";
import type { TxCategory } from "@/lib/types";
import { cn } from "@/lib/cn";

const CATEGORIES: { key: TxCategory | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "load", label: "Load" },
  { key: "spend", label: "Spend" },
  { key: "convert", label: "Convert" },
  { key: "invest", label: "Invest" },
  { key: "earn", label: "Earn" },
  { key: "futures", label: "Futures" },
];

type RailFilter = "all" | "USD" | "USDC";

export default function ActivityPage() {
  const user = useUser();
  const { transactions } = usePersona();
  const [cat, setCat] = useState<TxCategory | "all">("all");
  const [railFilter, setRailFilter] = useState<RailFilter>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      if (cat !== "all" && t.category !== cat) return false;
      if (railFilter !== "all" && t.rail !== railFilter && t.rail !== "mixed")
        return false;
      if (query) {
        const q = query.toLowerCase();
        const hay = [
          t.title,
          t.subtitle ?? "",
          t.meta?.merchant ?? "",
          t.meta?.bankRef ?? "",
          t.meta?.txHash ?? "",
          t.amount.toString(),
        ]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [transactions, cat, railFilter, query]);

  // Group by date label
  const groups = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    for (const t of filtered) {
      const d = new Date(t.timestamp);
      const today = new Date();
      const sameDay = d.toDateString() === today.toDateString();
      const yesterday = new Date(Date.now() - 86_400_000);
      const isYesterday = d.toDateString() === yesterday.toDateString();
      const label = sameDay
        ? "Today"
        : isYesterday
          ? "Yesterday"
          : d.toLocaleDateString("en-US", { month: "long", day: "numeric" });
      const arr = map.get(label) ?? [];
      arr.push(t);
      map.set(label, arr);
    }
    return Array.from(map.entries());
  }, [filtered]);

  const showRailFilter = user.productAccess.fiat;

  return (
    <>
      <TopBar title="Activity" />
      <div className="px-4 space-y-3">
        {/* Search */}
        <div className="relative">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500"
          >
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="M20 20l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search merchant, reference, amount"
            className="w-full h-11 pl-9 pr-3 rounded-2xl bg-white border border-ink-100 text-[14px] outline-none focus:border-brand"
          />
        </div>

        {/* Category chips */}
        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide -mx-4 px-4">
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              onClick={() => setCat(c.key)}
              className={cn(
                "shrink-0 px-3 py-1.5 rounded-full text-[12px] font-semibold transition-colors",
                cat === c.key
                  ? "bg-ink text-white"
                  : "bg-white text-ink-700 border border-ink-100"
              )}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Rail filter for dual-rail users only */}
        {showRailFilter && (
          <div className="flex gap-1.5">
            {(["all", "USD", "USDC"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRailFilter(r)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-[11px] font-mono uppercase tracking-wider transition-colors",
                  railFilter === r
                    ? "bg-brand text-white"
                    : "bg-white text-ink-700 border border-ink-100"
                )}
              >
                {r === "all" ? "All rails" : r}
              </button>
            ))}
          </div>
        )}

        {groups.length === 0 ? (
          <Card className="text-center text-ink-500 text-[14px] py-8">
            No activity matches your filters.
          </Card>
        ) : (
          groups.map(([label, txs]) => (
            <section key={label}>
              <h2 className="text-[11px] font-mono uppercase tracking-widest text-ink-500 px-1 mt-3 mb-1.5">
                {label}
              </h2>
              <Card padded={false} className="px-2">
                {txs.map((t) => (
                  <TxRow key={t.id} tx={t} href={`/activity/${t.id}`} />
                ))}
              </Card>
            </section>
          ))
        )}

        <div className="h-6" />
      </div>
    </>
  );
}
