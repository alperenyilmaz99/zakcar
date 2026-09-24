export function FaqAccordion({
  items,
}: {
  items: { id: string; q: string; a: string }[];
}) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <details key={item.id} className="card group overflow-hidden">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-4 px-5 py-4 font-display text-base font-semibold text-ink marker:content-none [&::-webkit-details-marker]:hidden">
            <span>{item.q}</span>
            <span
              aria-hidden
              className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-light text-sm text-brand transition group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <div className="border-t border-surface-border px-5 py-4 text-sm leading-relaxed text-ink-muted">
            {item.a}
          </div>
        </details>
      ))}
    </div>
  );
}
