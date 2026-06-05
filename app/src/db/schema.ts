import {
  boolean,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

// ── Enums ────────────────────────────────────────────────────────────────
export const railEnum = pgEnum("rail", ["USD", "USDC"]);
export const txRailEnum = pgEnum("tx_rail", ["USD", "USDC", "mixed"]);
export const txCategoryEnum = pgEnum("tx_category", [
  "load",
  "spend",
  "convert",
  "invest",
  "earn",
  "futures",
]);
export const txStatusEnum = pgEnum("tx_status", [
  "pending",
  "settling",
  "settled",
  "failed",
]);
export const txDirectionEnum = pgEnum("tx_direction", ["in", "out"]);
export const kycTierEnum = pgEnum("kyc_tier", ["none", "base", "enhanced"]);
export const personaKeyEnum = pgEnum("persona_key", [
  "stablecoin",
  "active",
  "power",
]);
export const earnProductKindEnum = pgEnum("earn_product_kind", [
  "fiat-treasury",
  "stablecoin-treasury",
  "lending-vault",
]);
export const riskTierEnum = pgEnum("risk_tier", ["low", "medium", "high"]);
export const instrumentKindEnum = pgEnum("instrument_kind", [
  "equity",
  "xstock",
  "commodity-token",
]);
export const sideEnum = pgEnum("side", ["long", "short"]);
export const cardNetworkEnum = pgEnum("card_network", ["Visa", "Mastercard"]);

// ── Helpers ──────────────────────────────────────────────────────────────
const money = (col: string) =>
  numeric(col, { precision: 18, scale: 4 }).notNull().default("0");

// ── Users + per-user wallets ─────────────────────────────────────────────
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  personaKey: personaKeyEnum("persona_key").notNull(),
  name: text("name").notNull(),
  emiratesId: text("emirates_id").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  kycTier: kycTierEnum("kyc_tier").notNull(),
  productAccessFiat: boolean("product_access_fiat").notNull(),
  joinedAt: timestamp("joined_at", { withTimezone: true }).notNull().defaultNow(),
  futuresOptIn: boolean("futures_opt_in").notNull().default(false),
  recentlyConvertedAt: timestamp("recently_converted_at", {
    withTimezone: true,
  }),
});

export const usdAccounts = pgTable("usd_accounts", {
  userId: text("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  virtualIban: text("virtual_iban").notNull(),
  bankName: text("bank_name").notNull(),
  swiftCode: text("swift_code").notNull(),
  balance: money("balance"),
});

export const usdcWallets = pgTable("usdc_wallets", {
  userId: text("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  address: text("address").notNull(),
  balance: money("balance"),
  network: text("network").notNull().default("Base"),
});

export const futuresWallets = pgTable("futures_wallets", {
  userId: text("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  balance: money("balance"),
});

// ── Cards ────────────────────────────────────────────────────────────────
export const cards = pgTable("cards", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  rail: railEnum("rail").notNull(),
  label: text("label").notNull(),
  last4: text("last4").notNull(),
  expMonth: integer("exp_month").notNull(),
  expYear: integer("exp_year").notNull(),
  network: cardNetworkEnum("network").notNull(),
  frozen: boolean("frozen").notNull().default(false),
  dailyLimit: money("daily_limit"),
  monthlyLimit: money("monthly_limit"),
  channels: jsonb("channels").$type<{
    online: boolean;
    contactless: boolean;
    atm: boolean;
    international: boolean;
  }>().notNull(),
  isDefault: boolean("is_default").notNull().default(false),
});

// ── Holdings (invest) ────────────────────────────────────────────────────
export const holdings = pgTable("holdings", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  symbol: text("symbol").notNull(),
  name: text("name").notNull(),
  rail: railEnum("rail").notNull(),
  kind: instrumentKindEnum("kind").notNull(),
  quantity: numeric("quantity", { precision: 24, scale: 8 }).notNull().default("0"),
  avgCost: money("avg_cost"),
  lastPrice: money("last_price"),
  changePct: numeric("change_pct", { precision: 8, scale: 4 }).notNull().default("0"),
});

// ── Earn ─────────────────────────────────────────────────────────────────
export const earnProducts = pgTable("earn_products", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  rail: railEnum("rail").notNull(),
  kind: earnProductKindEnum("kind").notNull(),
  riskTier: riskTierEnum("risk_tier").notNull(),
  netApy: numeric("net_apy", { precision: 6, scale: 2 }).notNull(),
  apyMin: numeric("apy_min", { precision: 6, scale: 2 }).notNull(),
  apyMax: numeric("apy_max", { precision: 6, scale: 2 }).notNull(),
  fixedRate: boolean("fixed_rate").notNull().default(false),
  description: text("description").notNull(),
  riskNote: text("risk_note").notNull(),
  capPerUser: numeric("cap_per_user", { precision: 18, scale: 2 }),
});

