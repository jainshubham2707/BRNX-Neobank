# BRNX — Remotion product walkthrough

A 1920×1080 product walkthrough of the BRNX app, rendered with
[Remotion](https://www.remotion.dev/). Uses Karim Khoury's persona values
(the "power" user from the live app) end-to-end so the screens line up
with what you'd see at runtime.

## Run the studio

```sh
cd video
npm install
npm run dev          # Remotion Studio at http://localhost:3000
```

## Render to MP4

```sh
npm run build        # → out/brnx-journey.mp4
npm run build:webm   # → out/brnx-journey.webm
```

## Scene order

1. **Intro** — BRNX wordmark + "Hold dollars. Spend borderless."
2. **Sign in** — phone-number form, +971 50 555 0042 types in.
3. **OTP** — six cells fill one at a time with auto-advance.
4. **Home** — dual-rail cash balance, quick actions, net-worth bar.
5. **Add money** — To USD / To USDC option lists.
6. **AED onramp** — AED 5,000 → USDC at 3.6725.
7. **Convert** — 8,000 USDC → 7,993.60 USD.
8. **Cards** — Fiat card flips to reveal the Stablecoin card.
9. **Send** — wire to a bank from USD with beneficiary + IBAN + amount.
10. **Invest · Stocks** — fractional US equities catalog.
11. **Invest · xStocks** — tokenized equivalents settled in USDC.
12. **Futures** — futures wallet card, open positions, markets.
13. **Earn** — earning headline + three yield products.
14. **Activity** — unified feed with category filters.
15. **Outro** — closing brand card.

All scenes share a header strip on the left (eyebrow + title + description)
and the phone frame on the right. Transitions alternate fade and slide so
the rhythm doesn't get monotonous.

## Audio

Background music plays from `public/Audio/BGM-MUSIC.mp3` at 50% volume with
a one-second fade in and out at the edges.

## Customizing

- Per-scene timing lives in `src/Composition.tsx` under `SCENE_DURATIONS`.
- Karim's mock values are in `src/data.ts` — bump anything there and every
  scene picks it up automatically.
- Brand tokens are in `src/theme.ts` (kept in sync with the live app's
  `tailwind.config.ts`).
