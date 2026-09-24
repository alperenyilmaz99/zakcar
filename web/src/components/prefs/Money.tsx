"use client";

import { usePrefs } from "@/components/prefs/PrefsProvider";

export function Money({ value, className }: { value: string; className?: string }) {
  const { formatPrice } = usePrefs();
  return <span className={className}>{formatPrice(value)}</span>;
}
