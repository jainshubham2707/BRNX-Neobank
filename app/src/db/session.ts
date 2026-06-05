import { cookies } from "next/headers";
import type { PersonaKey } from "@/lib/types";

const COOKIE = "borderless_persona";
const FALLBACK: PersonaKey = "active";

function isKey(v: string | undefined): v is PersonaKey {
  return v === "stablecoin" || v === "active" || v === "power";
}

/** Read the active persona from the request cookie. */
export async function getActivePersonaKey(): Promise<PersonaKey> {
  const store = await cookies();
  const v = store.get(COOKIE)?.value;
  return isKey(v) ? v : FALLBACK;
}

export async function setActivePersonaKey(key: PersonaKey): Promise<void> {
  const store = await cookies();
  store.set(COOKIE, key, {
    path: "/",
    httpOnly: false, // mock — we want the client to be able to clear it
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearActivePersona(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE);
}

/** Map a phone number to a persona key by matching demo records. */
export function personaForPhone(
  phone: string,
  demoPhones: { key: PersonaKey; phone: string }[]
): PersonaKey | null {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 6) return null;
  for (const p of demoPhones) {
    const pd = p.phone.replace(/\D/g, "");
    if (pd.endsWith(digits.slice(-6))) return p.key;
  }
  return null;
}
