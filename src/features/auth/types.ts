import type { Session, User } from "@supabase/supabase-js";

export type AuthContextValue = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (credentials: { email: string; password: string }) => Promise<boolean>;
  signUpWithEmail: (credentials: { email: string; password: string }) => Promise<boolean>;
  signOut: () => Promise<void>;
};
