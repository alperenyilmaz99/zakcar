"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefs } from "@/components/prefs/PrefsProvider";
import type { MessageKey } from "@/lib/i18n";

type Turn = { role: "user" | "assistant"; content: string };

const SUGGESTIONS: MessageKey[] = ["chat.suggest1", "chat.suggest2", "chat.suggest3"];

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true" fill="currentColor">
      <path d="M5 4.5h14A2.5 2.5 0 0 1 21.5 7v8A2.5 2.5 0 0 1 19 17.5H9l-4.2 3.1a.75.75 0 0 1-1.2-.6V7A2.5 2.5 0 0 1 5 4.5Z" />
    </svg>
  );
}

export function ChatWidget() {
  const { t, locale } = usePrefs();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [turns, busy, open]);

  async function ask(text: string) {
    const content = text.replace(/\s+/g, " ").trim();
    if (!content || busy) return;
    const history = [...turns, { role: "user" as const, content }];
    setTurns(history);
    setDraft("");
    setFailed(false);
    setBusy(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ locale, messages: history.slice(-8) }),
      });
      const data = (await res.json()) as { reply?: string };
      if (!res.ok || !data.reply) throw new Error("chat");
      setTurns((prev) => [...prev, { role: "assistant", content: data.reply as string }]);
    } catch {
      setFailed(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {open ? (
        <div
          role="dialog"
          aria-label={t("chat.title")}
          className="fixed bottom-36 right-4 z-50 flex w-80 max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-surface-border bg-white text-ink shadow-search sm:bottom-40 sm:right-6"
        >
          <div className="flex items-center justify-between bg-[#070b16] px-4 py-3 text-white">
            <p className="font-display text-sm font-bold">{t("chat.title")}</p>
            <button
              type="button"
              className="grid h-8 w-8 place-items-center rounded-full text-lg text-white/80 hover:bg-white/10"
              onClick={() => setOpen(false)}
              aria-label={t("chat.close")}
            >
              ×
            </button>
          </div>
          <div ref={listRef} className="max-h-[min(24rem,55vh)] space-y-3 overflow-y-auto px-4 py-4 text-sm">
            <p className="rounded-2xl rounded-ss-md bg-surface-soft px-3 py-2 leading-relaxed text-ink">{t("chat.greeting")}</p>
            {turns.map((turn, index) => (
              <p
                key={`${turn.role}-${index}`}
                className={
                  turn.role === "user"
                    ? "ms-8 rounded-2xl rounded-se-md bg-brand px-3 py-2 leading-relaxed text-white"
                    : "me-6 rounded-2xl rounded-ss-md bg-surface-soft px-3 py-2 leading-relaxed text-ink"
                }
              >
                {turn.content}
              </p>
            ))}
            {busy ? <p className="text-xs text-ink-muted">{t("chat.thinking")}</p> : null}
            {failed ? <p className="text-xs text-brand">{t("chat.error")}</p> : null}
            {turns.length === 0 && !busy ? (
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((key) => (
                  <button
                    key={key}
                    type="button"
                    className="rounded-full border border-surface-border px-3 py-1.5 text-xs font-medium text-ink hover:border-brand hover:text-brand"
                    onClick={() => void ask(t(key))}
                  >
                    {t(key)}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
          <form
            className="flex gap-2 border-t border-surface-border p-3"
            onSubmit={(event) => {
              event.preventDefault();
              void ask(draft);
            }}
          >
            <input
              ref={inputRef}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              maxLength={500}
              placeholder={t("chat.placeholder")}
              className="min-w-0 flex-1 rounded-xl border border-surface-border px-3 py-2 text-sm outline-none focus:border-brand"
            />
            <button type="submit" className="btn-primary !rounded-xl !px-3 !py-2" disabled={busy || !draft.trim()}>
              {t("chat.send")}
            </button>
          </form>
        </div>
      ) : null}
      <button
        type="button"
        className="flex h-14 w-14 items-center justify-center rounded-full border border-surface-border bg-white text-[#070b16] shadow-[0_0_0_10px_rgba(7,11,22,0.08)] transition hover:scale-105 hover:text-brand"
        aria-label={t("chat.open")}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <ChatIcon />
      </button>
    </>
  );
}
