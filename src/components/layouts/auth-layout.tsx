import { Logo } from "@/components/ui/logo";

export function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden bg-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <Logo />
        <div className="max-w-md space-y-4">
          <h1 className="text-4xl font-semibold">BharatSetu AI</h1>
          <p className="text-slate-300">A modern foundation for secure, scalable government and enterprise workflows.</p>
        </div>
      </div>
      <div className="flex items-center justify-center p-6">{children}</div>
    </div>
  );
}
