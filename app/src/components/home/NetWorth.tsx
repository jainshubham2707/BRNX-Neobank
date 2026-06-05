import { fmtUSD } from "@/lib/format";
import { Card } from "@/components/ui/Card";

type Props = {
  cashUSD: number;
  investUSD: number;
  earnUSD: number;
  futuresUSD: number;
};

// Brand-only palette running cleanly dark → light through the two blues.
const COLORS = {
  cash: "bg-deep-900",
  invest: "bg-brand",
  earn: "bg-brand-400",
  futures: "bg-brand-200",
} as const;

export function NetWorth({ cashUSD, investUSD, earnUSD, futuresUSD }: Props) {
  const total = cashUSD + investUSD + earnUSD + futuresUSD;
  const seg = (n: number) => (total > 0 ? (n / total) * 100 : 0);
  return (
    <Card className="mx-4">
      <div className="flex items-baseline justify-between">
        <span className="text-[12px] text-ink-500 tracking-wider uppercase font-mono">
          Net worth
        </span>
        <span className="font-display font-bold text-[22px] text-ink tabular">
          {fmtUSD(total)}
        </span>
      </div>

      {total > 0 && (
        <div className="flex h-2.5 rounded-full overflow-hidden mt-3 bg-ink-100">
          {cashUSD > 0 && <span className={COLORS.cash} style={{ width: `${seg(cashUSD)}%` }} />}
          {investUSD > 0 && <span className={COLORS.invest} style={{ width: `${seg(investUSD)}%` }} />}
          {earnUSD > 0 && <span className={COLORS.earn} style={{ width: `${seg(earnUSD)}%` }} />}
          {futuresUSD > 0 && <span className={COLORS.futures} style={{ width: `${seg(futuresUSD)}%` }} />}
        </div>
      )}

      <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 mt-3">
        <Legend color={COLORS.cash} label="Cash" value={cashUSD} />
        <Legend color={COLORS.invest} label="Invest" value={investUSD} />
        <Legend color={COLORS.earn} label="Earn" value={earnUSD} />
        <Legend color={COLORS.futures} label="Futures" value={futuresUSD} />
      </div>
    </Card>
  );
}

function Legend({ color, label, value }: { color: string; label: string; value: number }) {
  return (
    <div className="flex items-center gap-2 min-w-0">
      <span className={`w-2.5 h-2.5 rounded-full ${color} flex-none`} />
      <span className="text-[13px] text-ink-700 flex-1">{label}</span>
      <span className="font-mono tabular text-[13px] font-semibold text-ink">
        {fmtUSD(value)}
      </span>
    </div>
  );
}
