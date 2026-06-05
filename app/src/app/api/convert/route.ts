import { NextResponse } from "next/server";
import { getActivePersonaKey } from "@/db/session";
import { getUserByPersona } from "@/db/queries";
import { convert } from "@/db/mutations";
import type { Rail } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const fromRail = body.fromRail as Rail;
  const amount = Number(body.amount);
  if ((fromRail !== "USD" && fromRail !== "USDC") || !Number.isFinite(amount)) {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
  const user = await getUserByPersona(await getActivePersonaKey());
  if (!user) return NextResponse.json({ error: "no user" }, { status: 404 });

  try {
    const tx = await convert({ userId: user.id, fromRail, amount });
    return NextResponse.json({ ok: true, tx });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "convert failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
