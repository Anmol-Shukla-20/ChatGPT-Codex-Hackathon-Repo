"use client";

import * as React from "react";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { useAuth } from "@/features/auth/auth-provider";

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginCard error={null} />}>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const { signInWithGoogle, signInWithEmail, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [submitting, setSubmitting] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const error = searchParams.get("error");

  const handleGoogleSignIn = async () => {
    setSubmitting(true);
    try {
      await signInWithGoogle();
    } finally {
      setSubmitting(false);
    }
  };

  const handleEmailSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const ok = await signInWithEmail({ email, password });
      if (ok) router.replace("/dashboard");
    } finally {
      setSubmitting(false);
    }
  };

  return <LoginCard error={error} loading={loading} submitting={submitting} onGoogleSignIn={handleGoogleSignIn} onEmailSignIn={handleEmailSignIn} email={email} setEmail={setEmail} password={password} setPassword={setPassword} />;
}

function LoginCard({
  error,
  loading = false,
  submitting = false,
  onGoogleSignIn,
  onEmailSignIn,
  email,
  setEmail,
  password,
  setPassword,
}: Readonly<{
  error: string | null;
  loading?: boolean;
  submitting?: boolean;
  onGoogleSignIn?: () => Promise<void>;
  onEmailSignIn?: (event: React.FormEvent) => Promise<void>;
  email?: string;
  setEmail?: React.Dispatch<React.SetStateAction<string>>;
  password?: string;
  setPassword?: React.Dispatch<React.SetStateAction<string>>;
}>) {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-md items-center">
      <div className="w-full space-y-6 rounded-2xl border bg-card p-8 shadow-sm">
        <div className="space-y-3 text-center">
          <div className="mx-auto w-fit">
            <Logo />
          </div>
          <h1 className="text-3xl font-semibold">Welcome back</h1>
          <p className="text-sm text-muted-foreground">Sign in with Supabase to access BharatSetu AI.</p>
        </div>

        {error ? <EmptyState title="Sign-in issue" description={error} /> : null}

        <form onSubmit={onEmailSignIn} className="space-y-3">
          <input
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail?.(event.target.value)}
            required
          />
          <input
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword?.(event.target.value)}
            required
          />
          <Button className="w-full" type="submit" disabled={loading || submitting}>
            {loading || submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Sign in
          </Button>
        </form>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="h-px flex-1 bg-border" />
          <span>or</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <Button className="w-full" onClick={onGoogleSignIn} disabled={loading || submitting}>
          {loading || submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Continue with Google
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          New here? <Link href="/register" className="font-medium text-primary">Create account</Link>
        </p>
      </div>
    </div>
  );
}
