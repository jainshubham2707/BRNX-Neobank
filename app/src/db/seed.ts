/**
 * Seed script — ports the in-memory mock data into Neon.
 * Idempotent: clears existing rows for the seeded personas/catalog and re-inserts.
 *
 * Run: `npm run db:seed`
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import { db, schema } from "./index";
import { PERSONAS, PERSONA_KEYS } from "../lib/mock-data/personas";
import { getTransactions } from "../lib/mock-data/transactions";
import { EARN_PRODUCTS } from "../lib/mock-data/earn-products";
import { INSTRUMENTS } from "../lib/mock-data/instruments";
import { inArray } from "drizzle-orm";

function fmt(n: number) {
  return n.toFixed(4);
}

async function main() {
  console.log("→ Seeding DB…");

  // For users — delete the three demo personas first so cascade clears
  // their earn_positions (which reference earn_products).
  await db
    .delete(schema.users)
    .where(inArray(schema.users.id, Object.values(PERSONAS).map((u) => u.id)));

  // Catalog tables (now safe to rebuild)
  await db.delete(schema.instruments);
  await db.delete(schema.earnProducts);

  // Earn products
  for (const p of EARN_PRODUCTS) {
    await db.insert(schema.earnProducts).values({
      id: p.id,
      name: p.name,
      rail: p.rail,
      kind: p.kind,
      riskTier: p.riskTier,
      netApy: p.netApy.toString(),
      apyMin: p.apyMin.toString(),
      apyMax: p.apyMax.toString(),
      fixedRate: p.fixedRate ?? false,
      description: p.description,
      riskNote: p.riskNote,
      capPerUser: p.capPerUser?.toString() ?? null,
    });
  }
  console.log(`  ✓ ${EARN_PRODUCTS.length} earn products`);

  // Instruments catalog
  for (const i of INSTRUMENTS) {
    await db.insert(schema.instruments).values({
      symbol: i.symbol,
      base: i.base,
      name: i.name,
      kind: i.kind,
      rail: i.rail,
      price: fmt(i.price),
      changePct: i.changePct.toString(),
      sector: i.sector ?? null,
      domain: i.domain,
      brandColor: i.brandColor,
    });
  }
  console.log(`  ✓ ${INSTRUMENTS.length} instruments`);

  // Users + related
  for (const key of PERSONA_KEYS) {
    const u = PERSONAS[key];

    await db.insert(schema.users).values({
      id: u.id,
      personaKey: u.personaKey,
      name: u.name,
      emiratesId: u.emiratesId,
      email: u.email,
      phone: u.phone,
      kycTier: u.kycTier,
      productAccessFiat: u.productAccess.fiat,
      joinedAt: new Date(u.joinedAt),
      futuresOptIn: u.futuresOptIn,
      recentlyConvertedAt: u.recentlyConvertedAt
        ? new Date(u.recentlyConvertedAt)
        : null,
    });

    if (u.usdAccount) {
      await db.insert(schema.usdAccounts).values({
        userId: u.id,
        virtualIban: u.usdAccount.virtualIban,
        bankName: u.usdAccount.bankName,
        swiftCode: u.usdAccount.swiftCode,
        balance: fmt(u.usdAccount.balance),
      });
    }

    await db.insert(schema.usdcWallets).values({
      userId: u.id,
      address: u.usdcWallet.address,
      balance: fmt(u.usdcWallet.balance),
      network: u.usdcWallet.network,
    });

    await db.insert(schema.futuresWallets).values({
      userId: u.id,
      balance: fmt(u.futuresWallet.balance),
    });

    for (const c of u.cards) {
      await db.insert(schema.cards).values({
        id: c.id,
        userId: u.id,
        rail: c.rail,
        label: c.label,
        last4: c.last4,
        expMonth: c.expMonth,
        expYear: c.expYear,
        network: c.network,
        frozen: c.frozen,
        dailyLimit: fmt(c.limits.daily),
        monthlyLimit: fmt(c.limits.monthly),
        channels: c.channels,
        isDefault: c.isDefault,
      });
    }

    for (const h of u.holdings) {
      await db.insert(schema.holdings).values({
        id: `${u.id}_${h.id}`,
        userId: u.id,
        symbol: h.symbol,
        name: h.name,
        rail: h.rail,
        kind: h.kind,
        quantity: h.quantity.toString(),
        avgCost: fmt(h.avgCost),
        lastPrice: fmt(h.lastPrice),
        changePct: h.changePct.toString(),
      });
    }

    for (const p of u.earnPositions) {
      await db.insert(schema.earnPositions).values({
        id: `${u.id}_${p.id}`,
        userId: u.id,
        productId: p.productId,
        productName: p.productName,
        rail: p.rail,
        kind: p.kind,
        riskTier: p.riskTier,
        principal: fmt(p.principal),
        accrued: fmt(p.accrued),
        apyAtDeposit: p.apyAtDeposit.toString(),
        liveApy: p.liveApy.toString(),
        startedAt: new Date(p.startedAt),
      });
    }

    for (const f of u.futuresPositions) {
      await db.insert(schema.futuresPositions).values({
        id: `${u.id}_${f.id}`,
        userId: u.id,
        symbol: f.symbol,
        name: f.name,
        side: f.side,
        size: fmt(f.size),
        entry: fmt(f.entry),
        mark: fmt(f.mark),
        liqPrice: fmt(f.liqPrice),
        leverage: f.leverage,
        marginUsdc: fmt(f.marginUSDC),
        pnl: fmt(f.pnl),
        pnlPct: f.pnlPct.toString(),
      });
    }

    const txs = getTransactions(u.personaKey);
    for (const t of txs) {
      await db.insert(schema.transactions).values({
        id: `${u.id}_${t.id}`,
        userId: u.id,
        category: t.category,
        rail: t.rail,
        direction: t.direction,
        amount: fmt(t.amount),
        fee: t.fee !== undefined ? t.fee.toString() : null,
        status: t.status,
        timestamp: new Date(t.timestamp),
        title: t.title,
        subtitle: t.subtitle ?? null,
        meta: t.meta ?? null,
      });
    }

    console.log(
      `  ✓ ${u.personaKey.padEnd(11)} ${u.name} · cards ${u.cards.length}, holdings ${u.holdings.length}, earn ${u.earnPositions.length}, futures ${u.futuresPositions.length}, txns ${txs.length}`
    );
  }

  console.log("\n✓ Seed complete.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
