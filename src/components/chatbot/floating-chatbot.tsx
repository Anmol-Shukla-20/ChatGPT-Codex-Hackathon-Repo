"use client";

import Link from "next/link";
import Image from "next/image";
import BotImage from "@/chatbot_image/Bharatsetu_bot.png";
import { useEffect, useState } from "react";

export function FloatingChatbot() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Hide on very small screens if needed
    const onResize = () => setVisible(window.innerWidth > 420);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  if (!visible) return null;

  return (
    <div className="pointer-events-auto fixed right-4 top-20 z-50">
      <Link href="/chat" aria-label="Open BharatSetu assistant" className="group flex h-14 w-14 items-center justify-center rounded-full border bg-white/95 shadow-lg transition hover:scale-105 dark:bg-slate-800">
        <Image src={BotImage} alt="BharatSetu bot" width={48} height={48} className="rounded-full" />
      </Link>
    </div>
  );
}
