import { Button } from "@/components/ui/button";

export function EmptyState({ title, description, actionLabel }: Readonly<{ title: string; description: string; actionLabel?: string }>) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-card p-10 text-center">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
      {actionLabel ? <Button className="mt-6">{actionLabel}</Button> : null}
    </div>
  );
}
