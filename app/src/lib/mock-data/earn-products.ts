import type { EarnProduct } from "../types";

export const EARN_PRODUCTS: EarnProduct[] = [
  {
    id: "fiat-treasury",
    name: "US T-Bill",
    rail: "USD",
    kind: "fiat-treasury",
    riskTier: "low",
    netApy: 3.5,
    apyMin: 3.5,
    apyMax: 3.5,
    fixedRate: true,
    description:
      "Idle USD parked in short-duration US Treasury bills. Daily liquidity.",
    riskNote:
      "Backed by US government debt. Rate is fixed at purchase and held to maturity.",
  },
  {
    id: "stablecoin-treasury",
    name: "USDC Treasury",
    rail: "USDC",
    kind: "stablecoin-treasury",
    riskTier: "low",
    netApy: 4.85,
    apyMin: 4.6,
    apyMax: 5.05,
    description:
      "USDC posted to a tokenized T-Bill vault. Withdraw any time, settles same-day.",
    riskNote:
      "Underlying assets are short-duration treasuries. Smart-contract risk on the vault.",
  },
  {
    id: "morpho-lending",
    name: "USDC Lending",
    rail: "USDC",
    kind: "lending-vault",
    riskTier: "medium",
    netApy: 6.0,
    apyMin: 5.2,
    apyMax: 7.4,
    description:
      "USDC supplied to a curated lending vault. Variable, market-driven yield.",
    riskNote:
      "Over-collateralized lending against blue-chip crypto assets. Liquidation and smart-contract risk apply. You bear the risk.",
    capPerUser: 50_000,
  },
];
