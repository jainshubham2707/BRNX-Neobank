"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TopBar } from "@/components/ui/TopBar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { AmountInput } from "@/components/ui/AmountInput";
import { KeyValue } from "@/components/ui/KeyValue";
import { usePersona } from "@/lib/persona-store";
import { fmtAED, fmtNum } from "@/lib/format";

const RATE = 3.6725; // AED per USD
const SPREAD = 0.0035; // 0.35%

export default function AedPage() {
  const [aed, setAed] = useState("1000");
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const { refresh } = usePersona();

  const aedNum = Number(aed) || 0;
  const grossUsd = aedNum / RATE;
  const fee = grossUsd * SPREAD;
  const netUsdc = grossUsd - fee; // AED → USDC (1 USDC ≈ $1)

  const submit = async () => {
    if (aedNum < 50 || busy) return;
    setBusy(true);
    const r = await fetch("/api/add-money", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "aed-onramp",
        amount: Number(netUsdc.toFixed(2)),
        aedAmount: aedNum,
        aedRate: RATE,
        destination: "USDC",
      }),
    });
    setBusy(false);
    if (r.ok) {
      await refresh();
      router.push("/home");
    }
  };

  return (
    <>
      <TopBar title="AED → USDC" back />
      <div className="px-5 py-4 space-y-5">
        <div>
          <div className="text-[11.5px] uppercase tracking-wider text-ink-500 font-mono">
            You pay
          </div>
          <AmountInput
            value={aed}
            onChange={setAed}
            symbol="AED"
            className="mt-1"
            autoFocus
          />
          <div className="text-[12px] text-ink-500 mt-1">
            From your AED bank account or card
          </div>
        </div>

        <div className="self-center w-9 h-9 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center mx-auto">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 5v14M6 13l6 6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div>
          <div className="text-[11.5px] uppercase tracking-wider text-ink-500 font-mono">
            You get
          </div>
          <div className="font-display font-extrabold text-[44px] tabular leading-none mt-1 text-ink">
            {fmtNum(netUsdc)} <span className="text-[20px] text-ink-500">USDC</span>
          </div>
          <div className="text-[12px] text-ink-500 mt-1">
            Credited to your wallet
          </div>
        </div>

        <Card padded={false} className="px-4">
          <KeyValue label="Rate" value={`1 USD = ${RATE.toFixed(4)} AED`} mono />
          <KeyValue label="Spread" value={`${(SPREAD * 100).toFixed(2)}%`} mono />
          <KeyValue label="Fee" value={`${fee.toFixed(2)} USDC`} mono />
          <KeyValue label="ETA" value="Under 5 minutes" />
        </Card>

        <Button
          onClick={submit}
          size="lg"
          full
          disabled={aedNum < 50 || busy}
        >
          {busy ? "Onramping…" : `Onramp ${fmtAED(aedNum)}`}
        </Button>
      </div>
    </>
  );
}
