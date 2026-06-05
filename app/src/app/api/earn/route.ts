import { NextResponse } from "next/server";
import { getActivePersonaKey } from "@/db/session";
import { getUserByPersona } from "@/db/queries";
import { moveToEarn } from "@/db/mutations";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const productId = body.productId;
  const amount = Number(body.amount);
  if (typeof productId !== "string" || !Number.isFinite(amount)) {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
  const user = await getUserByPersona(await getActivePersonaKey());
  if (!user) return NextResponse.json({ error: "no user" }, { status: 404 });

  try {
    const tx = await moveToEarn({ userId: user.id, productId, amount });
    return NextResponse.json({ ok: true, tx });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "earn failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
