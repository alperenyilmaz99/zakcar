import fs from "fs";
import path from "path";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  isCouponCode,
  normalizeCouponCode,
  type Coupon,
} from "@/lib/coupon-math";
import { createServerSupabase, hasServerSupabase } from "@/lib/supabase/server";

type CouponRow = {
  id: string;
  code: string;
  percent: number;
  is_active: boolean;
  created_at: string;
};

function storePath(): string {
  const candidates = [
    path.join(process.cwd(), "src", "data", "coupons.json"),
    path.join(process.cwd(), "web", "src", "data", "coupons.json"),
  ];
  return candidates.find((item) => fs.existsSync(item)) || candidates[0];
}

function readCouponFile(): Coupon[] {
  try {
    const parsed = JSON.parse(fs.readFileSync(storePath(), "utf8")) as { coupons?: Coupon[] };
    return Array.isArray(parsed.coupons) ? parsed.coupons : [];
  } catch {
    return [];
  }
}

function writeCouponFile(coupons: Coupon[]): boolean {
  try {
    const file = storePath();
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, JSON.stringify({ coupons }, null, 2) + "\n", "utf8");
    return true;
  } catch {
    return false;
  }
}

function missingRelation(error: { code?: string; message?: string } | null): boolean {
  if (!error) return false;
  const message = error.message || "";
  return (
    error.code === "42P01" ||
    error.code === "PGRST202" ||
    error.code === "PGRST205" ||
    /schema cache|does not exist|could not find the (table|function)/i.test(message)
  );
}

function mapRow(row: CouponRow): Coupon {
  return {
    id: row.id,
    code: row.code,
    percent: Number(row.percent),
    active: row.is_active,
    createdAt: row.created_at,
  };
}

async function migrateFileCoupons(supabase: SupabaseClient): Promise<void> {
  const file = readCouponFile();
  if (file.length === 0) return;
  for (const coupon of file) {
    if (!isCouponCode(coupon.code)) continue;
    await supabase.from("discount_coupons").insert({
      code: coupon.code,
      percent: coupon.percent,
      is_active: coupon.active,
    });
  }
  writeCouponFile([]);
}

export async function listCoupons(
  supabase: SupabaseClient,
): Promise<{ coupons: Coupon[]; needsSql: boolean }> {
  const { data, error } = await supabase
    .from("discount_coupons")
    .select("id,code,percent,is_active,created_at")
    .order("created_at", { ascending: false });
  if (error && missingRelation(error)) {
    return { coupons: readCouponFile(), needsSql: true };
  }
  if (error) throw new Error(error.message);
  await migrateFileCoupons(supabase);
  const again = await supabase
    .from("discount_coupons")
    .select("id,code,percent,is_active,created_at")
    .order("created_at", { ascending: false });
  if (again.error) throw new Error(again.error.message);
  return { coupons: ((again.data || []) as CouponRow[]).map(mapRow), needsSql: false };
}

export async function createCoupon(
  supabase: SupabaseClient,
  rawCode: string,
  rawPercent: number,
): Promise<{ coupon: Coupon; needsSql: boolean }> {
  const code = normalizeCouponCode(rawCode);
  if (!isCouponCode(code)) throw new Error("Kupon kodu 3-20 karakter olmalı. Yalnız harf, rakam ve tire.");
  if (!Number.isInteger(rawPercent) || rawPercent < 1 || rawPercent > 100) {
    throw new Error("İndirim yüzdesi 1 ile 100 arasında tam sayı olmalı.");
  }

  const { data, error } = await supabase
    .from("discount_coupons")
    .insert({ code, percent: rawPercent, is_active: true })
    .select("id,code,percent,is_active,created_at")
    .single();
  if (!error && data) return { coupon: mapRow(data as CouponRow), needsSql: false };
  if (error && error.code === "23505") throw new Error("Bu kupon kodu zaten var.");
  if (error && !missingRelation(error)) throw new Error(error.message);

  const coupons = readCouponFile();
  if (coupons.some((item) => item.code === code)) throw new Error("Bu kupon kodu zaten var.");
  const coupon: Coupon = {
    id: crypto.randomUUID(),
    code,
    percent: rawPercent,
    active: true,
    createdAt: new Date().toISOString(),
  };
  if (!writeCouponFile([coupon, ...coupons])) {
    throw new Error("Kupon kaydedilemedi. Supabase SQL Editor’da web/supabase/coupons.sql dosyasını çalıştırın.");
  }
  return { coupon, needsSql: true };
}

export async function setCouponActive(
  supabase: SupabaseClient,
  id: string,
  active: boolean,
): Promise<{ needsSql: boolean }> {
  const { error } = await supabase.from("discount_coupons").update({ is_active: active }).eq("id", id);
  if (!error) return { needsSql: false };
  if (!missingRelation(error)) throw new Error(error.message);
  const coupons = readCouponFile();
  const next = coupons.map((item) => (item.id === id ? { ...item, active } : item));
  if (!writeCouponFile(next)) throw new Error("Kupon güncellenemedi.");
  return { needsSql: true };
}

export async function deleteCoupon(supabase: SupabaseClient, id: string): Promise<{ needsSql: boolean }> {
  const { error } = await supabase.from("discount_coupons").delete().eq("id", id);
  if (!error) return { needsSql: false };
  if (!missingRelation(error)) throw new Error(error.message);
  const next = readCouponFile().filter((item) => item.id !== id);
  if (!writeCouponFile(next)) throw new Error("Kupon silinemedi.");
  return { needsSql: true };
}

export async function resolveCouponPercent(rawCode: string): Promise<{ percent: number; persisted: boolean }> {
  const code = normalizeCouponCode(rawCode);
  if (!isCouponCode(code)) return { percent: 0, persisted: false };
  if (hasServerSupabase()) {
    const supabase = createServerSupabase();
    const { data, error } = await supabase.rpc("coupon_percent", { p_code: code });
    if (!error) {
      const percent = Number(data);
      return { percent: Number.isFinite(percent) ? percent : 0, persisted: true };
    }
    if (!missingRelation(error)) return { percent: 0, persisted: true };
  }
  const found = readCouponFile().find((item) => item.active && item.code === code);
  return { percent: found?.percent ?? 0, persisted: false };
}
