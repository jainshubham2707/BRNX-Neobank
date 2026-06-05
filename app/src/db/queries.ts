/**
 * Server-side query helpers. The result types intentionally match the
 * front-end domain types in lib/types.ts so the UI can keep its existing
 * shape (just swap the data source).
 */
import { eq, desc } from "drizzle-orm";
import { db, schema } from "./index";
import type {
  PersonaKey,
  Transaction,
  User,
} from "@/lib/types";

const toNum = (s: string | null | undefined) =>
  s === null || s === undefined ? 0 : Number(s);

export async function getUserByPersona(
  personaKey: PersonaKey
): Promise<User | null> {
  const u = await db.query.users.findFirst({
    where: eq(schema.users.personaKey, personaKey),
  });
  if (!u) return null;

  const [usd, usdc, fut, cards, holdings, earnPositions, futuresPositions] =
    await Promise.all([
      db.query.usdAccounts.findFirst({
        where: eq(schema.usdAccounts.userId, u.id),
      }),
      db.query.usdcWallets.findFirst({
        where: eq(schema.usdcWallets.userId, u.id),
      }),
      db.query.futuresWallets.findFirst({
        where: eq(schema.futuresWallets.userId, u.id),
      }),
      db.query.cards.findMany({ where: eq(schema.cards.userId, u.id) }),
      db.query.holdings.findMany({ where: eq(schema.holdings.userId, u.id) }),
      db.query.earnPositions.findMany({
        where: eq(schema.earnPositions.userId, u.id),
      }),
      db.query.futuresPositions.findMany({
        where: eq(schema.futuresPositions.userId, u.id),
      }),
    ]);

  return {
    id: u.id,
    personaKey: u.personaKey,
    name: u.name,
    emiratesId: u.emiratesId,
    email: u.email,
    phone: u.phone,
    kycTier: u.kycTier,
    productAccess: { fiat: u.productAccessFiat, stablecoin: true },
    joinedAt: u.joinedAt.toISOString(),
    usdAccount: usd
      ? {
          virtualIban: usd.virtualIban,
          bankName: usd.bankName,
          swiftCode: usd.swiftCode,
          balance: toNum(usd.balance),
        }
      : null,
    usdcWallet: {
      address: usdc!.address,
      balance: toNum(usdc!.balance),
      network: "Base",
    },
    futuresWallet: { balance: toNum(fut?.balance) },
    cards: cards.map((c) => ({
      id: c.id,
      rail: c.rail,
      label: c.label,
      last4: c.last4,
      expMonth: c.expMonth,
      expYear: c.expYear,
      network: c.network,
      frozen: c.frozen,
      limits: { daily: toNum(c.dailyLimit), monthly: toNum(c.monthlyLimit) },
      channels: c.channels,
      isDefault: c.isDefault,
    })),
    holdings: holdings.map((h) => ({
      id: h.id,
      symbol: h.symbol,
      name: h.name,
      rail: h.rail,
      kind: h.kind,
      quantity: toNum(h.quantity),
      avgCost: toNum(h.avgCost),
      lastPrice: toNum(h.lastPrice),
      changePct: toNum(h.changePct),
    })),
    earnPositions: earnPositions.map((p) => ({
      id: p.id,
      productId: p.productId,
      productName: p.productName,
      rail: p.rail,
      kind: p.kind,
      riskTier: p.riskTier,
      principal: toNum(p.principal),
      accrued: toNum(p.accrued),
      apyAtDeposit: toNum(p.apyAtDeposit),
      liveApy: toNum(p.liveApy),
      startedAt: p.startedAt.toISOString(),
    })),
    futuresPositions: futuresPositions.map((p) => ({
      id: p.id,
      symbol: p.symbol,
      name: p.name,
      side: p.side,
      size: toNum(p.size),
      entry: toNum(p.entry),
      mark: toNum(p.mark),
      liqPrice: toNum(p.liqPrice),
      leverage: p.leverage,
      marginUSDC: toNum(p.marginUsdc),
      pnl: toNum(p.pnl),
      pnlPct: toNum(p.pnlPct),
    })),
    futuresOptIn: u.futuresOptIn,
    recentlyConvertedAt: u.recentlyConvertedAt?.toISOString(),
  };
}

export async function getTransactionsForUser(
  userId: string
): Promise<Transaction[]> {
  const rows = await db.query.transactions.findMany({
    where: eq(schema.transactions.userId, userId),
    orderBy: [desc(schema.transactions.timestamp)],
  });
  return rows.map((r) => ({
    id: r.id,
    category: r.category,
    rail: r.rail,
    direction: r.direction,
    amount: toNum(r.amount),
    fee: r.fee !== null ? toNum(r.fee) : undefined,
    status: r.status,
    timestamp: r.timestamp.toISOString(),
    title: r.title,
    subtitle: r.subtitle ?? undefined,
    meta: r.meta ?? undefined,
  }));
}

export async function listDemoPhones(): Promise<
  { key: PersonaKey; phone: string; name: string; productAccessFiat: boolean }[]
> {
  const us = await db.query.users.findMany();
  return us.map((u) => ({
    key: u.personaKey,
    phone: u.phone,
    name: u.name,
    productAccessFiat: u.productAccessFiat,
  }));
}
