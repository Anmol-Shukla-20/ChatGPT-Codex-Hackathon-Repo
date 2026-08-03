import { cn } from "@/lib/utils";

export function Avatar({
  className,
  children,
}: Readonly<{ className?: string; children?: React.ReactNode }>) {
  return (
    <div
      className={cn(
        "grid h-9 w-9 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground",
        className
      )}
    >
      {children}
    </div>
  );
}
