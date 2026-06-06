/**
 * Karim Khoury — the "power" persona from the live app. Values mirror
 * lib/mock-data/personas.ts so the video matches what you'd see in the app.
 */
export const KARIM = {
  name: "Karim Khoury",
  initials: "KK",
  phone: "+971 50 555 0042",
  emiratesId: "784-•••-•••-0042",
  email: "karim@example.ae",
  fiatUsd: 38_412.55,
  usdcUsdc: 28_904.18,
  futuresWallet: 1_250,
  iban: "AE48 0860 0042 0042 0042 042",
  swift: "PTBKAEADXXX",
  bank: "Partner Bank",
  usdcAddress: "0x42df8aa1c2b3c4d5e6f7081928374659ab00ff42",
  card: { last4: "0042", expMonth: 4, expYear: 29 },
  holdings: [
    { symbol: "AAPL", name: "Apple Inc.", qty: 22.5, avg: 178.42, last: 232.41, dayPct: 0.82 },
    { symbol: "NVDA", name: "NVIDIA Corporation", qty: 41.2, avg: 102.18, last: 146.07, dayPct: 2.14 },
    { symbol: "MSFT", name: "Microsoft Corp.", qty: 8.0, avg: 412.55, last: 446.92, dayPct: -0.21 },
    { symbol: "TSLAx", name: "Tesla, Inc.", qty: 7.0, avg: 287.91, last: 322.1, dayPct: -1.42, tokenized: true },
    { symbol: "PAXG", name: "Gold (PAX Gold)", qty: 1.85, avg: 2412.0, last: 2705.4, dayPct: 0.46, commodity: true },
  ],
  earn: [
    { name: "US T-Bill", rail: "USD", principal: 12_000, accrued: 92.05, rate: 3.5, fixed: true, tier: "low" },
    { name: "USDC Treasury", rail: "USDC", principal: 5_000, accrued: 41.91, rate: 4.85, fixed: false, tier: "low" },
    { name: "USDC Lending", rail: "USDC", principal: 8_000, accrued: 96.4, rate: 6.0, fixed: false, tier: "medium" },
  ],
  futures: [
    { symbol: "TSLA-FUT", side: "long", lev: 5, size: 12_000, margin: 2_400, mark: 322.5, entry: 308.4, liq: 246.7, pnl: 345.4, pnlPct: 14.39 },
    { symbol: "PRE-OPENAI", side: "long", lev: 3, size: 4_000, margin: 1_333, mark: 1_215.0, entry: 1_280.0, liq: 720.0, pnl: -208.2, pnlPct: -15.6 },
  ],
  activity: [
    { title: "TSLA-FUT · unrealized PnL", subtitle: "Long 5×", amount: 345.4, dir: "in", category: "futures", time: "1h ago" },
    { title: "Emirates Airlines", subtitle: "Stablecoin card · USDC→USD at auth", amount: -412.0, dir: "out", category: "spend", time: "5h ago" },
    { title: "Buy TSLAx", subtitle: "6.95 tokens @ $287.91", amount: -2_000, dir: "out", category: "invest", time: "10h ago" },
    { title: "Convert USDC → USD", subtitle: "Settled · UTR 5520", amount: 8_000, dir: "out", category: "convert", time: "14h ago" },
    { title: "Yield accrued · USDC Lending", subtitle: "6.00% APY (variable)", amount: 12.84, dir: "in", category: "earn", time: "20h ago" },
    { title: "SWIFT deposit · USD", subtitle: "UTR 9920 · salary", amount: 25_000, dir: "in", category: "load", time: "4d ago" },
  ],
} as const;

export const sumInvest = () =>
  KARIM.holdings.reduce((s, h) => s + h.qty * h.last, 0);
export const sumEarn = () =>
  KARIM.earn.reduce((s, p) => s + p.principal + p.accrued, 0);
export const sumFuturesValue = () =>
  KARIM.futuresWallet +
  KARIM.futures.reduce((s, p) => s + p.margin + p.pnl, 0);
export const cashTotal = () => KARIM.fiatUsd + KARIM.usdcUsdc;
