"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { navItems } from "@/constants/navigation";
import { Button } from "@/components/ui/button";

export function Sidebar({ className }: Readonly<{ className?: string }>) {
  const pathname = usePathname();

  return (
    <aside className={cn("w-64 shrink-0 rounded-2xl border bg-card p-4", className)}>
      <nav className="space-y-1" aria-label="Sidebar">
        {navItems.map((item) => (
          <Button
            key={item.href}
            asChild
            variant="ghost"
            className={cn(
              "w-full justify-start px-3 text-sm font-medium text-muted-foreground",
              pathname === item.href && "bg-accent text-accent-foreground"
            )}
          >
            <Link href={item.href}>{item.label}</Link>
          </Button>
        ))}
      </nav>
    </aside>
  );
}
