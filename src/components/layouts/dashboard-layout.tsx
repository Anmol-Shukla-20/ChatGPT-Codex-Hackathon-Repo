"use client";

import { Navbar } from "@/components/navigation/navbar";
import { Sidebar } from "@/components/navigation/sidebar";
import { MobileDrawer } from "@/components/navigation/mobile-drawer";
import { FloatingChatbot } from "@/components/chatbot/floating-chatbot";

export function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <FloatingChatbot />
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <Sidebar className="hidden lg:block" />
        <main className="min-w-0 flex-1">
          <div className="lg:hidden">
            <MobileDrawer />
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
