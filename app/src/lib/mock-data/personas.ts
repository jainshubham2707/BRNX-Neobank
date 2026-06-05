import type { PersonaKey, User } from "../types";

const now = (offsetHours: number) =>
  new Date(Date.now() - offsetHours * 3_600_000).toISOString();

/**
 * Three demo personas. The signin screen routes by phone number.
 *  - stablecoin (Aman): limited KYC → stablecoin-only. No USD account, no
 *    fiat card. UX stays the same shape; fiat surfaces are hidden.
 *  - active   (John):   full KYC → both rails, typical balances.
 *  - power    (Karim):  full KYC → both rails, full portfolio across Cash,
 *    Invest, Earn, and Futures.
 */
export const PERSONAS: Record<PersonaKey, User> = {
  // ─────────────────────────────────────────────────────────────────
  // STABLECOIN-ONLY
  // ─────────────────────────────────────────────────────────────────
  stablecoin: {
    id: "u_stablecoin",
    personaKey: "stablecoin",
    name: "Aman Verma",
    emiratesId: "—",
    email: "aman.v@example.ae",
    phone: "+971 50 555 0118",
    kycTier: "base",
    productAccess: { fiat: false, stablecoin: true },
    joinedAt: now(24 * 14),
    usdAccount: null,
    usdcWallet: {
      address: "0x4f8a2b3c5d6e7f8091a2b3c4d5e6f7081928374a",
      balance: 3_410.55,
      network: "Base",
    },
    futuresWallet: { balance: 0 },
    cards: [
      {
        id: "card_c_stable",
        rail: "USDC",
        label: "Stablecoin card",
        last4: "8819",
        expMonth: 11,
        expYear: 28,
        network: "Visa",
        frozen: false,
        limits: { daily: 5_000, monthly: 25_000 },
        channels: { online: true, contactless: true, atm: true, international: true },
        isDefault: true,
      },
    ],
    holdings: [
      {
        id: "h_paxg_s",
        symbol: "PAXG",
        name: "Gold (PAX Gold)",
        rail: "USDC",
        kind: "commodity-token",
        quantity: 0.4,
        avgCost: 2_640.0,
        lastPrice: 2_705.4,
        changePct: 0.46,
      },
    ],
    earnPositions: [
      {
        id: "ep_usdc_t_s",
        productId: "stablecoin-treasury",
        productName: "USDC Treasury",
        rail: "USDC",
        kind: "stablecoin-treasury",
        riskTier: "low",
        principal: 1_500,
        accrued: 8.21,
        apyAtDeposit: 4.8,
        liveApy: 4.85,
        startedAt: now(24 * 18),
      },
    ],
    futuresPositions: [],
    futuresOptIn: false,
  },

  // ─────────────────────────────────────────────────────────────────
  // ACTIVE — both rails
  // ─────────────────────────────────────────────────────────────────
  active: {
    id: "u_active",
    personaKey: "active",
    name: "John Hull",
    emiratesId: "784-•••-•••-7740",
    email: "reem@example.ae",
    phone: "+971 56 555 0140",
    kycTier: "enhanced",
    productAccess: { fiat: true, stablecoin: true },
    joinedAt: now(24 * 90),
    usdAccount: {
      virtualIban: "AE48 0860 0000 7740 7740 220",
      bankName: "Partner Bank",
      swiftCode: "PTBKAEADXXX",
      balance: 15_062.0,
    },
    usdcWallet: {
      address: "0x77a8b2c4d5e6f7081928374659abcdef01234567",
      balance: 9_256.5,
      network: "Base",
    },
    futuresWallet: { balance: 0 },
    cards: [
      {
        id: "card_f_active",
        rail: "USD",
        label: "Fiat card",
        last4: "1077",
        expMonth: 9,
        expYear: 28,
        network: "Visa",
        frozen: false,
        limits: { daily: 5_000, monthly: 25_000 },
        channels: { online: true, contactless: true, atm: true, international: true },
        isDefault: true,
      },
      {
        id: "card_c_active",
        rail: "USDC",
        label: "Stablecoin card",
        last4: "2244",
        expMonth: 9,
        expYear: 28,
        network: "Visa",
        frozen: false,
        limits: { daily: 5_000, monthly: 25_000 },
        channels: { online: true, contactless: true, atm: true, international: true },
        isDefault: false,
      },
    ],
    holdings: [
      {
        id: "h_aapl",
        symbol: "AAPL",
        name: "Apple Inc.",
        rail: "USD",
        kind: "equity",
        quantity: 5.04,
        avgCost: 198.1,
        lastPrice: 232.41,
        changePct: 0.82,
      },
      {
        id: "h_coinx",
        symbol: "COINx",
        name: "Coinbase Global",
        rail: "USDC",
        kind: "xstock",
        quantity: 4.5,
        avgCost: 285.4,
        lastPrice: 311.83,
        changePct: 2.29,
      },
    ],
    earnPositions: [
      {
        id: "ep_fiat_t",
        productId: "fiat-treasury",
        productName: "US T-Bill",
        rail: "USD",
        kind: "fiat-treasury",
        riskTier: "low",
        principal: 4_000,
        accrued: 8.05,
        apyAtDeposit: 3.5,
        liveApy: 3.5,
        startedAt: now(24 * 21),
      },
    ],
    futuresPositions: [],
    futuresOptIn: false,
    recentlyConvertedAt: now(3),
  },

  // ─────────────────────────────────────────────────────────────────
  // POWER — both rails, everything on
  // ─────────────────────────────────────────────────────────────────
  power: {
    id: "u_power",
    personaKey: "power",
    name: "Karim Khoury",
    emiratesId: "784-•••-•••-0042",
    email: "karim@example.ae",
    phone: "+971 50 555 0042",
    kycTier: "enhanced",
    productAccess: { fiat: true, stablecoin: true },
    joinedAt: now(24 * 365),
    usdAccount: {
      virtualIban: "AE48 0860 0042 0042 0042 042",
      bankName: "Partner Bank",
      swiftCode: "PTBKAEADXXX",
      balance: 38_412.55,
    },
    usdcWallet: {
      address: "0x42df8aa1c2b3c4d5e6f7081928374659ab00ff42",
      balance: 28_904.18,
      network: "Base",
    },
    futuresWallet: { balance: 1_250.0 },
    cards: [
      {
        id: "card_f_power",
        rail: "USD",
        label: "Fiat card",
        last4: "0042",
        expMonth: 4,
        expYear: 29,
        network: "Visa",
        frozen: false,
        limits: { daily: 15_000, monthly: 75_000 },
        channels: { online: true, contactless: true, atm: true, international: true },
        isDefault: false,
      },
      {
        id: "card_c_power",
        rail: "USDC",
        label: "Stablecoin card",
        last4: "4242",
        expMonth: 4,
        expYear: 29,
        network: "Visa",
        frozen: false,
        limits: { daily: 15_000, monthly: 75_000 },
        channels: { online: true, contactless: true, atm: true, international: true },
        isDefault: true,
      },
    ],
    holdings: [
      {
        id: "h_aapl",
        symbol: "AAPL",
        name: "Apple Inc.",
        rail: "USD",
        kind: "equity",
        quantity: 22.5,
        avgCost: 178.42,
        lastPrice: 232.41,
        changePct: 0.82,
      },
      {
        id: "h_nvda",
        symbol: "NVDA",
        name: "NVIDIA Corporation",
        rail: "USD",
        kind: "equity",
        quantity: 41.2,
        avgCost: 102.18,
        lastPrice: 146.07,
        changePct: 2.14,
      },
      {
        id: "h_msft",
        symbol: "MSFT",
        name: "Microsoft Corp.",
        rail: "USD",
        kind: "equity",
        quantity: 8.0,
        avgCost: 412.55,
        lastPrice: 446.92,
        changePct: -0.21,
      },
      {
        id: "h_tslax",
        symbol: "TSLAx",
        name: "Tesla, Inc.",
        rail: "USDC",
        kind: "xstock",
        quantity: 7.0,
        avgCost: 287.91,
        lastPrice: 322.1,
        changePct: -1.42,
      },
      {
        id: "h_paxg",
        symbol: "PAXG",
        name: "Gold (PAX Gold)",
        rail: "USDC",
        kind: "commodity-token",
        quantity: 1.85,
        avgCost: 2_412.0,
        lastPrice: 2_705.4,
        changePct: 0.46,
      },
    ],
    earnPositions: [
      {
        id: "ep_fiat_t",
        productId: "fiat-treasury",
        productName: "US T-Bill",
        rail: "USD",
        kind: "fiat-treasury",
        riskTier: "low",
        principal: 12_000,
        accrued: 92.05,
        apyAtDeposit: 3.5,
        liveApy: 3.5,
        startedAt: now(24 * 80),
      },
      {
        id: "ep_usdc_t",
        productId: "stablecoin-treasury",
        productName: "USDC Treasury",
        rail: "USDC",
        kind: "stablecoin-treasury",
        riskTier: "low",
        principal: 5_000,
        accrued: 41.91,
        apyAtDeposit: 4.8,
        liveApy: 4.85,
        startedAt: now(24 * 60),
      },
      {
        id: "ep_morpho",
        productId: "morpho-lending",
        productName: "USDC Lending",
        rail: "USDC",
        kind: "lending-vault",
        riskTier: "medium",
        principal: 8_000,
        accrued: 96.4,
        apyAtDeposit: 6.1,
        liveApy: 6.0,
        startedAt: now(24 * 32),
      },
    ],
    futuresPositions: [
      {
        id: "f_tsla_fut",
        symbol: "TSLA-FUT",
        name: "Tesla equity future",
        side: "long",
        size: 12_000,
        entry: 308.4,
        mark: 322.5,
        liqPrice: 246.7,
        leverage: 5,
        marginUSDC: 2_400,
        pnl: 345.4,
        pnlPct: 14.39,
      },
      {
        id: "f_aapl_pre",
        symbol: "PRE-OPENAI",
        name: "OpenAI pre-IPO future",
        side: "long",
        size: 4_000,
        entry: 1_280.0,
        mark: 1_215.0,
        liqPrice: 720.0,
        leverage: 3,
        marginUSDC: 1_333,
        pnl: -208.2,
        pnlPct: -15.6,
      },
    ],
    futuresOptIn: true,
    recentlyConvertedAt: now(14),
  },
};

export const PERSONA_KEYS: PersonaKey[] = ["stablecoin", "active", "power"];

export function getPersona(key: PersonaKey): User {
  return PERSONAS[key];
}

/** Lookup helper for /signin — match by phone number tail digits. */
export function findPersonaByPhone(phone: string): PersonaKey | null {
  const digits = phone.replace(/\D/g, "");
  for (const key of PERSONA_KEYS) {
    const pd = PERSONAS[key].phone.replace(/\D/g, "");
    if (digits.length >= 6 && pd.endsWith(digits.slice(-6))) return key;
  }
  return null;
}
