"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/auth-provider";

export default function RegisterPage() {
  const { signInWithGoogle, signUpWithEmail, loading } = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleGoogleSignIn = async () => {
    setSubmitting(true);
    try {
      await signInWithGoogle();
    } finally {
      setSubmitting(false);
    }
  };

  const handleEmailSignUp = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const ok = await signUpWithEmail({ email, password });
      if (ok) router.replace("/dashboard");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-md items-center">
      <div className="w-full space-y-6 rounded-2xl border bg-card p-8 shadow-sm">
        <div className="space-y-3 text-center">
          <h1 className="text-3xl font-semibold">Create access</h1>
          <p className="text-sm text-muted-foreground">Register with Supabase and continue to your workspace.</p>
        </div>

        <form onSubmit={handleEmailSignUp} className="space-y-3">
          <input
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <input
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          <Button className="w-full" type="submit" disabled={loading || submitting}>
            {loading || submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Create account
          </Button>
        </form>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="h-px flex-1 bg-border" />
          <span>or</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <Button className="w-full" onClick={handleGoogleSignIn} disabled={loading || submitting}>
          {loading || submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Continue with Google
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account? <Link href="/login" className="font-medium text-primary">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
