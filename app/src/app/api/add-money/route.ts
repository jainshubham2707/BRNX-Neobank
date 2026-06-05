import { NextResponse } from "next/server";
import { getActivePersonaKey } from "@/db/session";
import { getUserByPersona } from "@/db/queries";
import { addMoney } from "@/db/mutations";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const source = body.source as "swift" | "aed-onramp" | "usdc-deposit";
  const amount = Number(body.amount);
  if (
    (source !== "swift" && source !== "aed-onramp" && source !== "usdc-deposit") ||
    !Number.isFinite(amount)
  ) {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
  const user = await getUserByPersona(await getActivePersonaKey());
  if (!user) return NextResponse.json({ error: "no user" }, { status: 404 });

  try {
    const tx = await addMoney({
      userId: user.id,
      source,
      amount,
      aedAmount: body.aedAmount,
      aedRate: body.aedRate,
      destination: body.destination,
    });
    return NextResponse.json({ ok: true, tx });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "add-money failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
