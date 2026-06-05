# BRNX — Dual-Rail Neobank (UAE)

A clickable, DB-backed prototype of **BRNX**, a UAE-targeted neobank with
two synchronized money rails behind one balance: a USD account and a USDC
wallet.

## Layout

```
.
├── Dual-Rail-Neobank-PRD.docx        Product requirements doc
├── borderless-brand-identity.html    Brand identity (palette, type, voice)
├── Borderless Logo.png               Brand mark
└── app/                              Next.js + TS + Tailwind app
    ├── src/
    │   ├── app/                      Routes (App Router)
    │   ├── components/               UI primitives, brand, feature pieces
    │   ├── db/                       Drizzle schema, queries, mutations, seed
    │   └── lib/                      Domain types, formatters, persona store
    └── drizzle/                      Generated migrations
```

## Run locally

```sh
cd app
npm install
cp .env.local.example .env.local        # then paste your DATABASE_URL
npm run db:push                         # push schema to Neon
npm run db:seed                         # seed personas + catalog + history
npm run dev                             # http://localhost:3000
```

## Demo personas

- **Aman Verma** (`+971 50 555 0118`) — stablecoin-only access
- **John Hull** (`+971 56 555 0140`) — both rails, typical balances
- **Karim Khoury** (`+971 50 555 0042`) — both rails, full portfolio + futures

Sign in with any of the demo numbers; any 6-digit OTP works. The persona
switcher in Profile lets you flip between them at any time.

## Architecture notes

- **Database:** Neon Postgres via Drizzle ORM (`@neondatabase/serverless`).
  Schema in `app/src/db/schema.ts`. Queries return objects shaped exactly like
  the front-end domain types so the UI doesn't know the data source changed.
- **Session:** cookie `borderless_persona` holds the active persona key. The
  OTP verify and Profile persona switcher both flip it.
- **Mutations:** every action that should move money writes to Postgres and
  records a transaction. Convert, Add Money, Trade, Earn move/withdraw,
  Futures opt-in / load / withdraw, Send to bank / wallet — all atomic
  per-row updates with a transaction history row appended.
- **UI:** mobile-first inside a phone-frame on desktop. Two-blue brand
  palette, Sora display, Hanken Grotesk body, IBM Plex Mono for numbers.

See `app/README.md` for more detail.
