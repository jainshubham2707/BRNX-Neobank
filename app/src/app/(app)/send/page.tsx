"use client";

import Link from "next/link";
import { TopBar } from "@/components/ui/TopBar";
import { Card } from "@/components/ui/Card";
import { useUser } from "@/lib/persona-store";
import { fmtNum, fmtUSD } from "@/lib/format";

export default function SendPage() {
  const user = useUser();
  const hasFiat = user.productAccess.fiat;
  const usdc = user.usdcWallet.balance;
  const usd = user.usdAccount?.balance ?? 0;

  return (
    <>
      <TopBar title="Send" back />
      <div className="px-4 py-2 space-y-2.5">
        <Link href="/send/bank">
          <Card className="active:bg-brand-50 transition-colors">
            <div className="font-display font-semibold text-[15px] text-ink">
              To a bank account
            </div>
            <div className="text-[13px] text-ink-500 mt-0.5">
              SWIFT wire from your {hasFiat ? "USD or USDC" : "USDC"} balance
            </div>
            <div className="mt-2.5 flex items-center gap-3 text-[11.5px] font-mono uppercase tracking-wider">
              {hasFiat && (
                <span className="text-ink-700">
                  USD ·{" "}
                  <span className="font-semibold text-ink">{fmtUSD(usd)}</span>
                </span>
              )}
              <span className="text-ink-700">
                USDC ·{" "}
                <span className="font-semibold text-ink">{fmtNum(usdc)}</span>
              </span>
            </div>
            <div className="text-[11.5px] text-brand-700 font-mono uppercase tracking-wider mt-2">
              Settles 1–2 business days
            </div>
          </Card>
        </Link>

        <Link href="/send/wallet">
          <Card className="active:bg-brand-50 transition-colors">
            <div className="font-display font-semibold text-[15px] text-ink">
              To a wallet address
            </div>
            <div className="text-[13px] text-ink-500 mt-0.5">
              Send USDC from your USDC balance
            </div>
            <div className="mt-2.5 text-[11.5px] font-mono uppercase tracking-wider text-ink-700">
              USDC ·{" "}
              <span className="font-semibold text-ink">{fmtNum(usdc)}</span>
            </div>
            <div className="text-[11.5px] text-brand-700 font-mono uppercase tracking-wider mt-2">
              Settles in ~30s
            </div>
          </Card>
        </Link>
      </div>
    </>
  );
}
