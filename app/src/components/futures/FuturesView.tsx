"use client";

import Link from "next/link";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { RailBadge } from "@/components/ui/RailBadge";
import { Sheet } from "@/components/ui/Sheet";
import { AmountInput } from "@/components/ui/AmountInput";
import { KeyValue } from "@/components/ui/KeyValue";
import { usePersona, useUser } from "@/lib/persona-store";
import { fmtUSD, fmtPct, fmtNum } from "@/lib/format";
import { cn } from "@/lib/cn";
import { assetLogo } from "@/lib/mock-data/instruments";

/**
 * Map a futures market symbol to the underlying asset key used by assetLogo.
 *   NVDA-FUT  → NVDA
 *   PRE-OPENAI → OPENAI
 *   XAU-PERP   → XAU
 */
function logoKey(symbol: string): string {
  return symbol
    .replace(/-PERP$/i, "")
    .replace(/-FUT$/i, "")
    .replace(/^PRE-/i, "");
}

const MARKETS: {
  symbol: string;
  name: string;
  mark: number;
  change24h: number;
  /** Brand-color fallback for the monogram tile. */
  brandColor: string;
}[] = [
  { symbol: "NVDA-FUT", name: "NVIDIA equity future", mark: 146.1, change24h: 2.21, brandColor: "#76B900" },
  { symbol: "AAPL-FUT", name: "Apple equity future", mark: 232.4, change24h: 0.82, brandColor: "#0B0B0B" },
  { symbol: "TSLA-FUT", name: "Tesla equity future", mark: 322.5, change24h: -1.35, brandColor: "#CC0000" },
  { symbol: "MSTR-FUT", name: "Strategy equity future", mark: 412.5, change24h: 3.18, brandColor: "#F7931A" },
  { symbol: "PRE-OPENAI", name: "OpenAI pre-IPO future", mark: 1_215.0, change24h: -2.4, brandColor: "#0B0B0B" },
  { symbol: "PRE-STRIPE", name: "Stripe pre-IPO future", mark: 92.5, change24h: 0.0, brandColor: "#635BFF" },
  { symbol: "XAU-PERP", name: "Gold perpetual", mark: 2_705.4, change24h: 0.46, brandColor: "#D4AF37" },
  { symbol: "XAG-PERP", name: "Silver perpetual", mark: 32.1, change24h: -0.27, brandColor: "#C0C0C0" },
  { symbol: "CL-PERP", name: "Crude oil perpetual", mark: 71.85, change24h: 0.62, brandColor: "#1B1B1B" },
];

