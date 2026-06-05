"use client";

import Link from "next/link";
import { useMemo } from "react";
import { usePersona, useUser } from "@/lib/persona-store";
import { BalanceCard } from "@/components/home/BalanceCard";
import { QuickActions } from "@/components/home/QuickActions";
import { NetWorth } from "@/components/home/NetWorth";
import { TxRow } from "@/components/ui/TxRow";
import { Section } from "@/components/ui/Section";
import { Logo } from "@/components/brand/Logo";
import { Card } from "@/components/ui/Card";
import { fmtUSD } from "@/lib/format";

export default function HomePage() {
  const user = useUser();
  const { transactions } = usePersona();
  const hasFiat = user.productAccess.fiat;

  const totals = useMemo(() => {
    const fiat = user.usdAccount?.balance ?? 0;
    const usdc = user.usdcWallet.balance;
    const cash = fiat + usdc;
    const invest = user.holdings.reduce(
      (sum, h) => sum + h.quantity * h.lastPrice,
      0
    );
    const earn = user.earnPositions.reduce(
      (sum, p) => sum + p.principal + p.accrued,
      0
    );
    // Futures = free wallet balance + posted margin + unrealized PnL on
    // open positions. Matches what FuturesView surfaces (collateralTotal + PnL).
    const futuresMarginAndPnl = user.futuresPositions.reduce(
      (sum, p) => sum + p.marginUSDC + p.pnl,
      0
    );
    const futures = user.futuresWallet.balance + futuresMarginAndPnl;
    return { fiat, usdc, cash, invest, earn, futures };
  }, [user]);

  const total = totals.cash + totals.invest + totals.earn + totals.futures;

  return (
    <>
      <header className="px-4 pt-11 pb-3 flex items-center justify-between">
        <Logo size="md" />
        <Link
          href="/profile"
          className="w-9 h-9 rounded-full bg-brand-50 text-brand-700 inline-flex items-center justify-center font-display font-bold"
          aria-label="Profile"
        >
          {user.name.split(" ").map((s) => s[0]).slice(0, 2).join("")}
        </Link>
      </header>

      <div className="space-y-4">
        <BalanceCard
          totalUSD={total > 0 ? totals.cash : 0}
          fiatUSD={hasFiat ? totals.fiat : null}
          usdcUSD={totals.usdc}
        />

        <QuickActions hasFiat={hasFiat} />

        {total > 0 ? (
          <NetWorth
            cashUSD={totals.cash}
            investUSD={totals.invest}
            earnUSD={totals.earn}
            futuresUSD={totals.futures}
          />
        ) : (
          <EmptyState hasFiat={hasFiat} />
        )}

        {totals.cash > 1000 &&
          totals.earn / Math.max(totals.cash, 1) < 0.3 && (
            <Section className="pt-1">
              <Link href="/earn">
                <Card className="bg-emerald/5 border-emerald/20 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald flex items-center justify-center text-white font-display font-bold">
                    %
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-display font-semibold text-[14.5px] text-ink">
                      {fmtUSD(totals.cash)} idle, earning 0%
                    </div>
                    <div className="text-[12px] text-ink-500">
                      Earn upto 6% yields
                    </div>
                  </div>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-ink-500">
                    <path
                      d="M9 6l6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </Card>
              </Link>
            </Section>
          )}

        <Section
          title="Recent activity"
          action={
            <Link href="/activity" className="text-[13px] font-semibold text-brand-700">
              View all
            </Link>
          }
        >
          <Card padded={false} className="px-2">
            {transactions.length === 0 ? (
              <div className="px-4 py-8 text-center text-ink-500 text-[14px]">
                No activity yet.{" "}
                {hasFiat ? "Add money to get started." : "Receive USDC to get started."}
              </div>
            ) : (
              transactions.slice(0, 4).map((tx) => (
                <TxRow key={tx.id} tx={tx} href={`/activity/${tx.id}`} />
              ))
            )}
          </Card>
        </Section>

        <div className="h-6" />
      </div>
    </>
  );
}

function EmptyState({ hasFiat }: { hasFiat: boolean }) {
  return (
    <div className="mx-4 rounded-2xl border border-dashed border-brand-300 bg-brand-50/60 p-5 text-center">
      <div className="font-display font-bold text-[18px] text-brand-800">
        {hasFiat ? "Both rails are live and empty." : "Your USDC wallet is live and empty."}
      </div>
      <p className="text-[13px] text-brand-700/80 mt-1">
        {hasFiat
          ? "Add money to your USD account, receive USDC, or top up from AED."
          : "Receive USDC from any wallet, then spend, invest, or earn."}
      </p>
      <Link
        href="/add-money"
        className="inline-flex items-center justify-center mt-3 h-10 px-5 rounded-xl bg-brand text-white font-display font-semibold text-[14px] shadow-btn"
      >
        {hasFiat ? "Add money" : "Receive USDC"}
      </Link>
    </div>
  );
}
