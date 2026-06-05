/**
 * Server-side mutations. Each one writes to the DB and returns the resulting
 * transaction row. Balance math runs in JS because Neon HTTP doesn't support
 * multi-statement transactions, but the operations are sequential and each
 * update is atomic at the row level.
 */
import { eq, sql } from "drizzle-orm";
import { db, schema } from "./index";
import type { Rail, Transaction } from "@/lib/types";
import type { TransactionMeta } from "./schema";

const id = (prefix: string) =>
  `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const n = (v: number) => v.toFixed(4);

// Convert spread (matches the UI value)
const CONVERT_RATE_BASE = 0.9992;
const CONVERT_SPREAD = 0.0008;

// ─────────────────────────────────────────────────────────────────────────
// Convert USD ⇄ USDC
// ─────────────────────────────────────────────────────────────────────────
export async function convert(args: {
  userId: string;
  fromRail: Rail;
  amount: number;
}): Promise<Transaction> {
  const { userId, fromRail, amount } = args;
  if (amount <= 0) throw new Error("amount must be positive");
  const toRail: Rail = fromRail === "USD" ? "USDC" : "USD";

  const usd = await db.query.usdAccounts.findFirst({
    where: eq(schema.usdAccounts.userId, userId),
  });
  const usdc = await db.query.usdcWallets.findFirst({
    where: eq(schema.usdcWallets.userId, userId),
  });
  if (!usdc) throw new Error("missing USDC wallet");

  const rate =
    fromRail === "USD" ? CONVERT_RATE_BASE : 1 / CONVERT_RATE_BASE - CONVERT_SPREAD;
  const received = amount * rate;
  const fee = amount * CONVERT_SPREAD;

  if (fromRail === "USD") {
    if (!usd) throw new Error("user has no USD account");
    if (Number(usd.balance) < amount) throw new Error("insufficient USD");
    await db
      .update(schema.usdAccounts)
      .set({ balance: sql`${schema.usdAccounts.balance} - ${n(amount)}` })
      .where(eq(schema.usdAccounts.userId, userId));
    await db
      .update(schema.usdcWallets)
      .set({ balance: sql`${schema.usdcWallets.balance} + ${n(received)}` })
      .where(eq(schema.usdcWallets.userId, userId));
  } else {
    if (!usd) throw new Error("user has no USD account");
    if (Number(usdc.balance) < amount) throw new Error("insufficient USDC");
    await db
      .update(schema.usdcWallets)
      .set({ balance: sql`${schema.usdcWallets.balance} - ${n(amount)}` })
      .where(eq(schema.usdcWallets.userId, userId));
    await db
      .update(schema.usdAccounts)
      .set({ balance: sql`${schema.usdAccounts.balance} + ${n(received)}` })
      .where(eq(schema.usdAccounts.userId, userId));
  }

  return insertTx({
    userId,
    category: "convert",
    rail: "mixed",
    direction: "out",
    amount,
    fee,
    status: "settled",
    title: `Convert ${fromRail} → ${toRail}`,
    subtitle: "Settled",
    meta: {
      fromRail,
      toRail,
      fromAmount: amount,
      toAmount: Number(received.toFixed(2)),
      rate: Number(rate.toFixed(5)),
    },
  });
}

// ─────────────────────────────────────────────────────────────────────────
// Add money — SWIFT inbound, AED onramp to USDC, USDC deposit
// ─────────────────────────────────────────────────────────────────────────
export async function addMoney(args: {
  userId: string;
  source: "swift" | "aed-onramp" | "usdc-deposit";
  amount: number;
  aedAmount?: number;
  aedRate?: number;
  /** AED onramp can target either rail */
  destination?: Rail;
}): Promise<Transaction> {
  const { userId, source, amount, aedAmount, aedRate } = args;
  if (amount <= 0) throw new Error("amount must be positive");

  const destination: Rail =
    source === "swift"
      ? "USD"
      : source === "usdc-deposit"
        ? "USDC"
        : (args.destination ?? "USDC");

  if (destination === "USD") {
    await db
      .update(schema.usdAccounts)
      .set({ balance: sql`${schema.usdAccounts.balance} + ${n(amount)}` })
      .where(eq(schema.usdAccounts.userId, userId));
  } else {
    await db
      .update(schema.usdcWallets)
      .set({ balance: sql`${schema.usdcWallets.balance} + ${n(amount)}` })
      .where(eq(schema.usdcWallets.userId, userId));
  }

  const ref =
    source === "swift"
      ? `UTR-${Math.floor(Math.random() * 9000 + 1000)}`
      : source === "aed-onramp"
        ? `OR-${Math.floor(Math.random() * 9000 + 1000)}`
        : undefined;

  return insertTx({
    userId,
    category: "load",
    rail: destination,
    direction: "in",
    amount,
    status: "settled",
    title:
      source === "swift"
        ? "SWIFT deposit · USD"
        : source === "aed-onramp"
          ? `AED onramp · ${destination}`
          : "USDC deposit",
    subtitle:
      source === "aed-onramp" && aedAmount && aedRate
        ? `AED ${aedAmount.toFixed(2)} @ ${aedRate.toFixed(4)}`
        : undefined,
    meta: {
      loadSource: source,
      bankRef: ref,
      aedAmount,
      aedToUsdRate: aedRate,
    },
  });
}

// ─────────────────────────────────────────────────────────────────────────
// Trade — invest buy/sell, USD or USDC funded
// ─────────────────────────────────────────────────────────────────────────
export async function trade(args: {
  userId: string;
  symbol: string;
  side: "buy" | "sell";
  amount: number; // USD-equivalent
}): Promise<Transaction> {
  const { userId, symbol, side, amount } = args;
  if (amount <= 0) throw new Error("amount must be positive");

  const inst = await db.query.instruments.findFirst({
    where: eq(schema.instruments.symbol, symbol),
  });
  if (!inst) throw new Error("unknown instrument");
  const price = Number(inst.price);
  const qty = amount / price;

  // Adjust rail balance
  if (inst.rail === "USD") {
    if (side === "buy") {
      await db
        .update(schema.usdAccounts)
        .set({ balance: sql`${schema.usdAccounts.balance} - ${n(amount)}` })
        .where(eq(schema.usdAccounts.userId, userId));
    } else {
      await db
        .update(schema.usdAccounts)
        .set({ balance: sql`${schema.usdAccounts.balance} + ${n(amount)}` })
        .where(eq(schema.usdAccounts.userId, userId));
    }
  } else {
    if (side === "buy") {
      await db
        .update(schema.usdcWallets)
        .set({ balance: sql`${schema.usdcWallets.balance} - ${n(amount)}` })
        .where(eq(schema.usdcWallets.userId, userId));
    } else {
      await db
        .update(schema.usdcWallets)
        .set({ balance: sql`${schema.usdcWallets.balance} + ${n(amount)}` })
        .where(eq(schema.usdcWallets.userId, userId));
    }
  }

  // Update / create holding row
  const existing = await db.query.holdings.findFirst({
    where: eq(schema.holdings.userId, userId),
    // user-level lookup — filter by symbol manually
  });
  const userHoldings = await db.query.holdings.findMany({
    where: eq(schema.holdings.userId, userId),
  });
  const owned = userHoldings.find((h) => h.symbol === symbol);

  if (side === "buy") {
    if (owned) {
      const newQty = Number(owned.quantity) + qty;
      const newCost =
        (Number(owned.quantity) * Number(owned.avgCost) + amount) / newQty;
      await db
        .update(schema.holdings)
        .set({
          quantity: newQty.toFixed(8),
          avgCost: n(newCost),
          lastPrice: n(price),
        })
        .where(eq(schema.holdings.id, owned.id));
    } else {
      await db.insert(schema.holdings).values({
        id: id(`h_${userId}`),
        userId,
        symbol,
        name: inst.name,
        rail: inst.rail,
        kind: inst.kind,
        quantity: qty.toFixed(8),
        avgCost: n(price),
        lastPrice: n(price),
        changePct: inst.changePct,
      });
    }
  } else {
    if (!owned) throw new Error("nothing to sell");
    const newQty = Number(owned.quantity) - qty;
    if (newQty <= 0.00000001) {
      await db.delete(schema.holdings).where(eq(schema.holdings.id, owned.id));
    } else {
      await db
        .update(schema.holdings)
        .set({ quantity: newQty.toFixed(8) })
        .where(eq(schema.holdings.id, owned.id));
    }
  }

  // existing var used to satisfy ESLint about no-unused vars — used in trace below
  void existing;

  return insertTx({
    userId,
    category: "invest",
    rail: inst.rail,
    direction: side === "buy" ? "out" : "in",
    amount,
    status: "settled",
    title: `${side === "buy" ? "Buy" : "Sell"} ${inst.symbol}`,
    subtitle: `${qty.toFixed(2)} ${inst.kind === "equity" ? "sh" : "tokens"} @ $${price.toFixed(2)}`,
    meta: {
      instrumentSymbol: inst.symbol,
      instrumentKind: inst.kind,
      fillPrice: price,
      quantity: qty,
    },
  });
}

// ─────────────────────────────────────────────────────────────────────────
// Earn — move to/from a product
// ─────────────────────────────────────────────────────────────────────────
export async function moveToEarn(args: {
  userId: string;
  productId: string;
  amount: number;
}): Promise<Transaction> {
  const { userId, productId, amount } = args;
  if (amount <= 0) throw new Error("amount must be positive");

  const product = await db.query.earnProducts.findFirst({
    where: eq(schema.earnProducts.id, productId),
  });
  if (!product) throw new Error("unknown product");

  // Debit rail
  if (product.rail === "USD") {
    await db
      .update(schema.usdAccounts)
      .set({ balance: sql`${schema.usdAccounts.balance} - ${n(amount)}` })
      .where(eq(schema.usdAccounts.userId, userId));
  } else {
    await db
      .update(schema.usdcWallets)
      .set({ balance: sql`${schema.usdcWallets.balance} - ${n(amount)}` })
      .where(eq(schema.usdcWallets.userId, userId));
  }

  // Upsert position
  const existing = await db.query.earnPositions.findMany({
    where: eq(schema.earnPositions.userId, userId),
  });
  const owned = existing.find((p) => p.productId === productId);
  if (owned) {
    await db
      .update(schema.earnPositions)
      .set({ principal: sql`${schema.earnPositions.principal} + ${n(amount)}` })
      .where(eq(schema.earnPositions.id, owned.id));
  } else {
    await db.insert(schema.earnPositions).values({
      id: id(`ep_${userId}`),
      userId,
      productId: product.id,
      productName: product.name,
      rail: product.rail,
      kind: product.kind,
      riskTier: product.riskTier,
      principal: n(amount),
      accrued: "0",
      apyAtDeposit: product.netApy,
      liveApy: product.netApy,
      startedAt: new Date(),
    });
  }

  return insertTx({
    userId,
    category: "earn",
    rail: product.rail,
    direction: "out",
    amount,
    status: "settled",
    title: `Move to ${product.name}`,
    subtitle: product.fixedRate
      ? `${Number(product.netApy).toFixed(2)}% fixed`
      : `${Number(product.netApy).toFixed(2)}% APY`,
    meta: {
      earnProductId: product.id,
      earnProductName: product.name,
      apyAtAction: Number(product.netApy),
    },
  });
}

/**
 * Withdraw from an Earn position back to the user's main rail balance.
 *  - USDC products → main USDC wallet
 *  - USD products  → main USD account
 *
 * Withdraw amount is capped at the position's principal + accrued.
 * When the full balance is withdrawn the position row is removed.
 */
export async function withdrawFromEarn(args: {
  userId: string;
  positionId: string;
  amount: number;
}): Promise<Transaction> {
  const { userId, positionId, amount } = args;
  if (amount <= 0) throw new Error("amount must be positive");

  const pos = await db.query.earnPositions.findFirst({
    where: eq(schema.earnPositions.id, positionId),
  });
  if (!pos || pos.userId !== userId) throw new Error("position not found");

  const principal = Number(pos.principal);
  const accrued = Number(pos.accrued);
  const available = principal + accrued;
  if (amount > available) throw new Error("amount exceeds position balance");

  // Drain accrued first, then principal.
  const fromAccrued = Math.min(accrued, amount);
  const fromPrincipal = amount - fromAccrued;
  const newAccrued = accrued - fromAccrued;
  const newPrincipal = principal - fromPrincipal;

  if (newPrincipal + newAccrued <= 0.0001) {
    await db
      .delete(schema.earnPositions)
      .where(eq(schema.earnPositions.id, pos.id));
  } else {
    await db
      .update(schema.earnPositions)
      .set({
        principal: n(newPrincipal),
        accrued: n(newAccrued),
      })
      .where(eq(schema.earnPositions.id, pos.id));
  }

  if (pos.rail === "USD") {
    await db
      .update(schema.usdAccounts)
      .set({ balance: sql`${schema.usdAccounts.balance} + ${n(amount)}` })
      .where(eq(schema.usdAccounts.userId, userId));
  } else {
    await db
      .update(schema.usdcWallets)
      .set({ balance: sql`${schema.usdcWallets.balance} + ${n(amount)}` })
      .where(eq(schema.usdcWallets.userId, userId));
  }

  return insertTx({
    userId,
    category: "earn",
    rail: pos.rail,
    direction: "in",
    amount,
    status: "settled",
    title: `Withdraw from ${pos.productName}`,
    subtitle: `${amount.toFixed(2)} ${pos.rail} returned to main balance`,
    meta: {
      earnProductId: pos.productId,
      earnProductName: pos.productName,
      apyAtAction: Number(pos.liveApy),
    },
  });
}

// ─────────────────────────────────────────────────────────────────────────
// Send — USD out via bank wire, USDC out to an external wallet address.
//        Each debits the source rail and writes a "spend" tx (the unified
//        ledger doesn't have a distinct send category — outgoing transfer
//        is a form of spend per the PRD).
// ─────────────────────────────────────────────────────────────────────────
const WIRE_FEE_USD = 4.0;

export async function sendOut(args: {
  userId: string;
  /** Rail the user's balance is debited from. */
  sourceRail: Rail;
  /** Amount the beneficiary receives. USD for bank, USDC for wallet. */
  amount: number;
  /** Beneficiary name for bank wires / counterparty label for USDC. */
  beneficiary: string;
  /** USD bank: IBAN/account number. USDC wallet: 0x address. */
  destination: string;
  /** Bank send only: SWIFT/BIC of the receiving bank. Presence flips the
   *  mutation into bank-wire mode. */
  swift?: string;
  /** Optional memo */
  memo?: string;
}): Promise<Transaction> {
  const { userId, sourceRail, amount, beneficiary, destination, swift, memo } =
    args;
  void memo;
  if (amount <= 0) throw new Error("amount must be positive");

  const isBank = !!swift;
  if (!isBank && sourceRail === "USD") {
    throw new Error("USD wallet sends not supported — use bank wire");
  }

  // Compute what we'll actually debit from the source rail.
  let debit: number;
  if (isBank) {
    // amount = USD landing in beneficiary's account
    const totalUsd = amount + WIRE_FEE_USD;
    debit = sourceRail === "USD" ? totalUsd : totalUsd / CONVERT_RATE_BASE;
  } else {
    // amount = USDC sent to wallet, no fee
    debit = amount;
  }

  // Debit the source rail.
  if (sourceRail === "USD") {
    const usd = await db.query.usdAccounts.findFirst({
      where: eq(schema.usdAccounts.userId, userId),
    });
    if (!usd) throw new Error("user has no USD account");
    if (Number(usd.balance) < debit) throw new Error("insufficient USD");
    await db
      .update(schema.usdAccounts)
      .set({ balance: sql`${schema.usdAccounts.balance} - ${n(debit)}` })
      .where(eq(schema.usdAccounts.userId, userId));
  } else {
    const usdc = await db.query.usdcWallets.findFirst({
      where: eq(schema.usdcWallets.userId, userId),
    });
    if (!usdc) throw new Error("missing USDC wallet");
    if (Number(usdc.balance) < debit) throw new Error("insufficient USDC");
    await db
      .update(schema.usdcWallets)
      .set({ balance: sql`${schema.usdcWallets.balance} - ${n(debit)}` })
      .where(eq(schema.usdcWallets.userId, userId));
  }

  // Title + subtitle.
  const title = isBank
    ? `Send to ${beneficiary}`
    : `Send USDC to ${beneficiary || shortAddr(destination)}`;
  const subtitle = isBank
    ? sourceRail === "USD"
      ? `Wire · ${maskIban(destination)}`
      : `Off-ramp · ${maskIban(destination)}`
    : `External wallet · ${shortAddr(destination)}`;

  return insertTx({
    userId,
    category: "spend",
    rail: sourceRail,
    direction: "out",
    amount: debit,
    fee: isBank ? WIRE_FEE_USD : undefined,
    status: isBank ? "settling" : "settled",
    title,
    subtitle,
    meta: isBank
      ? {
          merchant: beneficiary,
          bankRef: `WIRE-${Math.floor(Math.random() * 9000 + 1000)}`,
        }
      : {
          merchant: beneficiary || shortAddr(destination),
          txHash: fakeTxHash(),
        },
  });
}

function shortAddr(a: string): string {
  if (!a) return "—";
  return a.length > 12 ? `${a.slice(0, 6)}…${a.slice(-4)}` : a;
}

function maskIban(s: string): string {
  if (!s) return "—";
  const digits = s.replace(/\s+/g, "");
  if (digits.length <= 8) return digits;
  return `${digits.slice(0, 4)} •••• ${digits.slice(-4)}`;
}

function fakeTxHash(): string {
  const hex = "0123456789abcdef";
  let h = "0x";
  for (let i = 0; i < 64; i++) h += hex[Math.floor(Math.random() * 16)];
  return h;
}

// ─────────────────────────────────────────────────────────────────────────
// Futures — opt in, load wallet
// ─────────────────────────────────────────────────────────────────────────
export async function optInFutures(userId: string): Promise<void> {
  await db
    .update(schema.users)
    .set({ futuresOptIn: true })
    .where(eq(schema.users.id, userId));
}

export async function withdrawFuturesWallet(args: {
  userId: string;
  amount: number;
}): Promise<Transaction> {
  const { userId, amount } = args;
  if (amount <= 0) throw new Error("amount must be positive");

  const fut = await db.query.futuresWallets.findFirst({
    where: eq(schema.futuresWallets.userId, userId),
  });
  if (!fut) throw new Error("missing futures wallet");
  if (Number(fut.balance) < amount) throw new Error("insufficient futures free margin");

  await db
    .update(schema.futuresWallets)
    .set({ balance: sql`${schema.futuresWallets.balance} - ${n(amount)}` })
    .where(eq(schema.futuresWallets.userId, userId));

  await db
    .update(schema.usdcWallets)
    .set({ balance: sql`${schema.usdcWallets.balance} + ${n(amount)}` })
    .where(eq(schema.usdcWallets.userId, userId));

  return insertTx({
    userId,
    category: "futures",
    rail: "USDC",
    direction: "in",
    amount,
    status: "settled",
    title: "Withdraw from futures",
    subtitle: `${amount.toFixed(2)} USDC moved to main wallet`,
    meta: { futuresSymbol: "—", futuresSide: "long", leverage: 1 },
  });
}

export async function loadFuturesWallet(args: {
  userId: string;
  amount: number;
}): Promise<Transaction> {
  const { userId, amount } = args;
  if (amount <= 0) throw new Error("amount must be positive");

  const usdc = await db.query.usdcWallets.findFirst({
    where: eq(schema.usdcWallets.userId, userId),
  });
  if (!usdc) throw new Error("missing USDC wallet");
  if (Number(usdc.balance) < amount) throw new Error("insufficient USDC");

  await db
    .update(schema.usdcWallets)
    .set({ balance: sql`${schema.usdcWallets.balance} - ${n(amount)}` })
    .where(eq(schema.usdcWallets.userId, userId));

  await db
    .update(schema.futuresWallets)
    .set({ balance: sql`${schema.futuresWallets.balance} + ${n(amount)}` })
    .where(eq(schema.futuresWallets.userId, userId));

  return insertTx({
    userId,
    category: "futures",
    rail: "USDC",
    direction: "out",
    amount,
    status: "settled",
    title: "Load futures wallet",
    subtitle: `${amount.toFixed(2)} USDC moved from main wallet`,
    meta: { futuresSymbol: "—", futuresSide: "long", leverage: 1 },
  });
}

// ─────────────────────────────────────────────────────────────────────────
// Internal
// ─────────────────────────────────────────────────────────────────────────
async function insertTx(args: {
  userId: string;
  category: Transaction["category"];
  rail: Transaction["rail"];
  direction: Transaction["direction"];
  amount: number;
  status: Transaction["status"];
  title: string;
  subtitle?: string;
  fee?: number;
  meta?: TransactionMeta;
}): Promise<Transaction> {
  const row = await db
    .insert(schema.transactions)
    .values({
      id: id(`tx_${args.category}`),
      userId: args.userId,
      category: args.category,
      rail: args.rail,
      direction: args.direction,
      amount: n(args.amount),
      fee: args.fee !== undefined ? args.fee.toFixed(4) : null,
      status: args.status,
      timestamp: new Date(),
      title: args.title,
      subtitle: args.subtitle ?? null,
      meta: args.meta ?? null,
    })
    .returning();
  const r = row[0];
  return {
    id: r.id,
    category: r.category,
    rail: r.rail,
    direction: r.direction,
    amount: Number(r.amount),
    fee: r.fee !== null ? Number(r.fee) : undefined,
    status: r.status,
    timestamp: r.timestamp.toISOString(),
    title: r.title,
    subtitle: r.subtitle ?? undefined,
    meta: r.meta ?? undefined,
  };
}
