"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TopBar } from "@/components/ui/TopBar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Sheet } from "@/components/ui/Sheet";
import { AmountInput } from "@/components/ui/AmountInput";
import { KeyValue } from "@/components/ui/KeyValue";
import { usePersona, useUser } from "@/lib/persona-store";
import { fmtUSD } from "@/lib/format";

export default function SwiftPage() {
  const user = useUser();
  const router = useRouter();
  const { refresh } = usePersona();
  const [copied, setCopied] = useState<string | null>(null);
  const [simOpen, setSimOpen] = useState(false);
  const [simAmount, setSimAmount] = useState("5000");
  const [simBusy, setSimBusy] = useState(false);

  useEffect(() => {
    if (!user.usdAccount) router.replace("/add-money/usdc");
  }, [user.usdAccount, router]);

  if (!user.usdAccount) return null;

  const copy = async (v: string, key: string) => {
    try {
      await navigator.clipboard.writeText(v);
      setCopied(key);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      /* ignore */
    }
  };

  const simulateInbound = async () => {
    const num = Number(simAmount) || 0;
    if (num <= 0 || simBusy) return;
    setSimBusy(true);
    const r = await fetch("/api/add-money", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source: "swift", amount: num }),
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
      <TopBar title="SWIFT" back />
      <div className="px-4 py-2 space-y-4">
        <p className="text-[14px] text-ink-700 leading-relaxed">
          Wire USD from any bank. Funds land in your USD account — we use a
          virtual IBAN so it&apos;s attributed to you cleanly.
        </p>

        <Card className="p-0">
          <CopyRow
            label="Beneficiary"
            value={user.name}
            onCopy={(v) => copy(v, "name")}
            copied={copied === "name"}
          />
          <CopyRow
            label="IBAN"
            value={user.usdAccount.virtualIban}
            mono
            onCopy={(v) => copy(v, "iban")}
            copied={copied === "iban"}
          />
          <CopyRow
            label="SWIFT / BIC"
            value={user.usdAccount.swiftCode}
            mono
            onCopy={(v) => copy(v, "swift")}
            copied={copied === "swift"}
          />
          <CopyRow
            label="Bank"
            value={user.usdAccount.bankName}
            onCopy={(v) => copy(v, "bank")}
            copied={copied === "bank"}
          />
          <div className="px-4 py-3">
            <KeyValue label="Currency" value="USD" />
            <KeyValue label="Reference (optional)" value="Auto-attributed" />
          </div>
        </Card>

        <Card className="bg-amber/5 border-amber/20">
          <div className="font-display font-semibold text-amber text-[14px]">
            Settlement timing
          </div>
          <p className="text-[13px] text-ink-700 mt-1 leading-snug">
            SWIFT typically takes 1–2 business days. We&apos;ll show a{" "}
            <span className="font-semibold">Pending → Settled</span> trail in
            Activity once the wire is received.
          </p>
        </Card>

        <div className="grid grid-cols-2 gap-2">
          <Button variant="ghost" full size="lg">
            Share details
          </Button>
          <Button full size="lg" onClick={() => setSimOpen(true)}>
            Simulate inbound
          </Button>
        </div>
      </div>

      <Sheet
        open={simOpen}
        onClose={() => setSimOpen(false)}
        title="Simulate SWIFT credit"
      >
        <p className="text-[13px] text-ink-500 leading-snug">
          Credits your USD balance as if the wire just settled.
        </p>
        <div className="mt-4">
          <div className="text-[11.5px] uppercase tracking-wider text-ink-500 font-mono">
            Amount
          </div>
          <AmountInput value={simAmount} onChange={setSimAmount} autoFocus />
        </div>
        <Card padded={false} className="px-4 mt-4">
          <KeyValue label="To" value="USD account" />
          <KeyValue
            label="Current balance"
            value={fmtUSD(user.usdAccount.balance)}
            mono
          />
        </Card>
        <Button
          full
          size="lg"
          className="mt-4"
          onClick={simulateInbound}
          disabled={simBusy || Number(simAmount) <= 0}
        >
          {simBusy ? "Crediting…" : "Credit USD"}
        </Button>
      </Sheet>
    </>
  );
}

function CopyRow({
  label,
  value,
  mono,
  onCopy,
  copied,
}: {
  label: string;
  value: string;
  mono?: boolean;
  onCopy: (v: string) => void;
  copied?: boolean;
}) {
  return (
    <button
      onClick={() => onCopy(value)}
      className="w-full flex items-center justify-between gap-3 px-4 py-3.5 border-b border-ink-100 last:border-0 text-left active:bg-brand-50/40"
    >
      <div className="min-w-0">
        <div className="text-[11.5px] uppercase tracking-wider text-ink-500 font-mono">
          {label}
        </div>
        <div
          className={`text-[14.5px] text-ink mt-0.5 truncate ${mono ? "font-mono tabular" : "font-semibold"}`}
        >
          {value}
        </div>
      </div>
      <span className="text-[12px] font-semibold text-brand-700">
        {copied ? "Copied" : "Copy"}
      </span>
    </button>
  );
}
