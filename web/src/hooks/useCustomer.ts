"use client";

import { useCallback, useEffect, useState } from "react";

const ACCOUNTS_KEY = "zakcar_accounts";
const SESSION_KEY = "zakcar_session";

export type Customer = { name: string; email: string };
type Account = Customer & { password: string };

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function useCustomer() {
  const [user, setUser] = useState<Customer | null>(null);

  const sync = useCallback(() => {
    const session = readJson<Customer | null>(SESSION_KEY, null);
    setUser(session?.email ? session : null);
  }, []);

  useEffect(() => {
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("zakcar-session", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("zakcar-session", sync);
    };
  }, [sync]);

  const register = useCallback((name: string, email: string, password: string) => {
    const accounts = readJson<Account[]>(ACCOUNTS_KEY, []);
    if (accounts.some((a) => a.email.toLowerCase() === email.toLowerCase())) {
      throw new Error("exists");
    }
    accounts.push({ name, email, password });
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
    const session = { name, email };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setUser(session);
    window.dispatchEvent(new Event("zakcar-session"));
  }, []);

  const login = useCallback((email: string, password: string) => {
    const accounts = readJson<Account[]>(ACCOUNTS_KEY, []);
    const match = accounts.find(
      (a) => a.email.toLowerCase() === email.toLowerCase() && a.password === password,
    );
    if (!match) throw new Error("invalid");
    const session = { name: match.name, email: match.email };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setUser(session);
    window.dispatchEvent(new Event("zakcar-session"));
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
    window.dispatchEvent(new Event("zakcar-session"));
  }, []);

  return { user, login, register, logout };
}
