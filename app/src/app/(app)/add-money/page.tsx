"use client";

import Link from "next/link";
import { TopBar } from "@/components/ui/TopBar";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { useUser } from "@/lib/persona-store";

type Option = {
  href: string;
  title: string;
  subtitle: string;
  eta: string;
};

const FIAT: Option[] = [
  {
    href: "/add-money/swift",
    title: "SWIFT",
    subtitle: "Wire money from any bank",
    eta: "1–2 business days",
  },
];

const STABLECOIN: Option[] = [
  {
    href: "/add-money/aed",
    title: "Onramp from Local Bank Account",
    subtitle: "Fund in AED, receive USDC",
    eta: "Under 5 minutes",
  },
  {
    href: "/add-money/usdc",
    title: "From external wallet",
    subtitle: "Send to your wallet address",
    eta: "Credits after ~30s",
  },
];

export default function AddMoneyPage() {
  const user = useUser();
  const hasFiat = user.productAccess.fiat;

  return (
    <>
      <TopBar title={hasFiat ? "Add money" : "Receive USDC"} back />
      <div className="py-2 space-y-5">
        {hasFiat && (
          <Section title="To USD">
            <div className="space-y-2.5">
              {FIAT.map((o) => (
                <OptionRow key={o.href} option={o} />
              ))}
            </div>
          </Section>
        )}

        <Section title="To USDC">
          <div className="space-y-2.5">
            {STABLECOIN.map((o) => (
              <OptionRow key={o.href} option={o} />
            ))}
          </div>
        </Section>

        {!hasFiat && (
          <p className="text-[12px] text-ink-500 px-5 leading-snug">
            Send USDC only. Other tokens may be lost.
          </p>
        )}
      </div>
    </>
  );
}

function OptionRow({ option }: { option: Option }) {
  return (
    <Link href={option.href}>
      <Card className="flex items-center gap-3 active:bg-brand-50 transition-colors">
        <div className="flex-1 min-w-0">
          <div className="font-display font-semibold text-[15px] text-ink">
            {option.title}
          </div>
          <div className="text-[13px] text-ink-500 mt-0.5">{option.subtitle}</div>
          <div className="text-[11.5px] text-brand-700 font-mono uppercase tracking-wider mt-1">
            {option.eta}
          </div>
        </div>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          className="text-ink-500"
        >
          <path
            d="M9 6l6 6-6 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </Card>
    </Link>
  );
}
