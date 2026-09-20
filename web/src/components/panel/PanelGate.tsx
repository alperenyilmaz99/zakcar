"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { PanelShell } from "@/components/panel/PanelShell";

const AUTH_KEY = "zakcar-panel-auth";

export function PanelGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const ok = sessionStorage.getItem(AUTH_KEY) === "1";
    setAuthed(ok);
    setReady(true);
    if (!ok && pathname !== "/panel/giris") {
      router.replace("/panel/giris");
    }
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
      <div className="flex min-h-screen items-center justify-center bg-surface-soft text-sm text-ink-muted">
        Yönlendiriliyor…
      </div>
    );
  }

  return <PanelShell>{children}</PanelShell>;
}

export function setPanelAuth(value: boolean) {
  if (value) sessionStorage.setItem(AUTH_KEY, "1");
  else sessionStorage.removeItem(AUTH_KEY);
}
