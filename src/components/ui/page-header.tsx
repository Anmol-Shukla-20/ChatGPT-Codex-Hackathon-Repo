import Link from "next/link";
import type { Route } from "next";

export function PageHeader({ title, description, breadcrumbs, actions }: Readonly<{
  title: string;
  description?: string;
  breadcrumbs?: Array<{ label: string; href?: Route }>;
  actions?: React.ReactNode;
}>) {
  return (
    <div className="space-y-4">
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-2">
          {breadcrumbs?.map((crumb, index) => (
            <li key={`${crumb.label}-${index}`} className="flex items-center gap-2">
              {crumb.href ? <Link href={crumb.href}>{crumb.label}</Link> : <span aria-current="page">{crumb.label}</span>}
              {index < (breadcrumbs?.length ?? 0) - 1 ? <span>/</span> : null}
            </li>
          ))}
        </ol>
      </nav>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
          {description ? <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{description}</p> : null}
        </div>
        {actions}
      </div>
    </div>
  );
}
