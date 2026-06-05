"use client";

import { useState } from "react";
import { useParams, notFound } from "next/navigation";
import { TopBar } from "@/components/ui/TopBar";
import { Card } from "@/components/ui/Card";
import { CardVisual } from "@/components/cards/CardVisual";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { KeyValue } from "@/components/ui/KeyValue";
import { Sheet } from "@/components/ui/Sheet";
import { useUser } from "@/lib/persona-store";
import { fmtUSD } from "@/lib/format";
import { cn } from "@/lib/cn";

export default function CardDetailPage() {
  const { id } = useParams<{ id: string }>();
  const user = useUser();
  const idx = user.cards.findIndex((c) => c.id === id);
  if (idx < 0) return notFound();
  const card = user.cards[idx];

  const [frozen, setFrozen] = useState(card.frozen);
  const [channels, setChannels] = useState(card.channels);
  const [reveal, setReveal] = useState(false);

  return (
    <>
      <TopBar title={card.label} back />
      <div className="px-4 space-y-3">
        <CardVisual card={{ ...card, frozen }} holderName={user.name} size="lg" />

        <Button
          full
          size="lg"
          variant={frozen ? "primary" : "ghost"}
          onClick={() => setFrozen((f) => !f)}
        >
          {frozen ? "Unfreeze card" : "Freeze card"}
        </Button>

        <Card padded={false} className="px-4">
          <KeyValue label="Network" value={card.network} />
          <KeyValue
            label="Expires"
            value={`${String(card.expMonth).padStart(2, "0")}/${card.expYear}`}
            mono
          />
          <KeyValue label="Daily limit" value={fmtUSD(card.limits.daily)} mono />
          <KeyValue label="Monthly limit" value={fmtUSD(card.limits.monthly)} mono />
        </Card>

        <Section title="Channels" className="px-0">
          <Card padded={false} className="px-4">
            {(
              [
                ["online", "Online purchases"],
                ["contactless", "Contactless"],
                ["atm", "ATM withdrawals"],
                ["international", "International use"],
              ] as const
            ).map(([key, label]) => (
              <Toggle
                key={key}
                label={label}
                value={channels[key]}
                onChange={(v) => setChannels({ ...channels, [key]: v })}
              />
            ))}
          </Card>
        </Section>

        <Button variant="ghost" full onClick={() => setReveal(true)}>
          Reveal card details
        </Button>

        <div className="h-4" />
      </div>

      <Sheet
        open={reveal}
        onClose={() => setReveal(false)}
        title="Card details"
      >
        <p className="text-[13px] text-ink-500 leading-snug">
          For your security, we ask for a one-time code before showing the full
          number. (This is a mock — no code required.)
        </p>
        <div className="mt-4">
          <CardVisual card={card} holderName={user.name} size="lg" revealed />
        </div>
        <Card padded={false} className="px-4 mt-4">
          <KeyValue label="CVV" value="•••" mono />
          <KeyValue label="Billing zip" value="—" />
        </Card>
        <Button full size="lg" className="mt-4" onClick={() => setReveal(false)}>
          Hide details
        </Button>
      </Sheet>
    </>
  );
}

function Toggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-ink-100 last:border-0">
      <span className="text-[14px] text-ink font-semibold">{label}</span>
      <button
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className={cn(
          "w-11 h-6 rounded-full transition-colors relative",
          value ? "bg-brand" : "bg-ink-300"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all",
            value ? "left-[22px]" : "left-0.5"
          )}
        />
      </button>
    </div>
  );
}