export function FuturesView() {
  const user = useUser();
  const { refresh } = usePersona();
  const [loadOpen, setLoadOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);

  const optIn = async () => {
    const r = await fetch("/api/futures/opt-in", { method: "POST" });
    if (r.ok) await refresh();
  };

  if (!user.futuresOptIn) {
    return <OptIn onOpt={optIn} />;
  }

  const totalMargin = user.futuresPositions.reduce(
    (s, p) => s + p.marginUSDC,
    0
  );
  const totalPnl = user.futuresPositions.reduce((s, p) => s + p.pnl, 0);
  const freeMargin = user.futuresWallet.balance;
  const collateralTotal = totalMargin + freeMargin;

  return (
    <div className="space-y-4">
      {/* Futures wallet card — clearly separated from spendable USDC */}
      <Card className="bg-gradient-to-br from-deep-900 via-deep to-brand text-white border-0">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[11.5px] uppercase tracking-wider text-brand-200 font-mono">
              Futures wallet
            </div>
            <div className="font-display font-extrabold text-[30px] tabular leading-none mt-1">
              {fmtUSD(collateralTotal)}
            </div>
            <div className="text-[12px] text-brand-100/80 mt-1.5">
              Isolated from your spendable balance
            </div>
          </div>
          <div className="text-right">
            <div className="text-[11.5px] uppercase tracking-wider text-brand-200 font-mono">
              Open PnL
            </div>
            <div
              className={cn(
                "font-display font-extrabold text-[22px] tabular mt-0.5",
                totalPnl >= 0 ? "text-emerald" : "text-rose"
              )}
            >
              {totalPnl >= 0 ? "+" : "−"}
              {fmtUSD(Math.abs(totalPnl))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-4">
          <div className="rounded-xl bg-white/10 border border-white/15 px-3 py-2.5">
            <div className="text-[10.5px] uppercase tracking-wider text-brand-200 font-mono">
              In margin
            </div>
            <div className="font-mono tabular font-semibold text-[15px] mt-0.5">
              {fmtUSD(totalMargin)}
            </div>
          </div>
          <div className="rounded-xl bg-white/10 border border-white/15 px-3 py-2.5">
            <div className="text-[10.5px] uppercase tracking-wider text-brand-200 font-mono">
              Free
            </div>
            <div className="font-mono tabular font-semibold text-[15px] mt-0.5">
              {fmtUSD(freeMargin)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-3">
          <Button
            variant="ghost"
            full
            className="bg-white/10 text-white border-white/20 shadow-none hover:bg-white/15"
            onClick={() => setLoadOpen(true)}
          >
            Add funds
          </Button>
          <Button
            variant="ghost"
            full
            className="bg-white/10 text-white border-white/20 shadow-none hover:bg-white/15"
            disabled={freeMargin <= 0}
            onClick={() => setWithdrawOpen(true)}
          >
            Withdraw
          </Button>
        </div>
      </Card>

      <Section title="Your positions" className="px-0">
        <Card padded={false}>
          {user.futuresPositions.length === 0 ? (
            <div className="px-4 py-6 text-center text-ink-500 text-[14px]">
              No open positions.
            </div>
          ) : (
            user.futuresPositions.map((p) => (
              <div
                key={p.id}
                className="px-4 py-4 border-b border-ink-100 last:border-0"
              >
                <div className="flex items-start gap-3">
                  <MarketLogo symbol={p.symbol} brandColor="#054086" />
                  <div className="flex-1 min-w-0">
                    <div className="font-display font-bold text-[15px] text-ink leading-tight truncate">
                      {p.symbol}
                    </div>
                    <div className="mt-1">
                      <Chip
                        variant={p.side === "long" ? "earn" : "fail"}
                        className="text-[10px]"
                      >
                        {p.side === "long" ? "Long" : "Short"} {p.leverage}×
                      </Chip>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div
                      className={cn(
                        "font-mono tabular font-semibold text-[15px] leading-tight",
                        p.pnl >= 0 ? "text-emerald" : "text-rose"
                      )}
                    >
                      {p.pnl >= 0 ? "+" : "−"}
                      {fmtUSD(Math.abs(p.pnl))}
                    </div>
                    <div
                      className={cn(
                        "font-mono tabular text-[12px] mt-0.5",
                        p.pnlPct >= 0 ? "text-emerald" : "text-rose"
                      )}
                    >
                      {p.pnlPct >= 0 ? "+" : ""}
                      {fmtPct(p.pnlPct)}
                    </div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-ink-100 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Stat label="Size" value={fmtUSD(p.size)} />
                    <Stat label="Margin" value={fmtUSD(p.marginUSDC)} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Stat label="Mark price" value={fmtUSD(p.mark)} />
                    <Stat label="Liq price" value={fmtUSD(p.liqPrice)} danger />
                  </div>
                </div>
              </div>
            ))
          )}
        </Card>
      </Section>

      <Section title="Markets" className="px-0">
        <Card padded={false}>
          {MARKETS.map((m) => (
            <Link
              key={m.symbol}
              href="#"
              className="flex items-center gap-3 px-4 py-3 border-b border-ink-100 last:border-0 active:bg-brand-50/40"
            >
              <MarketLogo symbol={m.symbol} brandColor={m.brandColor} />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-[14px] text-ink truncate">
                  {m.symbol}
                </div>
                <div className="text-[12px] text-ink-500 truncate">{m.name}</div>
              </div>
              <div className="text-right">
                <div className="font-mono tabular text-[14px] font-semibold text-ink">
                  {fmtUSD(m.mark)}
                </div>
                <div
                  className={cn(
                    "font-mono tabular text-[12px] mt-0.5",
                    m.change24h > 0 ? "text-emerald" : m.change24h < 0 ? "text-rose" : "text-ink-500"
                  )}
                >
                  {m.change24h > 0 ? "+" : ""}
                  {fmtPct(m.change24h)}
                </div>
              </div>
            </Link>
          ))}
        </Card>
      </Section>

      <Card className="bg-rose/5 border-rose/20">
        <div className="flex items-center gap-2">
          <RailBadge rail="USDC" />
          <div className="font-display font-semibold text-rose text-[14px]">
            High-risk product
          </div>
        </div>
        <p className="text-[12.5px] text-ink-700 mt-1 leading-snug">
          Futures use leverage. You can lose more than you deposit. Liquidation
          is automatic when the mark crosses your liq price.
        </p>
      </Card>

      <LoadWalletSheet
        open={loadOpen}
        onClose={() => setLoadOpen(false)}
        usdcBalance={user.usdcWallet.balance}
        onConfirm={async (amount) => {
          const r = await fetch("/api/futures/load", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount }),
          });
          if (r.ok) await refresh();
          setLoadOpen(false);
        }}
      />

      <WithdrawWalletSheet
        open={withdrawOpen}
        onClose={() => setWithdrawOpen(false)}
        freeBalance={freeMargin}
        onConfirm={async (amount) => {
          const r = await fetch("/api/futures/withdraw", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount }),
          });
          if (r.ok) await refresh();
          setWithdrawOpen(false);
        }}
      />
    </div>
  );
}

