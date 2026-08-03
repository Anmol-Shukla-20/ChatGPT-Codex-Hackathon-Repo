import type { Route } from "next";

export const navItems: Array<{ href: Route; label: string }> = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/documents", label: "Documents" },
  { href: "/schemes", label: "Schemes" },
  { href: "/profile", label: "Profile" },
  { href: "/settings", label: "Settings" },
];
