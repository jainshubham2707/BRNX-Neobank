export type Instrument = {
  symbol: string;
  /** Symbol prefix without the tokenized "x" suffix. */
  base: string;
  name: string;
  kind: "equity" | "xstock" | "commodity-token";
  rail: "USD" | "USDC";
  price: number;
  changePct: number;
  sector?: string;
  /** Brand domain used to render the company logo via Clearbit. */
  domain: string;
  /** Fallback monogram color when logo fails to load. */
  brandColor: string;
};

/** Twelve household-name companies, available on both rails. */
const COMPANIES = [
  { base: "AAPL", name: "Apple Inc.", domain: "apple.com", brandColor: "#0B0B0B", sector: "Tech", price: 232.41, changePct: 0.82 },
  { base: "NVDA", name: "NVIDIA Corporation", domain: "nvidia.com", brandColor: "#76B900", sector: "Tech", price: 146.07, changePct: 2.14 },
  { base: "MSFT", name: "Microsoft Corp.", domain: "microsoft.com", brandColor: "#0078D4", sector: "Tech", price: 446.92, changePct: -0.21 },
  { base: "GOOGL", name: "Alphabet (Google)", domain: "google.com", brandColor: "#4285F4", sector: "Tech", price: 188.40, changePct: 0.97 },
  { base: "MSTR", name: "Strategy (MicroStrategy)", domain: "strategy.com", brandColor: "#F7931A", sector: "Tech", price: 412.55, changePct: 3.18 },
  { base: "META", name: "Meta Platforms", domain: "meta.com", brandColor: "#0866FF", sector: "Tech", price: 624.10, changePct: 0.42 },
  { base: "SMSN", name: "Samsung Electronics", domain: "samsung.com", brandColor: "#1428A0", sector: "Tech", price: 64.18, changePct: 1.05 },
  { base: "SKHY", name: "SK Hynix", domain: "skhynix.com", brandColor: "#D2222D", sector: "Tech", price: 198.30, changePct: 1.85 },
  { base: "TSLA", name: "Tesla, Inc.", domain: "tesla.com", brandColor: "#CC0000", sector: "Auto", price: 322.55, changePct: -1.35 },
  { base: "INTC", name: "Intel Corporation", domain: "intel.com", brandColor: "#0071C5", sector: "Tech", price: 24.18, changePct: -0.42 },
  { base: "CRCL", name: "Circle Internet Group", domain: "circle.com", brandColor: "#3A5BFB", sector: "Fintech", price: 142.80, changePct: 4.21 },
  { base: "COIN", name: "Coinbase Global", domain: "coinbase.com", brandColor: "#0052FF", sector: "Fintech", price: 312.45, changePct: 2.34 },
] as const;

const fiat: Instrument[] = COMPANIES.map((c) => ({
  symbol: c.base,
  base: c.base,
  name: c.name,
  kind: "equity",
  rail: "USD",
  price: c.price,
  changePct: c.changePct,
  sector: c.sector,
  domain: c.domain,
  brandColor: c.brandColor,
}));

const tokenized: Instrument[] = COMPANIES.map((c) => ({
  symbol: `${c.base}x`,
  base: c.base,
  // Same display name as the fiat equity — only the rail differs.
  name: c.name,
  kind: "xstock",
  rail: "USDC",
  // Tokenized prices typically trail the live equity by a few basis points.
  price: +(c.price * 0.998).toFixed(2),
  changePct: +(c.changePct - 0.05).toFixed(2),
  sector: c.sector,
  domain: c.domain,
  brandColor: c.brandColor,
}));

const commodities: Instrument[] = [
  {
    symbol: "PAXG",
    base: "PAXG",
    name: "Gold (PAX Gold)",
    kind: "commodity-token",
    rail: "USDC",
    price: 2_705.4,
    changePct: 0.46,
    sector: "Commodity",
    domain: "paxos.com",
    brandColor: "#D4AF37",
  },
];

export const INSTRUMENTS: Instrument[] = [...fiat, ...tokenized, ...commodities];

export function findInstrument(symbol: string): Instrument | undefined {
  return INSTRUMENTS.find((i) => i.symbol === symbol);
}

/** Clearbit logo URL — returns the company's primary brand mark. */
export function logoUrl(domain: string): string {
  return `https://logo.clearbit.com/${domain}`;
}