function Stat({
  label,
  value,
  danger,
}: {
  label: string;
  value: string;
  danger?: boolean;
}) {
  return (
    <div className="min-w-0">
      <div className="text-[10px] uppercase tracking-wider text-ink-500 font-mono leading-none">
        {label}
      </div>
      <div
        className={cn(
          "font-mono tabular text-[13px] font-semibold mt-1 truncate",
          danger ? "text-rose" : "text-ink"
        )}
      >
        {value}
      </div>
    </div>
  );
}

/** Logo tile for a futures market — uses local /public/logos/* via assetLogo
 *  with a colored monogram fallback. */
function MarketLogo({
  symbol,
  brandColor,
}: {
  symbol: string;
  brandColor: string;
}) {
  const key = logoKey(symbol);
  const src = assetLogo(key);
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        style={{ backgroundColor: brandColor }}
        className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-display font-bold text-[10px] tracking-tight shrink-0"
      >
        {key.slice(0, 4)}
      </div>
    );
  }

  return (
    <div className="w-10 h-10 rounded-xl bg-white border border-ink-100 flex items-center justify-center shrink-0 overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        aria-hidden
        onError={() => setFailed(true)}
        loading="lazy"
        style={{ width: 28, height: 28, objectFit: "contain" }}
      />
    </div>
  );
}

function LoadWalletSheet({
  open,
  onClose,
  usdcBalance,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  usdcBalance: number;
  onConfirm: (amount: number) => void;
}) {
  const [amount, setAmount] = useState("500");
  const num = Number(amount) || 0;
  const insufficient = num > usdcBalance;
  const valid = num > 0 && !insufficient;

  return (
    <Sheet open={open} onClose={onClose} title="Add funds to futures wallet">
      <p className="text-[13px] text-ink-700 leading-snug">
        Move USDC from your main wallet into the isolated futures wallet. It
        won&apos;t be spendable from your card until you move it back.
      </p>

      <div className="mt-4">
        <div className="text-[11.5px] uppercase tracking-wider text-ink-500 font-mono">
          Amount
        </div>
        <AmountInput value={amount} onChange={setAmount} autoFocus />
        <div className="text-[12px] text-ink-500 mt-1">
          Available in main wallet:{" "}
          <span className="font-mono tabular">{fmtUSD(usdcBalance)}</span>
        </div>
      </div>

      <Card padded={false} className="px-4 mt-4">
        <KeyValue label="From" value="Main USDC wallet" />
        <KeyValue label="To" value="Futures wallet · isolated" />
        <KeyValue label="Fee" value="$0.00" mono />
        <KeyValue label="Settlement" value="Instant" />
      </Card>

      {insufficient && (
        <p className="text-rose text-[13px] font-semibold mt-3">
          Not enough in your main wallet.
        </p>
      )}

      <Button
        full
        size="lg"
        className="mt-4"
        disabled={!valid}
        onClick={() => onConfirm(num)}
      >
        Move {num > 0 ? fmtUSD(num) : "$0"} to futures
      </Button>
    </Sheet>
  );
}

