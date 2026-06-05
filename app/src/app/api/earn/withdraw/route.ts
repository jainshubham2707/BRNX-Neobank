import { NextResponse } from "next/server";
import { getActivePersonaKey } from "@/db/session";
import { getUserByPersona } from "@/db/queries";
import { withdrawFromEarn } from "@/db/mutations";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const positionId = body.positionId;
  const amount = Number(body.amount);
  if (typeof positionId !== "string" || !Number.isFinite(amount)) {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
  const user = await getUserByPersona(await getActivePersonaKey());
  if (!user) return NextResponse.json({ error: "no user" }, { status: 404 });

  try {
    const tx = await withdrawFromEarn({ userId: user.id, positionId, amount });
    return NextResponse.json({ ok: true, tx });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "withdraw failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
