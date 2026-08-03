export function Section({ title, description, children }: Readonly<{ title: string; description?: string; children: React.ReactNode }>) {
  return (
    <section className="rounded-2xl border bg-card p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}
