"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signInStaff } from "@/lib/panel-api";
import { hasSupabaseConfig } from "@/lib/supabase/client";
import { SITE } from "@/lib/constants";

export default function PanelLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!hasSupabaseConfig()) {
      setError("Supabase env eksik (.env.local).");
      return;
    }
    if (!email.trim() || !password.trim()) {
      setError("E-posta ve şifre gerekli.");
      return;
    }

    setLoading(true);
    try {
      await signInStaff(email.trim(), password);
      router.replace("/panel");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Giriş başarısız");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-surface-soft px-4">
      <div
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 20% 20%, rgba(41,112,255,0.18), transparent), radial-gradient(ellipse 60% 40% at 90% 80%, rgba(29,78,216,0.12), transparent)",
        }}
      />

      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <Image
            src="/assets/zakcar/logo.png"
            alt={SITE.shortName}
            width={140}
            height={42}
            className="mx-auto h-10 w-auto"
            priority
          />
          <h1 className="mt-6 font-display text-2xl font-bold tracking-tight text-ink">
            Personel Paneli
          </h1>
          <p className="mt-2 text-sm text-ink-muted">
            Supabase hesabınızla giriş yapın.
          </p>
        </div>

        <form
          onSubmit={submit}
          className="rounded-2xl border border-surface-border bg-white p-6 shadow-card sm:p-8"
        >
          <label className="block text-sm font-medium text-ink">
            E-posta
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="personel@zakcar.com"
              className="mt-1.5 w-full rounded-xl border border-surface-border bg-surface-soft px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
              autoComplete="username"
            />
          </label>

          <label className="mt-4 block text-sm font-medium text-ink">
            Şifre
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1.5 w-full rounded-xl border border-surface-border bg-surface-soft px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
              autoComplete="current-password"
            />
          </label>

          {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}

          <button type="submit" className="btn-primary mt-6 w-full" disabled={loading}>
            {loading ? "Giriş yapılıyor…" : "Giriş Yap"}
          </button>
        </form>
      </div>
    </div>
  );
}
