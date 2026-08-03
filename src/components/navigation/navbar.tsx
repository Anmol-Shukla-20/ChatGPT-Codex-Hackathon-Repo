"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/features/auth/auth-provider";
import { navItems } from "@/constants/navigation";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { user, signOut } = useAuth();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Logo />
        <nav className="ml-6 hidden items-center gap-1 lg:flex" aria-label="Primary">
          {navItems.map((item) => (
            <Button
              key={item.href}
              asChild
              variant="ghost"
              size="sm"
              className={cn(
                "px-3 text-muted-foreground",
                pathname === item.href && "bg-accent text-accent-foreground"
              )}
            >
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          {!user ? (
            <Button asChild variant="outline" size="sm">
              <Link href="/login">Login</Link>
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Avatar>{user.user_metadata?.full_name?.[0] ?? user.email?.[0]?.toUpperCase() ?? "B"}</Avatar>
                  <span className="hidden sm:inline">{user.user_metadata?.full_name ?? user.email}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44 p-1">
                <DropdownMenuItem asChild className="flex items-center px-3 py-2">
                  <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="flex items-center px-3 py-2">
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center px-3 py-2"
                  onSelect={(event) => {
                    event.preventDefault();
                    void signOut();
                  }}
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
