"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";
import { toast } from "sonner";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { AuthContextValue } from "@/features/auth/types";

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({
  children,
  initialSession,
}: Readonly<{ children: React.ReactNode; initialSession: Session | null }>) {
  const router = useRouter();
  const [session, setSession] = React.useState<Session | null>(initialSession);
  const [loading, setLoading] = React.useState(true);
  const supabase = React.useMemo(() => createSupabaseBrowserClient(), []);

  const user: User | null = session?.user ?? null;

  React.useEffect(() => {
    const syncSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        toast.error(error.message);
      }
      setSession(data.session ?? null);
      setLoading(false);
    };

    void syncSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, nextSession) => {
      setSession(nextSession);
      setLoading(false);
      router.refresh();
    });

    return () => listener.subscription.unsubscribe();
  }, [router, supabase]);
  
  const signInWithGoogle = async () => {
    const redirectTo = `${window.location.origin}/api/auth/callback?next=/dashboard`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });

    if (error) toast.error(error.message);
  };

  const signInWithEmail = async ({ email, password }: { email: string; password: string }) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error(error.message);
      return false;
    }
    setSession(data.session);
    setLoading(false);
    return true;
  };

  const signUpWithEmail = async ({ email, password }: { email: string; password: string }) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      toast.error(error.message);
      return false;
    }
    setSession(data.session);
    setLoading(false);
    return true;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
      return;
    }
    setSession(null);
    router.replace("/");
    router.refresh();
  };

  const value: AuthContextValue = {
    user,
    session,
    loading,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
