"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePrefs } from "@/components/prefs/PrefsProvider";
import { useCustomer } from "@/hooks/useCustomer";

export function AuthForm() {
  const { t } = usePrefs();
  const { user, login, register } = useCustomer();
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) router.replace("/rezervasyon-sorgulama");
  }, [user, router]);

  if (user) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      if (mode === "register") {
        if (!name.trim()) {
          setError(t("auth.error"));
          return;
        }
        register(name.trim(), email.trim(), password);
      } else {
        login(email.trim(), password);
      }
      router.push("/rezervasyon-sorgulama");
    } catch (err) {
      setError(err instanceof Error && err.message === "exists" ? t("auth.exists") : t("auth.invalid"));
    }
  }

  return (
    <div className="container-page max-w-md py-10 lg:py-14">
      <h1 className="section-title">{mode === "login" ? t("nav.login") : t("nav.register")}</h1>
      <p className="section-sub">{t("auth.sub")}</p>

      <form onSubmit={handleSubmit} className="card mt-8 space-y-4 p-6">
        {mode === "register" && (
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink-muted">{t("auth.name")}</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-xl border border-surface-border px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </label>
        )}
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink-muted">{t("auth.email")}</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-xl border border-surface-border px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink-muted">{t("auth.password")}</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full rounded-xl border border-surface-border px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </label>
        {error && <p className="text-sm text-brand">{error}</p>}
        <button type="submit" className="btn-primary w-full">
          {mode === "login" ? t("nav.login") : t("nav.register")}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-ink-muted">
        {mode === "login" ? t("auth.noAccount") : t("auth.haveAccount")}{" "}
        <button
          type="button"
          className="font-semibold text-brand"
          onClick={() => {
            setError("");
            setMode(mode === "login" ? "register" : "login");
          }}
        >
          {mode === "login" ? t("nav.register") : t("nav.login")}
        </button>
      </p>
      <p className="mt-3 text-center text-sm">
        <Link href="/rezervasyon-sorgulama" className="text-ink-muted hover:text-brand">
          {t("nav.myBookings")}
        </Link>
      </p>
    </div>
  );
}
