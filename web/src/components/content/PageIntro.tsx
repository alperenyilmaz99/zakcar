"use client";

import { usePrefs } from "@/components/prefs/PrefsProvider";
import type { MessageKey } from "@/lib/i18n";

export function PageIntro({ title, sub }: { title: MessageKey; sub?: MessageKey }) {
  const { t } = usePrefs();
  return (
    <>
      <h1 className="section-title">{t(title)}</h1>
      {sub && <p className="section-sub">{t(sub)}</p>}
    </>
  );
}
