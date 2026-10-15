"use client";

import { useCallback, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient, hasSupabaseConfig } from "@/lib/supabase/client";

const LEGACY_ACCOUNTS = "zakcar_accounts";
const LEGACY_SESSION = "zakcar_session";

export type Customer = { id: string; name: string; email: string };

function toCustomer(user: User | null | undefined): Customer | null {
  if (!user?.email) return null;
  const meta = user.user_metadata as { full_name?: string } | undefined;
  const name = meta?.full_name?.trim() || user.email.split("@")[0];
  return { id: user.id, name, email: user.email };
}

export function useCustomer() {
  const [user, setUser] = useState<Customer | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      localStorage.removeItem(LEGACY_ACCOUNTS);
      localStorage.removeItem(LEGACY_SESSION);
    } catch {
      /* tarayıcı depolaması kapalı olabilir */
    }

    if (!hasSupabaseConfig()) {
      setReady(true);
      return;
    }

    const supabase = createClient();
    let cancelled = false;

    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      setUser(toCustomer(data.session?.user));
      setReady(true);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(toCustomer(session?.user));
      setReady(true);
    });

    return () => {
      cancelled = true;
      subscription.subscription.unsubscribe();
    };
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    if (!hasSupabaseConfig()) throw new Error("config");
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { full_name: name.trim() } },
    });
    if (error) {
      const message = error.message.toLowerCase();
      if (message.includes("already")) throw new Error("exists");
      if (message.includes("confirm")) throw new Error("confirm");
      throw new Error("invalid");
    }
    if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
      throw new Error("exists");
    }
    if (!data.session) throw new Error("confirm");
    setUser(toCustomer(data.session.user));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    if (!hasSupabaseConfig()) throw new Error("config");
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error) {
      const message = error.message.toLowerCase();
      if (message.includes("confirm")) throw new Error("confirm");
      throw new Error("invalid");
    }
    setUser(toCustomer(data.user));
  }, []);

  const logout = useCallback(async () => {
    if (!hasSupabaseConfig()) {
      setUser(null);
      return;
    }
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  const accessToken = useCallback(async () => {
    if (!hasSupabaseConfig()) return null;
    const supabase = createClient();
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? null;
  }, []);

  return { user, ready, login, register, logout, accessToken };
}
