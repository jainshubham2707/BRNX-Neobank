import { NextResponse } from "next/server";
import { getActivePersonaKey } from "@/db/session";
import { getUserByPersona } from "@/db/queries";
import { trade } from "@/db/mutations";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const symbol = body.symbol;
  const side = body.side as "buy" | "sell";
  const amount = Number(body.amount);
  if (
    typeof symbol !== "string" ||
    (side !== "buy" && side !== "sell") ||
    !Number.isFinite(amount)
  ) {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
  const user = await getUserByPersona(await getActivePersonaKey());
  if (!user) return NextResponse.json({ error: "no user" }, { status: 404 });

  try {
    const tx = await trade({ userId: user.id, symbol, side, amount });
    return NextResponse.json({ ok: true, tx });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "trade failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
