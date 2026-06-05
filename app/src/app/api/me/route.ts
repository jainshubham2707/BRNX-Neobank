import { NextResponse } from "next/server";
import { getActivePersonaKey } from "@/db/session";
import { getTransactionsForUser, getUserByPersona } from "@/db/queries";

export const dynamic = "force-dynamic";

export async function GET() {
  const key = await getActivePersonaKey();
  const user = await getUserByPersona(key);
  if (!user) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  const transactions = await getTransactionsForUser(user.id);
  return NextResponse.json({ user, transactions });
}
