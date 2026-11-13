"use client";

import { useEffect, useMemo, useState } from "react";
import { formatDateTime } from "@/components/panel/Badges";
import { createClient } from "@/lib/supabase/client";

type Member = {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  created_at: string;
  last_sign_in_at: string | null;
  email_confirmed: boolean;
  rental_count: number;
};

function missingFunction(message: string): boolean {
  const text = message.toLowerCase();
  return text.includes("list_site_members") || text.includes("schema cache") || text.includes("pgrst202");
}

function when(value: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return formatDateTime(value);
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [needsSql, setNeedsSql] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const supabase = createClient();
      const { data, error: queryError } = await supabase.rpc("list_site_members");
      if (cancelled) return;
      if (queryError) {
        if (missingFunction(queryError.message)) setNeedsSql(true);
        else setError(queryError.message);
        setLoading(false);
        return;
      }
      const rows = (Array.isArray(data) ? data : []) as Member[];
      setMembers(
        rows.map((row) => ({
          ...row,
          full_name: row.full_name?.trim() || "",
          phone: row.phone?.trim() || null,
          rental_count: Number(row.rental_count) || 0,
        })),
      );
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const list = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("tr-TR");
    if (!needle) return members;
    return members.filter((member) => {
      const haystack = `${member.full_name} ${member.email} ${member.phone || ""}`.toLocaleLowerCase("tr-TR");
      return haystack.includes(needle);
    });
  }, [members, query]);

  if (loading) return <p className="text-sm text-ink-muted">Yükleniyor…</p>;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">Üyeler</h1>
          <p className="mt-1 max-w-2xl text-sm text-ink-muted">
            Siteye üye olan hesaplar. Personel hesapları bu listede yok. Telefon, rezervasyon kaydından gelir.
          </p>
        </div>
        <p className="text-sm text-ink-muted">{list.length} üye</p>
      </div>

      {needsSql && (
        <p className="mt-4 rounded-xl border border-surface-border bg-white px-4 py-3 text-sm text-ink">
          Üye listesinin açılması için Supabase SQL Editor’da{" "}
          <span className="font-semibold">web/supabase/members.sql</span> dosyasını bir kez çalıştırın.
        </p>
      )}
      {error && <p className="mt-4 text-sm text-brand">{error}</p>}

      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Ad, e-posta veya telefon…"
        className="mt-6 w-full rounded-xl border border-surface-border bg-white px-3.5 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 sm:max-w-xs"
      />

      <div className="mt-4 overflow-hidden rounded-2xl border border-surface-border bg-white">
        {list.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-ink-muted">
            {needsSql ? "Liste henüz bağlı değil." : "Üye bulunamadı."}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-surface-border text-xs uppercase tracking-wide text-ink-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">Ad</th>
                  <th className="px-4 py-3 font-medium">E-posta</th>
                  <th className="px-4 py-3 font-medium">Telefon</th>
                  <th className="px-4 py-3 font-medium">Üyelik</th>
                  <th className="px-4 py-3 font-medium">Son giriş</th>
                  <th className="px-4 py-3 font-medium">Rezervasyon</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {list.map((member) => (
                  <tr key={member.id}>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-ink">{member.full_name || "—"}</p>
                      <p className="mt-0.5 text-xs text-ink-muted">
                        {member.email_confirmed ? "E-posta onaylı" : "Onay bekliyor"}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <a href={`mailto:${member.email}`} className="break-all text-ink hover:text-brand">
                        {member.email}
                      </a>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-ink">
                      {member.phone ? (
                        <a href={`tel:${member.phone.replace(/\s/g, "")}`} className="hover:text-brand">
                          {member.phone}
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-ink-muted">{when(member.created_at)}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-ink-muted">{when(member.last_sign_in_at)}</td>
                    <td className="px-4 py-3 font-medium text-ink">{member.rental_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
