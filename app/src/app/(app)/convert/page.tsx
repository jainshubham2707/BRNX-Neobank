"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TopBar } from "@/components/ui/TopBar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Sheet } from "@/components/ui/Sheet";
import { KeyValue } from "@/components/ui/KeyValue";
import { usePersona, useUser } from "@/lib/persona-store";
import { fmtUSD, fmtNum } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { Rail } from "@/lib/types";

const RATE_BASE = 0.99920; // 1 USD → ~0.9992 USDC after fee
const SPREAD = 0.0008;
const QUOTE_WINDOW_S = 12;

export default function ConvertPage() {
  const router = useRouter();
  const user = useUser();
  const { refresh } = usePersona();

  // Stablecoin-only users have no fiat rail to convert against.
  if (!user.productAccess.fiat) {
    if (typeof window !== "undefined") router.replace("/home");
    return null;
  }
  const usdAccount = user.usdAccount!;

  // Allow ?to=USD or ?to=USDC to preselect direction (used by Add Money links).
  const params = useSearchParams();
  const initialFrom: Rail =
    params?.get("to") === "USD" ? "USDC" : "USD";
  const [from, setFrom] = useState<Rail>(initialFrom);
  const to: Rail = from === "USD" ? "USDC" : "USD";

  const [amount, setAmount] = useState("500");
  const [confirming, setConfirming] = useState(false);
  const [quoteSecs, setQuoteSecs] = useState(QUOTE_WINDOW_S);
  const [stage, setStage] = useState<"idle" | "submitted" | "settling" | "done">("idle");

  const amountNum = Number(amount) || 0;
  const rate = from === "USD" ? RATE_BASE : 1 / RATE_BASE - SPREAD;
  const received = amountNum * rate;
  const fee = amountNum * SPREAD;

  const fromBalance =
    from === "USD" ? usdAccount.balance : user.usdcWallet.balance;
  const insufficient = amountNum > fromBalance;
  const valid = amountNum > 0 && !insufficient;

  // Quote countdown
  useEffect(() => {
    if (!confirming) return;
    setQuoteSecs(QUOTE_WINDOW_S);
    const i = window.setInterval(() => {
      setQuoteSecs((s) => {
        if (s <= 1) {
          window.clearInterval(i);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => window.clearInterval(i);
  }, [confirming, from, amount]);

  const swap = () => {
    setFrom((r) => (r === "USD" ? "USDC" : "USD"));
  };

  const runConvert = async () => {
    setStage("submitted");
    const res = await fetch("/api/convert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fromRail: from, amount: amountNum }),
    });
    if (!res.ok) {
      setStage("idle");
      return;
    }
    setStage("settling");
    await new Promise((r) => setTimeout(r, 800));
    setStage("done");
    await refresh();
  };

  const quoteExpired = confirming && quoteSecs === 0 && stage === "idle";

  return (
    <>
      <TopBar title="Convert" back />
      <div className="px-4 py-2 space-y-3">
        <Card>
          <RailRow
            label="From"
            rail={from}
            amount={amount}
            onAmount={setAmount}
            balance={fromBalance}
            editable
            autoFocus
          />
          <div className="relative my-2 flex items-center">
            <div className="flex-1 h-px bg-ink-100" />
            <button
              onClick={swap}
              aria-label="Swap"
              className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-200 text-brand-700 mx-2 inline-flex items-center justify-center shadow-soft hover:bg-brand-100"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M7 4v12m0 0l-3-3m3 3l3-3M17 20V8m0 0l-3 3m3-3l3 3"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <div className="flex-1 h-px bg-ink-100" />
          </div>
          <RailRow
            label="To"
            rail={to}
            amount={amountNum > 0 ? received.toFixed(2) : "0"}
            balance={to === "USD" ? usdAccount.balance : user.usdcWallet.balance}
            editable={false}
          />
        </Card>

        {/* Rate strip */}
        <div className="px-2 flex items-center justify-between text-[12.5px]">
          <div className="text-ink-500">
            <span className="font-mono tabular text-ink">
              1 {from}
            </span>
            <span className="mx-1.5">=</span>
            <span className="font-mono tabular text-ink">
              {rate.toFixed(5)} {to}
            </span>
          </div>
          <div className="text-ink-500 font-mono">
            spread {(SPREAD * 100).toFixed(2)}%
          </div>
        </div>

        {insufficient && (
          <div className="text-[12.5px] text-rose font-semibold px-2">
            Not enough {from} on this rail.
          </div>
        )}

        <Button
          onClick={() => setConfirming(true)}
          disabled={!valid}
          full
          size="lg"
        >
          Review convert
        </Button>

        <p className="text-[12px] text-ink-500 mt-2 px-2 leading-snug">
          We settle when the rail confirms — no fronted balance. The number
          you&apos;re quoted is the number you&apos;ll get.
        </p>
      </div>

      <Sheet
        open={confirming}
        onClose={() => {
          if (stage === "done") {
            setConfirming(false);
            router.push("/activity");
          } else if (stage === "idle") {
            setConfirming(false);
          }
        }}
        title={
          stage === "done"
            ? "Done"
            : stage === "submitted" || stage === "settling"
              ? "Settling"
              : `Confirm — quote locked ${quoteSecs}s`
        }
      >
        {stage === "idle" && (
          <>
            <div className="text-[12px] text-ink-500 font-mono tracking-wider uppercase">
              You convert
            </div>
            <div className="font-display font-extrabold text-[36px] tabular text-ink leading-none mt-1">
              {fmtNum(amountNum)} <span className="text-ink-500 text-[18px]">{from}</span>
            </div>

            <div className="text-[12px] text-ink-500 font-mono tracking-wider uppercase mt-5">
              You receive
            </div>
            <div className="font-display font-extrabold text-[36px] tabular text-ink leading-none mt-1">
              {fmtNum(received)} <span className="text-ink-500 text-[18px]">{to}</span>
            </div>

            <Card padded={false} className="px-4 mt-5">
              <KeyValue label="Rate" value={`1 ${from} = ${rate.toFixed(5)} ${to}`} mono />
              <KeyValue label="Spread fee" value={fmtUSD(fee)} mono />
              <KeyValue
                label="Settlement"
                value="On rail confirmation · ~30s"
              />
            </Card>

            <div className="grid grid-cols-2 gap-2 mt-5">
              <Button variant="ghost" full onClick={() => setConfirming(false)}>
                Edit
              </Button>
              <Button
                full
                onClick={runConvert}
                disabled={quoteExpired}
              >
                {quoteExpired ? "Refresh quote" : "Convert"}
              </Button>
            </div>
            {quoteExpired && (
              <p className="text-[12px] text-amber mt-2 font-semibold text-center">
                Quote expired — tap to refresh.
              </p>
            )}
          </>
        )}

        {(stage === "submitted" || stage === "settling") && (
          <SettlingView from={from} to={to} amount={amountNum} received={received} stage={stage} />
        )}

        {stage === "done" && (
          <DoneView from={from} to={to} received={received} />
        )}
      </Sheet>
    </>
  );
}

function RailRow({
  label,
  rail,
  amount,
  onAmount,
  balance,
  editable,
  autoFocus,
}: {
  label: string;
  rail: Rail; // shown as a unit suffix next to the amount
  amount: string;
  onAmount?: (v: string) => void;
  balance: number;
  editable: boolean;
  autoFocus?: boolean;
}) {
  return (
    <div className="py-3 px-1">
      <span className="text-[11.5px] uppercase tracking-wider text-ink-500 font-mono">
        {label}
      </span>
      <div className="flex items-baseline gap-2 mt-1">
        <input
          inputMode="decimal"
          autoFocus={autoFocus}
          readOnly={!editable}
          value={amount}
          onChange={(e) => {
            const v = e.target.value.replace(/[^\d.]/g, "");
            const parts = v.split(".");
            if (parts.length > 2) return;
            onAmount?.(v);
          }}
          className={cn(
            "font-display font-extrabold text-[40px] leading-none tabular tracking-tight",
            "bg-transparent outline-none flex-1 min-w-0",
            editable ? "text-ink" : "text-ink"
          )}
        />
        <span className="font-mono text-ink-500 text-[14px]">{rail}</span>
      </div>
      <div className="text-[12px] text-ink-500 mt-1.5">
        Balance: <span className="font-mono tabular">{fmtNum(balance)} {rail}</span>
      </div>
    </div>
  );
}

function SettlingView({
  from,
  to,
  amount,
  received,
  stage,
}: {
  from: Rail;
  to: Rail;
  amount: number;
  received: number;
  stage: "submitted" | "settling";
}) {
  return (
    <div className="py-2">
      <div className="flex items-center justify-center mt-2">
        <div className="w-16 h-16 rounded-full bg-brand-50 flex items-center justify-center">
          <svg width="36" height="36" viewBox="0 0 24 24" className="animate-spin text-brand">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.3" strokeWidth="3" fill="none" />
            <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
          </svg>
        </div>
      </div>
      <div className="font-display font-bold text-[20px] text-center mt-4 text-ink">
        {stage === "submitted" ? "Submitting" : "Settling on rail"}
      </div>
      <div className="text-[13.5px] text-ink-500 text-center mt-1 max-w-[280px] mx-auto">
        {stage === "submitted"
          ? `Locking ${fmtNum(amount)} ${from}…`
          : "Waiting for confirmation. We never front the balance — your number won't change."}
      </div>
      <div className="font-mono tabular text-center text-ink text-[14px] mt-4">
        {fmtNum(amount)} {from} → {fmtNum(received)} {to}
      </div>
    </div>
  );
}

function DoneView({
  from,
  to,
  received,
}: {
  from: Rail;
  to: Rail;
  received: number;
}) {
  return (
    <div className="py-2">
      <div className="flex items-center justify-center mt-2">
        <div className="w-16 h-16 rounded-full bg-emerald flex items-center justify-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path d="M5 12.5l4.5 4.5L19 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      <div className="font-display font-bold text-[22px] text-center mt-4 text-ink">
        {fmtNum(received)} {to} in your wallet
      </div>
      <div className="text-[13.5px] text-ink-500 text-center mt-1 max-w-[280px] mx-auto">
        Settled. The {from} leg cleared and {to} hit your rail.
      </div>
    </div>
  );
}
