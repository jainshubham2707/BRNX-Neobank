/**
 * Domain types — mirror the real ledger model in the PRD so APIs can be
 * swapped in later without changing the UI.
 *
 * The internal ledger is the source of truth (§5). Every entry has a rail
 * (USD fiat or USDC) and a settlement status that maps to user-facing copy.
 */

export type Rail = "USD" | "USDC";

export type KycTier = "none" | "base" | "enhanced";

export type TxCategory =
  | "load"
  | "spend"
  | "convert"
  | "invest"
  | "earn"
  | "futures";

export type TxStatus =
  | "pending"
  | "settling"
  | "settled"
  | "failed";

export type LoadSource = "swift" | "aed-onramp" | "usdc-deposit";

export type EarnProductKind =
  | "fiat-treasury"
  | "stablecoin-treasury"
  | "lending-vault";

export type RiskTier = "low" | "medium" | "high";

export interface Money {
  amount: number; // always USD-equivalent
  rail: Rail;
}

export interface Card {
  id: string;
  rail: Rail;
  label: string; // "Fiat card" | "Stablecoin card"
  last4: string;
  expMonth: number;
  expYear: number;
  network: "Visa" | "Mastercard";
  frozen: boolean;
  limits: {
    daily: number;
    monthly: number;
  };
  channels: {
    online: boolean;
    contactless: boolean;
    atm: boolean;
    international: boolean;
  };
  isDefault: boolean;
}

export interface Holding {
  id: string;
  symbol: string;
  name: string;
  rail: Rail; // USD = fractional equity, USDC = xStock / tokenized
  kind: "equity" | "xstock" | "commodity-token";
  quantity: number;
  avgCost: number;
  lastPrice: number;
  changePct: number; // today's change %
}

export interface EarnPosition {
  id: string;
  productId: string;
  productName: string;
  rail: Rail;
  kind: EarnProductKind;
  riskTier: RiskTier;
  principal: number;
  accrued: number;
  apyAtDeposit: number;
  liveApy: number;
  startedAt: string;
}

export interface EarnProduct {
  id: string;
  name: string;
  rail: Rail;
  kind: EarnProductKind;
  riskTier: RiskTier;
  /** Headline rate. For fixed-rate products this is the fixed rate; for
   *  variable products this is the live mid of the range. */
  netApy: number;
  apyMin: number;
  apyMax: number;
  /** When true, headline rate is fixed (e.g. T-Bill yield-to-maturity).
   *  Display as "Rate" with no range; never call it APY. */
  fixedRate?: boolean;
  description: string;
  riskNote: string;
  capPerUser?: number; // e.g. $50K on lending vault
}

export interface FuturesPosition {
  id: string;
  symbol: string;
  name: string;
  side: "long" | "short";
  size: number; // notional USD
  entry: number;
  mark: number;
  liqPrice: number;
  leverage: number;
  marginUSDC: number;
  pnl: number;
  pnlPct: number;
}

export interface Transaction {
  id: string;
  category: TxCategory;
  rail: Rail | "mixed"; // convert is mixed
  direction: "in" | "out"; // from the user's perspective
  amount: number; // signed in display layer; absolute here
  fee?: number;
  status: TxStatus;
  timestamp: string; // ISO
  title: string; // short, human
  subtitle?: string;
  meta?: {
    // Load
    loadSource?: LoadSource;
    bankRef?: string; // SWIFT UTR / AED onramp ref
    aedAmount?: number;
    aedToUsdRate?: number;
    // USDC tx hash for crypto rail legs
    txHash?: string;
    confirmations?: number;
    // Spend
    merchant?: string;
    merchantCity?: string;
    cardId?: string;
    originalAmount?: number;
    originalCurrency?: string;
    fxRate?: number;
    // Stablecoin card auth-time conversion
    authConversion?: {
      usdcSpent: number;
      usdEquivalent: number;
      rate: number;
    };
    // Convert
    fromRail?: Rail;
    toRail?: Rail;
    fromAmount?: number;
    toAmount?: number;
    rate?: number;
    // Invest
    instrumentSymbol?: string;
    instrumentKind?: "equity" | "xstock" | "commodity-token";
    fillPrice?: number;
    quantity?: number;
    // Earn
    earnProductId?: string;
    earnProductName?: string;
    apyAtAction?: number;
    // Futures
    futuresSymbol?: string;
    futuresSide?: "long" | "short";
    leverage?: number;
  };
}

export type PersonaKey = "stablecoin" | "active" | "power";

/**
 * Which rails the user has access to. Determined at KYC.
 *  - Full KYC pass → both rails (fiat + stablecoin)
 *  - Limited KYC pass → stablecoin only (no UAE bank rail)
 *
 * Stablecoin-only users should not see fiat surfaces anywhere in the app.
 * The UX otherwise stays identical.
 */
export interface ProductAccess {
  fiat: boolean;
  stablecoin: boolean;
}

export interface User {
  id: string;
  personaKey: PersonaKey;
  name: string;
  emiratesId: string; // masked
  email: string;
  phone: string;
  kycTier: KycTier;
  productAccess: ProductAccess;
  joinedAt: string;
  // Rails (USD only present when productAccess.fiat is true)
  usdAccount: {
    virtualIban: string;
    bankName: string;
    swiftCode: string;
    balance: number;
  } | null;
  usdcWallet: {
    address: string; // base address
    balance: number; // face value USDC
    network: "Base";
  };
  /**
   * Separate isolated wallet holding USDC collateral for futures positions.
   * Funded by transferring from the main usdcWallet. Per PRD §7.3 / §6.7,
   * keeping futures margin isolated from the spendable balance is required.
   */
  futuresWallet: {
    balance: number; // free USDC available as new margin
  };
  cards: Card[];
  holdings: Holding[];
  earnPositions: EarnPosition[];
  futuresPositions: FuturesPosition[];
  futuresOptIn: boolean;
  recentlyConvertedAt?: string;
}
