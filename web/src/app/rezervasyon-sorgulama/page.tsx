"use client";

import { useState } from "react";

export default function RezervasyonSorgulamaPage() {
  const [pnr, setPnr] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const last = JSON.parse(localStorage.getItem("zakcar_last_booking") || "null");
    if (last && last.pnr === pnr.trim().toUpperCase()) {
      setResult(`${last.vehicle} — Alış: ${last.search?.pickup || "—"} — Durum: Onay bekliyor`);
      setError(false);
    } else {
      setResult(null);
      setError(true);
    }
  }

  return (
    <div className="container-page max-w-lg py-10 lg:py-14">
      <h1 className="section-title">Rezervasyon Sorgula</h1>
      <form onSubmit={handleSubmit} className="card mt-8 space-y-4 p-6">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink-muted">Rezervasyon No (PNR)</span>
          <input
            value={pnr}
            onChange={(e) => setPnr(e.target.value)}
            placeholder="ZK..."
            required
            className="w-full rounded-xl border border-surface-border px-4 py-3 text-sm uppercase"
          />
        </label>
        <button type="submit" className="btn-primary w-full">
          Sorgula
        </button>
      </form>
      {result && <p className="card mt-4 p-4 text-sm text-green-700">{result}</p>}
      {error && <p className="mt-4 text-sm text-red-600">Rezervasyon bulunamadı.</p>}
    </div>
  );
}
