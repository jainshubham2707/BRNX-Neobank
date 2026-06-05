"use client";

import Link from "next/link";
import { useState } from "react";
import { TopBar } from "@/components/ui/TopBar";
import { Card } from "@/components/ui/Card";
import { CardVisual } from "@/components/cards/CardVisual";
import { Section } from "@/components/ui/Section";
import { TxRow } from "@/components/ui/TxRow";
import { Chip } from "@/components/ui/Chip";
import { usePersona, useUser } from "@/lib/persona-store";
import { fmtUSD, fmtNum } from "@/lib/format";
import { cn } from "@/lib/cn";

export default function CardsPage() {
  const user = useUser();
  const { transactions } = usePersona();
  const [activeIdx, setActiveIdx] = useState(0);
  const active = user.cards[activeIdx];

  const balance =
    active.rail === "USD"
      ? (user.usdAccount?.balance ?? 0)
      : user.usdcWallet.balance;
  const cardSpend = transactions
    .filter((t) => t.category === "spend" && t.meta?.cardId === active.id)
    .slice(0, 5);

  return (
    <>
      <TopBar
        title="Cards"
        back="/home"
        right={
          <Link
            href="/profile"
            className="text-[13px] font-semibold text-brand-700"
          >
            New card
          </Link>
        }
      />

      <div className="px-4 pt-1">
        <div className="flex gap-2 mb-3">
          {user.cards.map((c, i) => (
            <button
              key={c.id}
              onClick={() => setActiveIdx(i)}
              className={cn(
                "px-3 py-1.5 rounded-full text-[12px] font-semibold transition-colors",
                i === activeIdx
                  ? "bg-ink text-white"
                  : "bg-white text-ink-700 border border-ink-100"
              )}
            >
              {c.label}
            </button>
          ))}
        </div>

        <Link href={`/cards/${active.id}`}>
          <CardVisual card={active} holderName={user.name} size="lg" />
        </Link>

        <Card className="mt-3 flex items-center justify-between">
          <div>
            <div className="text-[11.5px] uppercase tracking-wider text-ink-500 font-mono">
              Spendable balance
            </div>
            <div className="font-display font-bold text-[24px] tabular text-ink mt-0.5">
              {active.rail === "USD"
                ? fmtUSD(balance)
                : `${fmtNum(balance)} USDC`}
            </div>
            {active.rail === "USDC" && (
              <div className="text-[12px] text-ink-500 mt-0.5">
                Converts to USD at the moment you tap
              </div>
            )}
          </div>
          {active.isDefault && <Chip variant="brand">Default</Chip>}
        </Card>

        <div className="grid grid-cols-4 gap-2 mt-3">
          <ActionTile label={active.frozen ? "Unfreeze" : "Freeze"} icon="freeze" />
          <ActionTile label="Limits" icon="limits" href={`/cards/${active.id}`} />
          <ActionTile label="Details" icon="reveal" href={`/cards/${active.id}`} />
          <ActionTile label="Settings" icon="cog" href={`/cards/${active.id}`} />
        </div>
      </div>

      <Section title="Recent on this card" className="mt-5">
        <Card padded={false} className="px-2">
          {cardSpend.length === 0 ? (
            <div className="px-4 py-6 text-center text-ink-500 text-[14px]">
              Nothing spent on this card yet.
            </div>
          ) : (
            cardSpend.map((tx) => (
              <TxRow key={tx.id} tx={tx} href={`/activity/${tx.id}`} />
            ))
          )}
        </Card>
      </Section>

      <div className="h-6" />
    </>
  );
}

function ActionTile({
  label,
  icon,
  href,
}: {
  label: string;
  icon: "freeze" | "limits" | "reveal" | "cog";
  href?: string;
}) {
  const inner = (
    <div className="flex flex-col items-center gap-1.5 bg-white border border-ink-100 rounded-2xl py-3 active:bg-brand-50">
      <span className="w-8 h-8 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center">
        {icon === "freeze" && "❄"}
        {icon === "limits" && "$"}
        {icon === "reveal" && "👁"}
        {icon === "cog" && "⚙"}
      </span>
      <span className="text-[11.5px] font-semibold text-ink">{label}</span>
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : <button className="w-full">{inner}</button>;
}
