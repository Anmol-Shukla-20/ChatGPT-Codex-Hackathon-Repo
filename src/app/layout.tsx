import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "@/components/providers/app-providers";

export const metadata: Metadata = {
  title: "BharatSetu AI",
  description: "A production-ready frontend architecture for BharatSetu AI.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AppProviders initialSession={null}>{children}</AppProviders>
      </body>
    </html>
  );
}
