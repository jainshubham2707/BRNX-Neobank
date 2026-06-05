import { NextResponse } from "next/server";
import { getActivePersonaKey } from "@/db/session";
import { getUserByPersona } from "@/db/queries";
import { sendOut } from "@/db/mutations";
import type { Rail } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  // Accept legacy `rail` for back-compat.
  const sourceRail = (body.sourceRail ?? body.rail) as Rail;
  const amount = Number(body.amount);
  const beneficiary = String(body.beneficiary ?? "").trim();
  const destination = String(body.destination ?? "").trim();
  const swift = body.swift ? String(body.swift).trim() : undefined;
  const memo = body.memo ? String(body.memo).trim() : undefined;

  if (
    (sourceRail !== "USD" && sourceRail !== "USDC") ||
    !Number.isFinite(amount) ||
    amount <= 0 ||
    !destination
  ) {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
  if (swift && !beneficiary) {
    return NextResponse.json(
      { error: "beneficiary required for bank wires" },
      { status: 400 }
    );
  }

  const user = await getUserByPersona(await getActivePersonaKey());
  if (!user) return NextResponse.json({ error: "no user" }, { status: 404 });

  try {
    const tx = await sendOut({
      userId: user.id,
      sourceRail,
      amount,
      beneficiary,
      destination,
      swift,
      memo,
    });
    return NextResponse.json({ ok: true, tx });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "send failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
