import { NextResponse } from "next/server";
import { getActivePersonaKey } from "@/db/session";
import { getUserByPersona } from "@/db/queries";
import { loadFuturesWallet } from "@/db/mutations";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const amount = Number(body.amount);
  if (!Number.isFinite(amount)) {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
  const user = await getUserByPersona(await getActivePersonaKey());
  if (!user) return NextResponse.json({ error: "no user" }, { status: 404 });

  try {
    const tx = await loadFuturesWallet({ userId: user.id, amount });
    return NextResponse.json({ ok: true, tx });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "load failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
