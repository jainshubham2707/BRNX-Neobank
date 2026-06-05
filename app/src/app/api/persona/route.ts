import { NextResponse } from "next/server";
import {
  clearActivePersona,
  personaForPhone,
  setActivePersonaKey,
} from "@/db/session";
import { listDemoPhones } from "@/db/queries";

export const dynamic = "force-dynamic";

/** POST /api/persona  body: { key?: PersonaKey; phone?: string }
 *  Sets the active persona cookie. Either pass `key` directly (debug switcher)
 *  or `phone` to match a demo number (signin/OTP flow). */
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  if (body.key === "stablecoin" || body.key === "active" || body.key === "power") {
    await setActivePersonaKey(body.key);
    return NextResponse.json({ ok: true, key: body.key });
  }
  if (typeof body.phone === "string") {
    const phones = await listDemoPhones();
    const match = personaForPhone(body.phone, phones);
    if (match) {
      await setActivePersonaKey(match);
      return NextResponse.json({ ok: true, key: match, matched: true });
    }
    return NextResponse.json({ ok: false, matched: false });
  }
  return NextResponse.json({ error: "bad request" }, { status: 400 });
}

export async function DELETE() {
  await clearActivePersona();
  return NextResponse.json({ ok: true });
}
