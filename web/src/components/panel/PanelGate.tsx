"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { PanelShell } from "@/components/panel/PanelShell";
import { ensureStaffSession, signOutStaff } from "@/lib/panel-api";
import { hasSupabaseConfig } from "@/lib/supabase/client";

export function PanelGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!hasSupabaseConfig()) {
        setError(
          "Supabase yapılandırması yok. web/.env.local içine NEXT_PUBLIC_SUPABASE_URL ve NEXT_PUBLIC_SUPABASE_ANON_KEY ekleyin.",
        );
        setReady(true);
        setAuthed(false);
        if (pathname !== "/panel/giris") router.replace("/panel/giris");
        return;
      }

      try {
        const check = await ensureStaffSession();
        if (cancelled) return;
        setAuthed(check.ok);
        setReady(true);
        if (!check.ok && pathname !== "/panel/giris") {
          router.replace("/panel/giris");
        }
        if (check.ok && pathname === "/panel/giris") {
          router.replace("/panel");
        }
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Auth hatası");
        setAuthed(false);
        setReady(true);
        if (pathname !== "/panel/giris") router.replace("/panel/giris");
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [pathname, router]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-soft text-sm text-ink-muted">
        Yükleniyor…
      </div>
    );
  }

  if (pathname === "/panel/giris") {
    return <>{children}</>;
  }

  if (!authed) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-2 bg-surface-soft px-4 text-center text-sm text-ink-muted">
        <p>Yönlendiriliyor…</p>
        {error && <p className="text-rose-600">{error}</p>}
      </div>
    );
  }

  return <PanelShell>{children}</PanelShell>;
}

export async function panelLogout() {
  try {
    await signOutStaff();
  } catch {
    // ignore
  }
}
