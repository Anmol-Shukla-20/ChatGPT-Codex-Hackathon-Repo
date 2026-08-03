"use client";

import { ThemeProvider } from "next-themes";
import type { Session } from "@supabase/supabase-js";
import { Toaster } from "sonner";
import { AuthProvider } from "@/features/auth/auth-provider";

export function AppProviders({
  children,
  initialSession,
}: Readonly<{ children: React.ReactNode; initialSession: Session | null }>) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <AuthProvider initialSession={initialSession}>{children}</AuthProvider>
      <Toaster richColors position="top-right" />
    </ThemeProvider>
  );
}