export const earnPositions = pgTable("earn_positions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  productId: text("product_id")
    .notNull()
    .references(() => earnProducts.id),
  productName: text("product_name").notNull(),
  rail: railEnum("rail").notNull(),
  kind: earnProductKindEnum("kind").notNull(),
  riskTier: riskTierEnum("risk_tier").notNull(),
  principal: money("principal"),
  accrued: money("accrued"),
  apyAtDeposit: numeric("apy_at_deposit", { precision: 6, scale: 2 }).notNull(),
  liveApy: numeric("live_apy", { precision: 6, scale: 2 }).notNull(),
  startedAt: timestamp("started_at", { withTimezone: true }).notNull(),
});

// ── Futures ──────────────────────────────────────────────────────────────
export const futuresPositions = pgTable("futures_positions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  symbol: text("symbol").notNull(),
  name: text("name").notNull(),
  side: sideEnum("side").notNull(),
  size: money("size"),
  entry: money("entry"),
  mark: money("mark"),
  liqPrice: money("liq_price"),
  leverage: integer("leverage").notNull(),
  marginUsdc: money("margin_usdc"),
  pnl: money("pnl"),
  pnlPct: numeric("pnl_pct", { precision: 8, scale: 4 }).notNull().default("0"),
});

// ── Instruments catalog ──────────────────────────────────────────────────
export const instruments = pgTable("instruments", {
  symbol: text("symbol").primaryKey(),
  base: text("base").notNull(),
  name: text("name").notNull(),
  kind: instrumentKindEnum("kind").notNull(),
  rail: railEnum("rail").notNull(),
  price: money("price"),
  changePct: numeric("change_pct", { precision: 8, scale: 4 }).notNull().default("0"),
  sector: text("sector"),
  domain: text("domain").notNull(),
  brandColor: text("brand_color").notNull(),
});

// ── Transactions (the unified ledger §5) ────────────────────────────────
export const transactions = pgTable("transactions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  category: txCategoryEnum("category").notNull(),
  rail: txRailEnum("rail").notNull(),
  direction: txDirectionEnum("direction").notNull(),
  amount: money("amount"),
  fee: numeric("fee", { precision: 18, scale: 4 }),
  status: txStatusEnum("status").notNull(),
  timestamp: timestamp("timestamp", { withTimezone: true }).notNull().defaultNow(),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  meta: jsonb("meta").$type<TransactionMeta>(),
});

export type TransactionMeta = {
  loadSource?: "swift" | "aed-onramp" | "usdc-deposit";
  bankRef?: string;
  aedAmount?: number;
  aedToUsdRate?: number;
  txHash?: string;
  confirmations?: number;
  merchant?: string;
  merchantCity?: string;
  cardId?: string;
  originalAmount?: number;
  originalCurrency?: string;
  fxRate?: number;
  authConversion?: {
    usdcSpent: number;
    usdEquivalent: number;
    rate: number;
  };
  fromRail?: "USD" | "USDC";
  toRail?: "USD" | "USDC";
  fromAmount?: number;
  toAmount?: number;
  rate?: number;
  instrumentSymbol?: string;
  instrumentKind?: "equity" | "xstock" | "commodity-token";
  fillPrice?: number;
  quantity?: number;
  earnProductId?: string;
  earnProductName?: string;
  apyAtAction?: number;
  futuresSymbol?: string;
  futuresSide?: "long" | "short";
  leverage?: number;
};
