export type Coupon = {
  id: string;
  code: string;
  percent: number;
  active: boolean;
  createdAt: string;
};

export function normalizeCouponCode(raw: string): string {
  return raw
    .trim()
    .replace(/\s+/g, "")
    .replace(/[iıİ]/g, "I")
    .toUpperCase();
}

export function isCouponCode(code: string): boolean {
  return /^[A-Z0-9-]{3,20}$/.test(code);
}

export function applyPercent(amount: number, percent: number): { discount: number; total: number } {
  const base = Math.round(amount * 100);
  const discount = Math.round((base * percent) / 100);
  const total = Math.max(0, base - discount);
  return { discount: discount / 100, total: total / 100 };
}
