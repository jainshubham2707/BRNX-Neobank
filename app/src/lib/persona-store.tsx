"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { PersonaKey, Transaction, User } from "./types";

type PersonaContextValue = {
  personaKey: PersonaKey;
  user: User | null;
  transactions: Transaction[];
  loading: boolean;
  setPersonaKey: (key: PersonaKey) => Promise<void>;
  /** Refetch /api/me after a mutation so balances/holdings update. */
  refresh: () => Promise<void>;
  /** Convenience: client-side optimistic insert (no DB write). Server is the
   *  source of truth — call refresh() after the mutation returns. */
  pushTransaction: (tx: Transaction) => void;
};

const PersonaContext = createContext<PersonaContextValue | null>(null);

export function PersonaProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [personaKey, setPersonaKeyState] = useState<PersonaKey>("active");
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const r = await fetch("/api/me", { cache: "no-store" });
    if (!r.ok) {
      setLoading(false);
      return;
    }
    const data = (await r.json()) as { user: User; transactions: Transaction[] };
    setUser(data.user);
    setTransactions(data.transactions);
    setPersonaKeyState(data.user.personaKey);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const setPersonaKey = useCallback(
    async (key: PersonaKey) => {
      setLoading(true);
      await fetch("/api/persona", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });
      await refresh();
    },
    [refresh]
  );

  const pushTransaction = useCallback((tx: Transaction) => {
    setTransactions((prev) => [tx, ...prev]);
  }, []);

  const value = useMemo<PersonaContextValue>(
    () => ({
      personaKey,
      user,
      transactions,
      loading,
      setPersonaKey,
      refresh,
      pushTransaction,
    }),
    [personaKey, user, transactions, loading, setPersonaKey, refresh, pushTransaction]
  );

  return (
    <PersonaContext.Provider value={value}>{children}</PersonaContext.Provider>
  );
}

export function usePersona() {
  const ctx = useContext(PersonaContext);
  if (!ctx) throw new Error("usePersona must be used inside <PersonaProvider>");
  return ctx;
}

/**
 * Returns the loaded user. Throws if called before the user is hydrated —
 * pages should only render below <Gate> in the (app) layout, which ensures
 * the user is non-null by the time children mount.
 */
export function useUser() {
  const { user } = usePersona();
  if (!user) {
    throw new Error("useUser must be called after persona is loaded");
  }
  return user;
}
