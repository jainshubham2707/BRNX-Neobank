"use client";

import { useState } from "react";
import { TopBar } from "@/components/ui/TopBar";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Sheet } from "@/components/ui/Sheet";
import { AmountInput } from "@/components/ui/AmountInput";
import { KeyValue } from "@/components/ui/KeyValue";
import { usePersona, useUser } from "@/lib/persona-store";
import { EARN_PRODUCTS } from "@/lib/mock-data/earn-products";
import type { EarnPosition, EarnProduct, RiskTier } from "@/lib/types";
import { fmtUSD, fmtPct } from "@/lib/format";
import { cn } from "@/lib/cn";

const RISK_LABEL: Record<RiskTier, string> = {
  low: "Low risk",
  medium: "Medium risk",
  high: "High risk",
};

const RISK_VARIANT: Record<RiskTier, "earn" | "warn" | "fail"> = {
  low: "earn",
  medium: "warn",
  high: "fail",
};

export default function EarnPage() {
  const user = useUser();
  const { refresh } = usePersona();
  const [selected, setSelected] = useState<EarnProduct | null>(null);
  const [amount, setAmount] = useState("500");
  const [ack, setAck] = useState(false);
  const [busy, setBusy] = useState(false);
  const [managed, setManaged] = useState<EarnPosition | null>(null);
  const [manageMode, setManageMode] = useState<"add" | "withdraw">("add");
  const [manageAmount, setManageAmount] = useState("100");
  const [manageBusy, setManageBusy] = useState(false);

  const products = EARN_PRODUCTS.filter(
    (p) => p.rail !== "USD" || user.productAccess.fiat
  );

  const totalPrincipal = user.earnPositions.reduce(
    (s, p) => s + p.principal,
    0
  );
  const totalAccrued = user.earnPositions.reduce((s, p) => s + p.accrued, 0);

  const railBalance = (rail: "USD" | "USDC") =>
    rail === "USD"
      ? (user.usdAccount?.balance ?? 0)
      : user.usdcWallet.balance;

  const submit = async () => {
    if (!selected || busy) return;
    const num = Number(amount) || 0;
    if (num <= 0) return;
    setBusy(true);
    const r = await fetch("/api/earn", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: selected.id, amount: num }),
    });
    setBusy(false);
    if (r.ok) {
      await refresh();
      setSelected(null);
      setAck(false);
    }
  };

  const manageSubmit = async () => {
    if (!managed || manageBusy) return;
    const num = Number(manageAmount) || 0;
    if (num <= 0) return;
    setManageBusy(true);
    const url =
      manageMode === "add" ? "/api/earn" : "/api/earn/withdraw";
    const body =
      manageMode === "add"
        ? { productId: managed.productId, amount: num }
        : { positionId: managed.id, amount: num };
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setManageBusy(false);
    if (r.ok) {
      await refresh();
      setManaged(null);
    }
  };

  return (
    <>
      <TopBar title="Earn" back="/home" />
      <div className="px-4 space-y-4">
        {/* Hero */}
        <Card className="bg-emerald text-white border-0">
          <div className="text-[11.5px] uppercase tracking-wider text-white/80 font-mono">
            Earning
          </div>
          <div className="font-display font-extrabold text-[36px] tabular leading-none mt-0.5">
            {fmtUSD(totalPrincipal + totalAccrued)}
          </div>
          <div className="text-[12.5px] text-white/85 mt-1">
            +{fmtUSD(totalAccrued)} accrued · still your money, working
          </div>
        </Card>

        <Section title="Your positions" className="px-0">
          <Card padded={false}>
            {user.earnPositions.length === 0 ? (
              <div className="px-4 py-5 text-center text-ink-500 text-[14px]">
                You aren&apos;t earning yet. Start with a low-risk treasury below.
              </div>
            ) : (
              user.earnPositions.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setManaged(p);
                    setManageMode("add");
                    setManageAmount("100");
                  }}
                  className="w-full text-left px-4 py-3 border-b border-ink-100 last:border-0 active:bg-brand-50/40 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="min-w-0">
                      <div className="font-display font-semibold text-[14.5px] text-ink truncate">
                        {p.productName}
                      </div>
                      <div className="mt-1">
                        <Chip variant={RISK_VARIANT[p.riskTier]} className="text-[10px]">
                          {RISK_LABEL[p.riskTier]}
                        </Chip>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-mono tabular font-semibold text-[14.5px] text-ink">
                        {fmtUSD(p.principal + p.accrued)}
                      </div>
                      <div className="font-mono tabular text-[12px] text-emerald mt-0.5">
                        +{fmtUSD(p.accrued)} · {fmtPct(p.liveApy)}
                      </div>
                    </div>
                  </div>
                </button>
              ))
            )}
          </Card>
        </Section>

        <Section title="Earn products" className="px-0">
          <div className="space-y-2.5 px-0">
            {products.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setSelected(p);
                  setAck(false);
                }}
                className="w-full text-left"
              >
                <Card className="active:bg-brand-50/40 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0">
                      <span className="font-display font-bold text-[15px] text-ink">
                        {p.name}
                      </span>
                      <p className="text-[12.5px] text-ink-500 mt-1 leading-snug">
                        {p.description}
                      </p>
                      <div className="mt-2">
                        <Chip variant={RISK_VARIANT[p.riskTier]} className="text-[10px]">
                          {RISK_LABEL[p.riskTier]}
                        </Chip>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-3">
                      <div className="font-mono tabular font-extrabold text-[20px] text-emerald">
                        {fmtPct(p.netApy)}
                      </div>
                      <div className="text-[10.5px] text-ink-500 font-mono">
                        {p.fixedRate
                          ? "Rate · fixed"
                          : `APY · ${fmtPct(p.apyMin, 1)}–${fmtPct(p.apyMax, 1)}`}
                      </div>
                    </div>
                  </div>
                </Card>
              </button>
            ))}
          </div>
        </Section>

        <div className="h-6" />
      </div>

      <Sheet
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.name}
        size="tall"
      >
        {selected && (
          <>
            <p className="text-[13.5px] text-ink-700 leading-snug">
              {selected.description}
            </p>

            <Card className={cn(
              "mt-4 border",
              selected.riskTier !== "low" ? "bg-rose/5 border-rose/30" : "bg-amber/5 border-amber/20"
            )}>
              <div className={cn(
                "font-display font-semibold text-[13.5px]",
                selected.riskTier !== "low" ? "text-rose" : "text-amber"
              )}>
                Risk
              </div>
              <p className="text-[13px] text-ink-700 mt-1 leading-snug">
                {selected.riskNote}
              </p>
            </Card>

            <div className="mt-5">
              <div className="text-[11.5px] uppercase tracking-wider text-ink-500 font-mono">
                Amount
              </div>
              <AmountInput value={amount} onChange={setAmount} />
              <div className="text-[12px] text-ink-500 mt-1">
                From {selected.rail === "USD" ? "USD account" : "USDC wallet"}{" "}
                ({fmtUSD(railBalance(selected.rail))} available)
              </div>
            </div>

            <Card padded={false} className="px-4 mt-4">
              {selected.fixedRate ? (
                <>
                  <KeyValue label="Rate" value={`${fmtPct(selected.netApy)} fixed`} mono />
                  <KeyValue label="Term" value="Held to maturity · daily liquidity" />
                </>
              ) : (
                <>
                  <KeyValue label="Net APY (live)" value={fmtPct(selected.netApy)} mono />
                  <KeyValue label="APY range" value={`${fmtPct(selected.apyMin, 1)}–${fmtPct(selected.apyMax, 1)}`} mono />
                  <KeyValue label="Liquidity" value="Withdraw any time" />
                </>
              )}
              {selected.capPerUser && (
                <KeyValue
                  label="Per-user cap"
                  value={fmtUSD(selected.capPerUser)}
                  mono
                />
              )}
            </Card>

            {selected.riskTier !== "low" && (
              <label className="flex items-start gap-3 mt-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={ack}
                  onChange={(e) => setAck(e.target.checked)}
                  className="mt-1 w-4 h-4 accent-rose"
                />
                <span className="text-[13px] text-ink-700 leading-snug">
                  I understand the risks and that returns are variable, not
                  guaranteed. I bear the risk of loss.
                </span>
              </label>
            )}

            <Button
              full
              size="lg"
              className="mt-4"
              onClick={submit}
              disabled={selected.riskTier !== "low" && !ack}
            >
              Move to {selected.name}
            </Button>
          </>
        )}
      </Sheet>

      {/* Manage existing position — Add more, or Withdraw to main balance */}
      <Sheet
        open={!!managed}
        onClose={() => setManaged(null)}
        title={managed?.productName}
        size="tall"
      >
        {managed && (() => {
          const positionBalance = managed.principal + managed.accrued;
          const mainBalance = railBalance(managed.rail);
          const num = Number(manageAmount) || 0;
          const max =
            manageMode === "add" ? mainBalance : positionBalance;
          const insufficient = num > max;
          const valid = num > 0 && !insufficient;
          const railLabel =
            managed.rail === "USD" ? "USD account" : "USDC wallet";

          return (
            <>
              {/* Mode toggle */}
              <div className="grid grid-cols-2 gap-1 p-1 bg-ink-100 rounded-2xl">
                {(["add", "withdraw"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => {
                      setManageMode(m);
                      setManageAmount("100");
                    }}
                    className={cn(
                      "py-2 rounded-xl text-[13px] font-display font-semibold transition-colors",
                      manageMode === m
                        ? "bg-white text-ink shadow-soft"
                        : "text-ink-500"
                    )}
                  >
                    {m === "add" ? "Add" : "Withdraw"}
                  </button>
                ))}
              </div>

              {/* Position summary */}
              <Card padded={false} className="px-4 mt-4">
                <KeyValue
                  label="Position balance"
                  value={fmtUSD(positionBalance)}
                  mono
                />
                <KeyValue
                  label="Accrued yield"
                  value={`+${fmtUSD(managed.accrued)}`}
                  mono
                />
                <KeyValue
                  label="Rate"
                  value={fmtPct(managed.liveApy)}
                  mono
                />
              </Card>

              {/* Amount */}
              <div className="mt-5">
                <div className="text-[11.5px] uppercase tracking-wider text-ink-500 font-mono">
                  Amount
                </div>
                <AmountInput
                  value={manageAmount}
                  onChange={setManageAmount}
                  autoFocus
                />
                <div className="text-[12px] text-ink-500 mt-1">
                  {manageMode === "add"
                    ? `From ${railLabel} · ${fmtUSD(mainBalance)} available`
                    : `Withdraw to ${railLabel} · max ${fmtUSD(positionBalance)}`}
                </div>
              </div>

              <Card padded={false} className="px-4 mt-4">
                <KeyValue
                  label="From"
                  value={manageMode === "add" ? railLabel : managed.productName}
                />
                <KeyValue
                  label="To"
                  value={manageMode === "add" ? managed.productName : railLabel}
                />
                <KeyValue label="Fee" value="$0.00" mono />
              </Card>

              {insufficient && (
                <p className="text-rose text-[13px] font-semibold mt-3">
                  {manageMode === "add"
                    ? `Not enough ${managed.rail} in main balance.`
                    : "Amount exceeds position balance."}
                </p>
              )}

              <Button
                full
                size="lg"
                className="mt-4"
                onClick={manageSubmit}
                disabled={!valid || manageBusy}
              >
                {manageBusy
                  ? "Submitting…"
                  : manageMode === "add"
                    ? `Add ${fmtUSD(num)} to ${managed.productName}`
                    : `Withdraw ${fmtUSD(num)} to ${railLabel}`}
              </Button>
            </>
          );
        })()}
      </Sheet>
    </>
  );
}
