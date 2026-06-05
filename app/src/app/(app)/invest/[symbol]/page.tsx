"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter, notFound } from "next/navigation";
import { TopBar } from "@/components/ui/TopBar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Sheet } from "@/components/ui/Sheet";
import { AmountInput } from "@/components/ui/AmountInput";
import { KeyValue } from "@/components/ui/KeyValue";
import { findInstrument } from "@/lib/mock-data/instruments";
import { InstrumentLogo } from "@/components/invest/InstrumentLogo";
import { usePersona, useUser } from "@/lib/persona-store";
import { fmtUSD, fmtPct, fmtNum } from "@/lib/format";
import { cn } from "@/lib/cn";

export default function InstrumentPage() {
  const { symbol } = useParams<{ symbol: string }>();
  const inst = findInstrument(symbol);
  const router = useRouter();
  const user = useUser();
  const { refresh } = usePersona();
  const [busy, setBusy] = useState(false);

  if (!inst) return notFound();

  const holding = user.holdings.find((h) => h.symbol === inst.symbol);
  const [tradeOpen, setTradeOpen] = useState(false);
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState("250");

  const railBalance =
    inst.rail === "USD"
      ? (user.usdAccount?.balance ?? 0)
      : user.usdcWallet.balance;

  // Stablecoin-only users shouldn't see fiat-rail instruments.
  if (inst.rail === "USD" && !user.productAccess.fiat) {
    if (typeof window !== "undefined") router.replace("/invest");
    return null;
  }

  const amountNum = Number(amount) || 0;
  const qty = inst.price > 0 ? amountNum / inst.price : 0;
  const insufficient = side === "buy" && amountNum > railBalance;

  const submit = async () => {
    if (busy) return;
    setBusy(true);
    const r = await fetch("/api/trade", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        symbol: inst.symbol,
        side,
        amount: amountNum,
      }),
    });
    setBusy(false);
    if (r.ok) {
      await refresh();
      setTradeOpen(false);
      router.push("/activity");
    }
  };

  // Mock spark line
  const sparkPts = useMemo(() => mockSpark(inst.symbol, inst.changePct), [inst.symbol, inst.changePct]);

  return (
    <>
      <TopBar title={inst.symbol} back />
      <div className="px-4 space-y-4">
        <Card>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">
              <InstrumentLogo instrument={inst} size={48} />
              <div className="min-w-0">
                <div className="text-[14px] text-ink-500 truncate">{inst.name}</div>
                <div className="font-display font-extrabold text-[34px] tabular mt-0.5 leading-none text-ink">
                  {fmtUSD(inst.price)}
                </div>
                <div
                  className={cn(
                    "font-mono tabular text-[13px] mt-1",
                    inst.changePct > 0 ? "text-emerald" : inst.changePct < 0 ? "text-rose" : "text-ink-500"
                  )}
                >
                  {inst.changePct > 0 ? "+" : ""}
                  {fmtPct(inst.changePct)} today
                </div>
              </div>
            </div>
          </div>

          {/* Mock spark line */}
          <svg viewBox="0 0 200 60" className="w-full h-24 mt-2">
            <polyline
              points={sparkPts}
              fill="none"
              stroke={inst.changePct >= 0 ? "#059669" : "#DC2626"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Card>

        {holding && (
          <Card>
            <div className="text-[11.5px] uppercase tracking-wider text-ink-500 font-mono">
              Your position
            </div>
            <div className="grid grid-cols-3 gap-2 mt-2">
              <Stat label="Quantity" value={fmtNum(holding.quantity, 2)} mono />
              <Stat label="Avg cost" value={fmtUSD(holding.avgCost)} mono />
              <Stat
                label="Market"
                value={fmtUSD(holding.quantity * holding.lastPrice)}
                mono
              />
            </div>
          </Card>
        )}

        <Card>
          <div className="font-display font-semibold text-[14px] text-ink">
            How this trades
          </div>
          <p className="text-[13px] text-ink-500 mt-1 leading-snug">
            {inst.rail === "USD"
              ? "Fractional shares via our brokerage partner. Settles T+1, available in your portfolio immediately."
              : "Tokenized exposure settled in USDC. xStocks are tokenized real-world securities — yours to hold or trade."}
          </p>
        </Card>

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="ghost"
            full
            onClick={() => {
              setSide("sell");
              setTradeOpen(true);
            }}
            disabled={!holding}
          >
            Sell
          </Button>
          <Button
            full
            onClick={() => {
              setSide("buy");
              setTradeOpen(true);
            }}
          >
            Buy
          </Button>
        </div>

        <div className="h-6" />
      </div>

      <Sheet
        open={tradeOpen}
        onClose={() => setTradeOpen(false)}
        title={`${side === "buy" ? "Buy" : "Sell"} ${inst.symbol}`}
      >
        <div>
          <div className="text-[11.5px] uppercase tracking-wider text-ink-500 font-mono">
            Amount
          </div>
          <AmountInput value={amount} onChange={setAmount} />
          <div className="text-[12px] text-ink-500 mt-1">
            ≈ {fmtNum(qty, 4)} {inst.kind === "equity" ? "shares" : "tokens"}{" "}
            @ {fmtUSD(inst.price)}
          </div>
          <div className="text-[12px] text-ink-500 mt-1">
            Funded from {inst.rail === "USD" ? "USD account" : "USDC wallet"}{" "}
            ({fmtUSD(railBalance)} available)
          </div>
        </div>

        <Card padded={false} className="px-4 mt-4">
          <KeyValue label="Order" value={`${side === "buy" ? "Buy" : "Sell"} market`} />
          <KeyValue label="Fee" value="$0.00" mono />
        </Card>

        {insufficient && (
          <p className="text-rose text-[13px] font-semibold mt-3">
            Not enough {inst.rail}. Convert from the other rail first.
          </p>
        )}

        <Button
          full
          size="lg"
          className="mt-4"
          onClick={submit}
          disabled={insufficient || amountNum <= 0}
        >
          {side === "buy" ? "Place buy" : "Place sell"}
        </Button>
      </Sheet>
    </>
  );
}

function Stat({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wider text-ink-500 font-mono">{label}</div>
      <div className={cn("text-[14px] text-ink font-semibold mt-0.5", mono && "font-mono tabular")}>
        {value}
      </div>
    </div>
  );
}

function mockSpark(symbol: string, changePct: number): string {
  // deterministic pseudo-random walk biased by today's change
  let seed = 0;
  for (let i = 0; i < symbol.length; i++) seed = (seed * 31 + symbol.charCodeAt(i)) % 1024;
  const r = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  const W = 200,
    H = 60,
    N = 32;
  const pts: string[] = [];
  let y = H / 2;
  for (let i = 0; i < N; i++) {
    y += (r() - 0.48) * 4 + changePct * 0.04;
    y = Math.max(8, Math.min(H - 8, y));
    pts.push(`${(i / (N - 1)) * W},${H - y}`);
  }
  return pts.join(" ");
}
