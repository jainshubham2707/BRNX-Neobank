# BRNX — mock prototype

A clickable, DB-backed prototype of the BRNX dual-rail neobank described
in `../Dual-Rail-Neobank-PRD.docx`, styled to the brand identity in
`../borderless-brand-identity.html`.

No backend, no integrations, no database. All state lives in TypeScript files
under `src/lib/mock-data` plus `localStorage` for persona selection.

## Run

```sh
cd app
npm install
npm run dev
```

Open <http://localhost:3000>. On desktop the app renders inside a phone frame;
on mobile it fills the screen.

## Demo flow

1. `/start` → "Sign in or create account"
2. `/signin` — enter any UAE mobile number (or tap one of the three demo
   numbers shown on the page).
3. `/signin/otp` — any 6-digit code works.
4. If the phone matches a demo persona, you land at `/home`. Otherwise you go
   through `/onboarding` and the chosen KYC tier picks the persona for you.

You can switch persona any time from **Profile → Demo · persona switcher**.

## Personas

| Persona            | Phone (UAE)        | KYC      | Access                |
| ------------------ | ------------------ | -------- | --------------------- |
| **Aman Verma**     | `+971 50 555 0118` | Base     | Stablecoin only       |
| **Reem Al Suwaidi**| `+971 56 555 0140` | Enhanced | Both rails (active)   |
| **Karim Khoury**   | `+971 50 555 0042` | Enhanced | Both rails + futures  |

For the stablecoin-only persona, all fiat surfaces (USD account, fiat card,
SWIFT inbound, AED onramp, Convert, US equities, USD Treasury) are hidden.
The UX otherwise remains identical.

## Stack

- **Next.js 15** (App Router) + **React 19**
- **TypeScript** strict mode
- **Tailwind CSS 3** with brand tokens from the identity file
- Fonts: Sora (display), Hanken Grotesk (UI), IBM Plex Mono (numbers)

## Project layout

```
src/
  app/
    start/                Landing page (signed out)
    signin/, /otp         Phone + OTP signin
    onboarding/           Multi-step KYC + dual-rail provisioning saga
    (app)/                Authenticated shell — TabBar + PersonaProvider
      home/               Unified balance + quick actions + recent activity
      add-money/          SWIFT, AED→USD, USDC deposit
      convert/            The signature USD ⇄ USDC flow
      cards/, /[id]       Fiat + Crypto cards, controls
      invest/, /[symbol]  Equities + tokenized assets
      futures/            Hyperliquid-routed futures (opt-in gated)
      earn/               Treasury + Morpho lending vault
      activity/, /[id]    Unified transaction feed + per-tx detail
      profile/            KYC tier, security, export key, persona switcher
  components/
    brand/                Mark, Logo, PhoneFrame
    ui/                   Button, Card, Money, Chip, StatusPill, RailBadge,
                          TxRow, TopBar, TabBar, Sheet, AmountInput, KeyValue
    home/, convert/, ...  Per-feature pieces
  lib/
    types.ts              Domain model (mirrors PRD ledger)
    format.ts             Money / hash / date formatters (tabular numerals)
    persona-store.tsx     React context + localStorage for active persona
    mock-data/            personas.ts, transactions.ts, instruments.ts,
                          earn-products.ts
```

## Domain model

Types in `src/lib/types.ts` mirror the PRD's ledger so real APIs can be swapped
in later without UI changes:

- `Rail = "USD" | "USDC"` — every entry has a rail (convert is `"mixed"`)
- `TxStatus = "pending" | "settling" | "settled" | "failed"` — the honest
  Convert state machine from §6.4
- `User.productAccess.fiat` — drives whether fiat surfaces render at all

## What is mocked

- All authentication (any OTP works)
- KYC checks (deterministic timeouts)
- Convert settlement (~2s simulated)
- Order fills, yield accrual, on-chain confirmations
- Card auth-time conversion math (uses a fixed rate)

## What is real

- The visual design system, typography, and color tokens
- Domain types and the ledger-shaped data
- The flows themselves: states, copy, gating logic, and navigation

## Brand notes

- Two blues do the heavy lifting — `#075ABD` (Borderless Blue) and `#054086`
  (Deep Blue). Gradients use `120deg, deep → blue`.
- Numbers are always set in IBM Plex Mono with tabular numerals so amounts
  line up. The `Money` component enforces this.
- Voice: direct, plain, present tense. "Convert USD to USDC", not
  "Initiate cross-rail liquidity transfer."
