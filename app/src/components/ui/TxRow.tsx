import Link from "next/link";
import type { Transaction } from "@/lib/types";
import { Money } from "./Money";
import { StatusPill } from "./StatusPill";
import { relativeTime } from "@/lib/format";
import { cn } from "@/lib/cn";

const iconChar: Record<Transaction["category"], string> = {
  load: "L",
  spend: "S",
  invest: "I",
  earn: "E",
  convert: "C",
  futures: "F",
};

const iconBg: Record<Transaction["category"], string> = {
  load: "bg-brand",
  spend: "bg-ink-800",
  invest: "bg-deep",
  earn: "bg-emerald",
  convert: "bg-brand-600",
  futures: "bg-rose",
};

export function TxRow({
  tx,
  href,
  showStatus = true,
}: {
  tx: Transaction;
  href?: string;
  showStatus?: boolean;
}) {
  const signed = tx.direction === "in" ? tx.amount : -tx.amount;
  const className = cn(
    "flex items-center gap-3 px-1 py-3",
    href && "active:bg-ink-100/60 rounded-xl transition-colors"
  );
  const body = (
    <>
      <div
        className={cn(
          "w-10 h-10 rounded-xl flex-none flex items-center justify-center font-display font-bold text-white text-sm",
          iconBg[tx.category]
        )}
      >
        {iconChar[tx.category]}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <div className="font-semibold text-[14.5px] text-ink truncate">
            {tx.title}
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-ink-500 mt-0.5">
          <span className="truncate">{tx.subtitle ?? relativeTime(tx.timestamp)}</span>
          {showStatus && tx.status !== "settled" && (
            <StatusPill status={tx.status} className="text-[10px] py-0.5" />
          )}
        </div>
      </div>
      <div className="text-right shrink-0">
        <Money
          value={signed}
          sign
          className={cn(
            "text-[14.5px]",
            tx.direction === "in" ? "text-emerald" : "text-ink"
          )}
        />
        <div className="text-[11px] text-ink-500 mt-0.5">
          {relativeTime(tx.timestamp)}
        </div>
      </div>
    </>
  );
  if (href) {
    return (
      <Link href={href} className={className}>
        {body}
      </Link>
    );
  }
  return <div className={className}>{body}</div>;
}
