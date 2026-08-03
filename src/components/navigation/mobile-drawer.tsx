"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { navItems } from "@/constants/navigation";
import { cn } from "@/lib/utils";

export function MobileDrawer() {
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <Menu className="mr-2 h-4 w-4" />
          Menu
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <div className="grid gap-3 pt-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted",
                pathname === item.href && "bg-accent text-accent-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
