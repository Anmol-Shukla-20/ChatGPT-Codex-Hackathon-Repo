import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { RequireAuth } from "@/features/auth/require-auth";

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <RequireAuth>
      <DashboardLayout>{children}</DashboardLayout>
    </RequireAuth>
  );
}
