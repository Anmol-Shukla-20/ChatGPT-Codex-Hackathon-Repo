import { Navbar } from "@/components/navigation/navbar";

export function SiteShell({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_hsl(var(--primary)/0.08),_transparent_35%),linear-gradient(to_bottom,_hsl(var(--background)),_hsl(var(--background)))]">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
