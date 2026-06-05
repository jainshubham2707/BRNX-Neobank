"use client";

import { useParams, notFound } from "next/navigation";
import { TopBar } from "@/components/ui/TopBar";
import { Card } from "@/components/ui/Card";
import { Money } from "@/components/ui/Money";
import { StatusPill } from "@/components/ui/StatusPill";
import { RailBadge } from "@/components/ui/RailBadge";
import { KeyValue } from "@/components/ui/KeyValue";
import { Button } from "@/components/ui/Button";
import { usePersona } from "@/lib/persona-store";
import { fmtDateTime, fmtNum, fmtPct, fmtUSD, shortHash } from "@/lib/format";

export default function TxDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { transactions } = usePersona();
  const tx = transactions.find((t) => t.id === id);
  if (!tx) return notFound();

  const signed = tx.direction === "in" ? tx.amount : -tx.amount;

  return (
    <>
      <TopBar title="Transaction" back />
      <div className="px-4 space-y-3">
        <Card>
          <div className="flex items-center justify-between">
            <RailBadge rail={tx.rail} />
            <StatusPill status={tx.status} />
          </div>
          <Money
            value={signed}
            sign
            className="block font-display font-extrabold text-[42px] tabular leading-none mt-3 text-ink"
          />
          <div className="text-[13px] text-ink-500 mt-1">{tx.title}</div>
          <div className="text-[12px] text-ink-500 mt-0.5">
            {fmtDateTime(tx.timestamp)}
          </div>
        </Card>

        {tx.category === "convert" && tx.meta && (
          <Card padded={false} className="px-4">
            <KeyValue
              label="From"
              value={`${fmtNum(tx.meta.fromAmount ?? 0)} ${tx.meta.fromRail}`}
              mono
            />
            <KeyValue
              label="To"
              value={`${fmtNum(tx.meta.toAmount ?? 0)} ${tx.meta.toRail}`}
              mono
            />
            <KeyValue
              label="Rate"
              value={`1 ${tx.meta.fromRail} = ${(tx.meta.rate ?? 0).toFixed(5)} ${tx.meta.toRail}`}
              mono
            />
            {tx.fee !== undefined && (
              <KeyValue label="Fee" value={fmtUSD(tx.fee)} mono />
            )}
          </Card>
        )}

        {tx.category === "load" && tx.meta && (
          <Card padded={false} className="px-4">
            <KeyValue
              label="Source"
              value={
                tx.meta.loadSource === "swift"
                  ? "SWIFT inbound"
                  : tx.meta.loadSource === "aed-onramp"
                    ? "AED onramp"
                    : "USDC transfer"
              }
            />
            {tx.meta.aedAmount && (
              <KeyValue
                label="AED amount"
                value={`AED ${fmtNum(tx.meta.aedAmount)}`}
                mono
              />
            )}
            {tx.meta.aedToUsdRate && (
              <KeyValue
                label="FX rate"
                value={`${tx.meta.aedToUsdRate.toFixed(4)} AED / USD`}
                mono
              />
            )}
            {tx.fee !== undefined && (
              <KeyValue label="Fee" value={fmtUSD(tx.fee)} mono />
            )}
            {tx.meta.bankRef && (
              <KeyValue label="Bank reference" value={tx.meta.bankRef} mono />
            )}
            {tx.meta.txHash && (
              <KeyValue
                label="Transaction reference"
                value={
                  <span className="text-ink font-mono tabular">
                    {shortHash(tx.meta.txHash)}
                  </span>
                }
              />
            )}
          </Card>
        )}

        {tx.category === "spend" && tx.meta && (
          <Card padded={false} className="px-4">
            <KeyValue label="Merchant" value={tx.meta.merchant ?? "—"} />
            {tx.meta.merchantCity && (
              <KeyValue label="Location" value={tx.meta.merchantCity} />
            )}
            <KeyValue
              label="Card"
              value={tx.rail === "USD" ? "Fiat card" : "Stablecoin card"}
            />
            {tx.meta.originalAmount && tx.meta.originalCurrency && (
              <KeyValue
                label="Original"
                value={`${tx.meta.originalCurrency} ${fmtNum(tx.meta.originalAmount)}`}
                mono
              />
            )}
            {tx.meta.fxRate && (
              <KeyValue label="FX rate" value={tx.meta.fxRate.toFixed(4)} mono />
            )}
            {tx.meta.authConversion && (
              <>
                <KeyValue
                  label="Auth-time convert"
                  value={`${fmtNum(tx.meta.authConversion.usdcSpent)} USDC → $${fmtNum(tx.meta.authConversion.usdEquivalent)}`}
                  mono
                />
                <KeyValue
                  label="Convert rate"
                  value={tx.meta.authConversion.rate.toFixed(5)}
                  mono
                />
              </>
            )}
            {tx.meta.txHash && (
              <KeyValue
                label="Transaction reference"
                value={
                  <span className="text-ink font-mono tabular">
                    {shortHash(tx.meta.txHash)}
                  </span>
                }
              />
            )}
          </Card>
        )}

        {tx.category === "invest" && tx.meta && (
          <Card padded={false} className="px-4">
            <KeyValue
              label="Instrument"
              value={`${tx.meta.instrumentSymbol} (${
                tx.meta.instrumentKind === "equity"
                  ? "equity"
                  : tx.meta.instrumentKind === "xstock"
                    ? "xStock"
                    : "commodity token"
              })`}
            />
            <KeyValue
              label="Quantity"
              value={fmtNum(tx.meta.quantity ?? 0, 4)}
              mono
            />
            <KeyValue
              label="Fill price"
              value={fmtUSD(tx.meta.fillPrice ?? 0)}
              mono
            />
            <KeyValue label="Order" value="Market" />
          </Card>
        )}

        {tx.category === "earn" && tx.meta && (
          <Card padded={false} className="px-4">
            <KeyValue label="Product" value={tx.meta.earnProductName ?? "—"} />
            <KeyValue
              label={
                tx.meta.earnProductId === "fiat-treasury" ? "Rate" : "APY at action"
              }
              value={tx.meta.apyAtAction ? fmtPct(tx.meta.apyAtAction) : "—"}
              mono
            />
            <KeyValue label="Type" value={tx.direction === "in" ? "Yield accrued" : "Deposit"} />
          </Card>
        )}

        {tx.category === "futures" && tx.meta && (
          <Card padded={false} className="px-4">
            <KeyValue label="Market" value={tx.meta.futuresSymbol ?? "—"} />
            <KeyValue
              label="Side"
              value={`${tx.meta.futuresSide} ${tx.meta.leverage}×`}
            />
          </Card>
        )}

        {/* Builder copy on settlement */}
        <Card className="bg-brand-50/60 border-brand-200">
          <div className="font-display font-semibold text-brand-800 text-[14px]">
            {tx.status === "settled"
              ? "Reconciled"
              : tx.status === "settling"
                ? "Waiting on rail"
                : tx.status === "pending"
                  ? "Sitting in pending"
                  : "Failed"}
          </div>
          <p className="text-[12.5px] text-brand-700/90 mt-1 leading-snug">
            {tx.status === "settled"
              ? "This entry matches the external settlement record on its rail."
              : tx.status === "settling"
                ? "Posted to the ledger. We'll mark it settled once the rail confirms."
                : tx.status === "pending"
                  ? "Awaiting the partner to acknowledge."
                  : "We've reversed the ledger entry."}
          </p>
        </Card>

        <Button full variant="ghost">
          Get help with this
        </Button>

        <div className="h-6" />
      </div>
    </>
  );
}
