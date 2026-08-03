"use client";

import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/auth-provider";

export default function SettingsPage() {
  const { user, signOut } = useAuth();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your account access and keep the application ready for the next citizen journey."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Settings" }]}
      />

      <Section title="Account access" description="Use the current authenticated account to continue the workflow.">
        <div className="space-y-3 rounded-2xl border bg-background p-5">
          <p className="text-sm text-muted-foreground">Signed in as</p>
          <p className="text-lg font-semibold">{user?.email ?? "Demo user"}</p>
          <p className="text-sm text-muted-foreground">The protected app flow will remain available until you choose to sign out.</p>
          <Button variant="outline" onClick={() => void signOut()}>
            Sign out
          </Button>
        </div>
      </Section>
    </div>
  );
}
