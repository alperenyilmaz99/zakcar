export function Content({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="container-page max-w-3xl py-10 lg:py-14">
      <h1 className="section-title">{title}</h1>
      <div className="mt-6 space-y-4 text-base leading-relaxed text-ink-muted">{children}</div>
    </div>
  );
}
