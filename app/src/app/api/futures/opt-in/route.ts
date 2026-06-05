import { NextResponse } from "next/server";
import { getActivePersonaKey } from "@/db/session";
import { getUserByPersona } from "@/db/queries";
import { optInFutures } from "@/db/mutations";

export const dynamic = "force-dynamic";

export async function POST() {
  const user = await getUserByPersona(await getActivePersonaKey());
  if (!user) return NextResponse.json({ error: "no user" }, { status: 404 });
  await optInFutures(user.id);
  return NextResponse.json({ ok: true });
}
