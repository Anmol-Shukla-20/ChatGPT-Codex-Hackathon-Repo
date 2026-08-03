"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/auth-provider";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";

export function RequireAuth({ children }: Readonly<{ children: React.ReactNode }>) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    if (!loading && !user) router.replace(`/login?next=${encodeURIComponent(pathname)}`);
  }, [loading, pathname, router, user]);

  if (loading) {
    return (
      <div className="space-y-3 p-6">
        <LoadingSkeleton />
        <LoadingSkeleton />
        <LoadingSkeleton />
      </div>
    );
  }

  if (!user) return null;
  return <>{children}</>;
}