function WithdrawWalletSheet({
  open,
  onClose,
  freeBalance,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  freeBalance: number;
  onConfirm: (amount: number) => void;
}) {
  const [amount, setAmount] = useState("100");
  const num = Number(amount) || 0;
  const insufficient = num > freeBalance;
  const valid = num > 0 && !insufficient;

  return (
    <Sheet open={open} onClose={onClose} title="Withdraw from futures wallet">
      <p className="text-[13px] text-ink-700 leading-snug">
        Move USDC out of the futures wallet and back into your main USDC
        wallet. Only free (unused) margin can be withdrawn.
      </p>

      <div className="mt-4">
        <div className="text-[11.5px] uppercase tracking-wider text-ink-500 font-mono">
          Amount
        </div>
        <AmountInput value={amount} onChange={setAmount} autoFocus />
        <div className="text-[12px] text-ink-500 mt-1">
          Free in futures wallet:{" "}
          <span className="font-mono tabular">{fmtUSD(freeBalance)}</span>
        </div>
      </div>

      <Card padded={false} className="px-4 mt-4">
        <KeyValue label="From" value="Futures wallet" />
        <KeyValue label="To" value="Main USDC wallet" />
        <KeyValue label="Fee" value="$0.00" mono />
        <KeyValue label="Settlement" value="Instant" />
      </Card>

      {insufficient && (
        <p className="text-rose text-[13px] font-semibold mt-3">
          Not enough free margin to withdraw.
        </p>
      )}

      <Button
        full
        size="lg"
        className="mt-4"
        disabled={!valid}
        onClick={() => onConfirm(num)}
      >
        Withdraw {num > 0 ? fmtUSD(num) : "$0"}
      </Button>
    </Sheet>
  );
}

function OptIn({ onOpt }: { onOpt: () => void }) {
  const [ack, setAck] = useState(false);
  return (
    <div className="space-y-4">
      <Card className="bg-brand-deep text-white border-0">
        <div className="text-[11.5px] uppercase tracking-wider text-brand-200 font-mono">
          Futures · Hyperliquid
        </div>
        <div className="font-display font-extrabold text-[26px] mt-1 leading-tight">
          Stocks, commodities, pre-IPO
        </div>
        <p className="text-brand-100/90 text-[13.5px] mt-2">
          Trade perpetuals routed to Hyperliquid via BRNX builder codes.
          Collateral is USDC, held in a separate futures wallet — isolated from
          your spendable balance.
        </p>
      </Card>

      <Card>
        <div className="font-display font-semibold text-[14px] text-ink">
          What you should know
        </div>
        <ul className="mt-2 space-y-2 text-[13px] text-ink-700 leading-snug">
          <li>• Leveraged products. Losses can exceed deposited margin.</li>
          <li>• Liquidation is automatic — set leverage low if you&apos;re new.</li>
          <li>• Pre-IPO futures track private market interest, not fundamentals.</li>
          <li>• BRNX takes a small builder-code fee on each trade.</li>
        </ul>
      </Card>

      <label className="flex items-start gap-3 px-1 cursor-pointer">
        <input
          type="checkbox"
          checked={ack}
          onChange={(e) => setAck(e.target.checked)}
          className="mt-1 w-4 h-4 accent-brand"
        />
        <span className="text-[13px] text-ink-700 leading-snug">
          I understand futures carry the risk of losing my margin and that
          BRNX does not provide investment advice.
        </span>
      </label>

      <Button full size="lg" disabled={!ack} onClick={onOpt}>
        Enable futures
      </Button>
    </div>
  );
}
