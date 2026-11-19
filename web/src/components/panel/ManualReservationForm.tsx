"use client";

import { useEffect, useMemo, useState } from "react";
import { pickupHourIsPast, startOfHour } from "@/lib/booking";
import { createClient } from "@/lib/supabase/client";
import { EXTRA_OPTIONS, depositForDays, dropFeeFor, extraAmount, includedKm, rentalDays, type ExtraId } from "@/lib/extras";
import { downloadReservationPdf } from "@/lib/panel-api";

type VehicleOption = {
  id: string;
  name: string;
  status: string;
  dailyPrice: number;
  officeCode: string;
  officeName: string;
};
type OfficeOption = { code: string; name: string };

function vehicleLabel(vehicle: VehicleOption, vehicles: VehicleOption[]) {
  const shared = vehicles.filter((item) => item.name === vehicle.name).length > 1;
  return shared && vehicle.officeName ? `${vehicle.name} · ${vehicle.officeName}` : vehicle.name;
}

function localInput(date: Date) {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

const EXTRA_LABEL: Record<ExtraId, string> = {
  driver: "Ek sürücü",
  young: "Genç sürücü paketi",
  hgs: "HGS",
  child: "Çocuk koltuğu",
  winter: "Kış lastiği",
};

function defaultRange() {
  const from = new Date();
  from.setDate(from.getDate() + 1);
  from.setHours(10, 0, 0, 0);
  const to = new Date(from);
  to.setDate(to.getDate() + 3);
  return { from: localInput(from), to: localInput(to) };
}

async function staffToken() {
  const { data } = await createClient().auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("Oturum bulunamadı. Tekrar giriş yapın.");
  return token;
}

export function ManualReservationForm({ onCreated }: { onCreated: (pnr: string) => void }) {
  const initial = defaultRange();
  const [open, setOpen] = useState(false);
  const [vehicles, setVehicles] = useState<VehicleOption[]>([]);
  const [offices, setOffices] = useState<OfficeOption[]>([]);
  const [fleetVehicleId, setFleetVehicleId] = useState("");
  const [pickupCode, setPickupCode] = useState("saw");
  const [dropoffCode, setDropoffCode] = useState("saw");
  const [startAt, setStartAt] = useState(initial.from);
  const [endAt, setEndAt] = useState(initial.to);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [locale, setLocale] = useState("tr");
  const [dailyPrice, setDailyPrice] = useState("");
  const [arrivalFlight, setArrivalFlight] = useState("");
  const [returnFlight, setReturnFlight] = useState("");
  const [customerNote, setCustomerNote] = useState("");
  const [extras, setExtras] = useState<ExtraId[]>([]);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const [createdPnr, setCreatedPnr] = useState("");
  const [pdfError, setPdfError] = useState("");
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!open || vehicles.length) return;
    let cancelled = false;
    (async () => {
      try {
        const token = await staffToken();
        const res = await fetch("/api/panel/reservations", { headers: { Authorization: `Bearer ${token}` } });
        const json = (await res.json()) as { vehicles?: VehicleOption[]; offices?: OfficeOption[]; error?: string };
        if (!res.ok) throw new Error(json.error || "Araç listesi alınamadı.");
        if (cancelled) return;
        setVehicles(json.vehicles || []);
        setOffices(json.offices || []);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Araç listesi alınamadı.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, vehicles.length]);

  const selected = vehicles.find((vehicle) => vehicle.id === fleetVehicleId);
  const days = useMemo(() => {
    const start = new Date(startAt);
    const end = new Date(endAt);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 1;
    return rentalDays(start.toISOString(), end.toISOString());
  }, [startAt, endAt]);
  const deposit = depositForDays(days);
  const dropFee = dropFeeFor(pickupCode, dropoffCode);
  const daily = Number(dailyPrice.replace(",", ".")) || 0;
  const extrasTotal = extraAmount(extras, days);

  function chooseVehicle(id: string) {
    setFleetVehicleId(id);
    const vehicle = vehicles.find((item) => item.id === id);
    if (!vehicle) return;
    setDailyPrice(String(vehicle.dailyPrice || ""));
    setPickupCode(vehicle.officeCode);
    setDropoffCode(vehicle.officeCode);
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (saving) return;
    if (pickupHourIsPast(new Date(startAt))) {
      setError("Alış saati geçmişte kalamaz.");
      return;
    }
    setSaving(true);
    setError("");
    setNote("");
    setCreatedPnr("");
    setPdfError("");
    try {
      const token = await staffToken();
      const res = await fetch("/api/panel/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          fleetVehicleId,
          pickupCode,
          dropoffCode,
          startAt: new Date(startAt).toISOString(),
          endAt: new Date(endAt).toISOString(),
          firstName,
          lastName,
          email,
          phone,
          birthDate,
          dailyPrice,
          arrivalFlight,
          returnFlight,
          customerNote,
          extraCodes: extras,
          locale,
        }),
      });
      const json = (await res.json()) as { pnr?: string; mailSent?: boolean; error?: string };
      if (!res.ok || !json.pnr) throw new Error(json.error || "Rezervasyon açılamadı.");
      setCreatedPnr(json.pnr);
      setNote(
        json.mailSent
          ? `${json.pnr} oluşturuldu. Onay e-postası müşteriye gönderildi.`
          : `${json.pnr} oluşturuldu. Onay e-postası şu an gönderilemedi.`,
      );
      onCreated(json.pnr);
      void savePdf(json.pnr);
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setBirthDate("");
      setArrivalFlight("");
      setReturnFlight("");
      setCustomerNote("");
      setExtras([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Rezervasyon açılamadı.");
    } finally {
      setSaving(false);
    }
  }

  async function savePdf(pnr: string) {
    setDownloading(true);
    setPdfError("");
    try {
      await downloadReservationPdf(pnr);
    } catch (err) {
      setPdfError(err instanceof Error ? err.message : "PDF indirilemedi.");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <section className="mt-6 rounded-2xl border border-surface-border bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-bold text-ink">Manuel rezervasyon</h2>
          <p className="mt-1 text-sm text-ink-muted">Kayıt açılınca onay belgesi indirilir ve müşteriye e-posta gider.</p>
        </div>
        <button type="button" className="btn-outline text-sm" onClick={() => setOpen((value) => !value)}>
          {open ? "Formu gizle" : "Yeni rezervasyon"}
        </button>
      </div>

      {open && (
        <form onSubmit={submit} className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium text-ink">Ad</span>
            <input required value={firstName} onChange={(event) => setFirstName(event.target.value)} className="w-full rounded-xl border border-surface-border px-3 py-2.5" />
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium text-ink">Soyad</span>
            <input required value={lastName} onChange={(event) => setLastName(event.target.value)} className="w-full rounded-xl border border-surface-border px-3 py-2.5" />
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium text-ink">E-posta</span>
            <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-xl border border-surface-border px-3 py-2.5" />
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium text-ink">Telefon</span>
            <input required value={phone} onChange={(event) => setPhone(event.target.value)} className="w-full rounded-xl border border-surface-border px-3 py-2.5" />
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium text-ink">Doğum tarihi</span>
            <input type="date" value={birthDate} onChange={(event) => setBirthDate(event.target.value)} className="w-full rounded-xl border border-surface-border px-3 py-2.5" />
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium text-ink">Mail ve PDF dili</span>
            <select value={locale} onChange={(event) => setLocale(event.target.value)} className="w-full rounded-xl border border-surface-border px-3 py-2.5">
              <option value="tr">Türkçe</option>
              <option value="en">English</option>
              <option value="de">Deutsch</option>
              <option value="ar">العربية</option>
              <option value="ru">Русский</option>
            </select>
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium text-ink">Araç</span>
            <select required value={fleetVehicleId} onChange={(event) => chooseVehicle(event.target.value)} className="w-full rounded-xl border border-surface-border px-3 py-2.5">
              <option value="">Araç seçin</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicleLabel(vehicle, vehicles)}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium text-ink">Alış ofisi</span>
            <select value={pickupCode} onChange={(event) => setPickupCode(event.target.value)} className="w-full rounded-xl border border-surface-border px-3 py-2.5">
              {offices.map((office) => (
                <option key={office.code} value={office.code}>
                  {office.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium text-ink">Bırakış ofisi</span>
            <select value={dropoffCode} onChange={(event) => setDropoffCode(event.target.value)} className="w-full rounded-xl border border-surface-border px-3 py-2.5">
              {offices.map((office) => (
                <option key={office.code} value={office.code}>
                  {office.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium text-ink">Alış</span>
            <input required type="datetime-local" min={localInput(startOfHour(new Date()))} value={startAt} onChange={(event) => setStartAt(event.target.value)} className="w-full rounded-xl border border-surface-border px-3 py-2.5" />
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium text-ink">Bırakış</span>
            <input required type="datetime-local" min={startAt} value={endAt} onChange={(event) => setEndAt(event.target.value)} className="w-full rounded-xl border border-surface-border px-3 py-2.5" />
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium text-ink">Günlük fiyat (TL)</span>
            <input required inputMode="decimal" value={dailyPrice} onChange={(event) => setDailyPrice(event.target.value)} className="w-full rounded-xl border border-surface-border px-3 py-2.5" />
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium text-ink">Geliş uçuş no</span>
            <input value={arrivalFlight} onChange={(event) => setArrivalFlight(event.target.value)} placeholder="İsteğe bağlı" className="w-full rounded-xl border border-surface-border px-3 py-2.5" />
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium text-ink">Dönüş uçuş no</span>
            <input value={returnFlight} onChange={(event) => setReturnFlight(event.target.value)} placeholder="İsteğe bağlı" className="w-full rounded-xl border border-surface-border px-3 py-2.5" />
          </label>
          <label className="block text-sm sm:col-span-2">
            <span className="mb-1.5 block font-medium text-ink">Not</span>
            <textarea value={customerNote} onChange={(event) => setCustomerNote(event.target.value)} maxLength={400} rows={2} className="w-full rounded-xl border border-surface-border px-3 py-2.5" />
          </label>
          <fieldset className="sm:col-span-2">
            <legend className="mb-2 text-sm font-medium text-ink">Ek paketler</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {EXTRA_OPTIONS.map((item) => {
                const checked = extras.includes(item.id);
                const amount = item.dailyTry * days;
                return (
                  <label
                    key={item.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-2.5 text-sm ${
                      checked ? "border-brand" : "border-surface-border"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        setExtras((current) =>
                          current.includes(item.id) ? current.filter((id) => id !== item.id) : [...current, item.id],
                        )
                      }
                      className="mt-0.5 h-4 w-4 accent-brand"
                    />
                    <span>
                      <span className="font-medium text-ink">{EXTRA_LABEL[item.id]}</span>
                      <span className="mt-0.5 block text-xs text-ink-muted">
                        {item.dailyTry.toLocaleString("tr-TR")} TL/gün · +{amount.toLocaleString("tr-TR")} TL
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>
          <p className="text-sm text-ink-muted sm:col-span-2">
            {selected ? `${vehicleLabel(selected, vehicles)} · ` : ""}
            {days} gün · toplam {Math.round(daily * days + extrasTotal + dropFee).toLocaleString("tr-TR")} TL
            {extrasTotal > 0 ? ` (ekler ${extrasTotal.toLocaleString("tr-TR")} TL)` : ""} · depozito{" "}
            {deposit.toLocaleString("tr-TR")} TL
            {dropFee > 0 ? ` · Drop ücreti ${dropFee.toLocaleString("tr-TR")} TL` : ""} · yol hakkı{" "}
            {includedKm(days).toLocaleString("tr-TR")} km
          </p>
          {error && <p className="text-sm text-rose-700 sm:col-span-2">{error}</p>}
          {note && <p className="text-sm text-emerald-700 sm:col-span-2">{note}</p>}
          {pdfError && <p className="text-sm text-rose-700 sm:col-span-2">{pdfError}</p>}
          <div className="flex flex-wrap gap-2 sm:col-span-2">
            <button type="submit" className="btn-primary" disabled={saving || !fleetVehicleId}>
              {saving ? "Kaydediliyor" : "Rezervasyonu oluştur"}
            </button>
            {createdPnr && (
              <button type="button" className="btn-outline" disabled={downloading} onClick={() => void savePdf(createdPnr)}>
                {downloading ? "PDF hazırlanıyor" : "PDF indir"}
              </button>
            )}
          </div>
        </form>
      )}
    </section>
  );
}
