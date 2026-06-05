"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TopBar } from "@/components/ui/TopBar";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { Button } from "@/components/ui/Button";
import { Sheet } from "@/components/ui/Sheet";
import { AmountInput } from "@/components/ui/AmountInput";
import { KeyValue } from "@/components/ui/KeyValue";
import { usePersona, useUser } from "@/lib/persona-store";
import { fmtNum, shortHash } from "@/lib/format";

export default function UsdcPage() {
  const user = useUser();
  const router = useRouter();
  const { refresh } = usePersona();
  const [copied, setCopied] = useState(false);
  const [simOpen, setSimOpen] = useState(false);
  const [simAmount, setSimAmount] = useState("1000");
  const [simBusy, setSimBusy] = useState(false);
  const address = user.usdcWallet.address;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

  const simulateDeposit = async () => {
    const num = Number(simAmount) || 0;
    if (num <= 0 || simBusy) return;
    setSimBusy(true);
    const r = await fetch("/api/add-money", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source: "usdc-deposit", amount: num }),
    });
    setSimBusy(false);
    if (r.ok) {
      await refresh();
      setSimOpen(false);
      router.push("/home");
    }
  };

  return (
    <>
      <TopBar title="USDC transfer" back />
      <div className="px-4 py-2 space-y-4">
        <Card className="bg-amber/5 border-amber/30 px-4">
          <div className="flex items-center gap-2">
            <span className="text-amber">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 9v4m0 4h.01M10.3 4.2L2.7 18a2 2 0 0 0 1.7 3h15.2a2 2 0 0 0 1.7-3L13.7 4.2a2 2 0 0 0-3.4 0z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="font-display font-semibold text-amber text-[14px]">
              USDC only
            </span>
          </div>
          <p className="text-[13px] text-ink-700 mt-1 leading-snug">
            Send <span className="font-semibold">USDC</span> to this address.
            Other tokens may be lost.
          </p>
        </Card>

        <Card className="text-center">
          <div className="mx-auto w-44 h-44 bg-canvas rounded-2xl border border-ink-100 p-2">
            {/* Fake QR */}
            <div
              className="w-full h-full rounded-md"
              style={{
                backgroundImage:
                  "radial-gradient(#0B1220 22%, transparent 22%), radial-gradient(#0B1220 22%, transparent 22%)",
                backgroundSize: "10px 10px",
                backgroundPosition: "0 0, 5px 5px",
              }}
              aria-label="QR code (placeholder)"
            />
          </div>

          <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
            <Chip variant="brand">USDC</Chip>
          </div>

          <div className="font-mono tabular text-[12.5px] text-ink mt-3 break-all px-2">
            {address}
          </div>
          <div className="text-[11.5px] text-ink-500 mt-1">
            {shortHash(address)}
          </div>

          <div className="flex gap-2 mt-4">
            <Button variant="ghost" full onClick={copy}>
              {copied ? "Copied" : "Copy address"}
            </Button>
            <Button variant="subtle" full>
              Share
            </Button>
          </div>
        </Card>

        <Card className="px-4">
          <div className="font-display font-semibold text-[14px] text-ink">
            How fast does it credit?
          </div>
          <p className="text-[13px] text-ink-500 mt-1 leading-snug">
            We auto-credit once the transfer confirms — usually under 30
            seconds. You&apos;ll see a settling state in Activity until then.
          </p>
        </Card>

        <Button full size="lg" onClick={() => setSimOpen(true)}>
          Simulate inbound
        </Button>
      </div>

      <Sheet
        open={simOpen}
        onClose={() => setSimOpen(false)}
        title="Simulate USDC inbound"
      >
        <p className="text-[13px] text-ink-500 leading-snug">
          Credits your USDC wallet as if a transfer just confirmed.
        </p>
        <div className="mt-4">
          <div className="text-[11.5px] uppercase tracking-wider text-ink-500 font-mono">
            Amount
          </div>
          <AmountInput value={simAmount} onChange={setSimAmount} symbol="USDC" autoFocus />
        </div>
        <Card padded={false} className="px-4 mt-4">
          <KeyValue label="To" value="USDC wallet" />
          <KeyValue
            label="Current balance"
            value={`${fmtNum(user.usdcWallet.balance)} USDC`}
            mono
          />
        </Card>
        <Button
          full
          size="lg"
          className="mt-4"
          onClick={simulateDeposit}
          disabled={simBusy || Number(simAmount) <= 0}
        >
          {simBusy ? "Crediting…" : "Credit USDC"}
        </Button>
      </Sheet>
    </>
  );
}
