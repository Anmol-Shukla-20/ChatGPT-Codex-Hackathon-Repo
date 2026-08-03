"use client";

import * as React from "react";
import { useAuth } from "@/features/auth/auth-provider";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/mvp/supabase-client";

type Message = { id: string; role: "user" | "assistant"; text: string; time: string };

export default function ChatPage() {
  const { user } = useAuth();
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    async function loadHistory() {
      // Load saved history from Supabase if available, otherwise use localStorage
      try {
        if (supabase && user?.id) {
          const { data } = await supabase.from("chat_history").select("*").eq("user_id", user.id).order("created_at", { ascending: true });
          if (data && data.length) {
            const msgs: Message[] = data.flatMap((row: any) => {
              const raw = row.messages ?? [];
              const arr = typeof raw === "string" ? JSON.parse(raw) : raw;
              return (arr || []).map((m: any) => ({ id: m.id, role: m.role, text: m.text, time: m.time }));
            });
            setMessages(msgs);
            return;
          }
        }
      } catch {
        // ignore
      }

      const local = localStorage.getItem("bharatsetu_chat");
      if (local) setMessages(JSON.parse(local));
    }
    void loadHistory();
  }, [user?.id]);

  const appendMessage = (role: Message["role"], text: string) => {
    const msg: Message = { id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, role, text, time: new Date().toISOString() };
    setMessages((s) => {
      const next = [...s, msg];
      try { localStorage.setItem("bharatsetu_chat", JSON.stringify(next)); } catch {}
      return next;
    });
    return msg;
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    setLoading(true);
    const userMsg = appendMessage("user", input.trim());
    setInput("");
    try {
      const resp = await fetch("/api/mvp/chat/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.text, context: { userId: user?.id } }),
      });

      let assistantText = "";
      if (resp.ok) {
        const data = await resp.json();
        assistantText = data?.text ?? "Sorry, I couldn't generate a response.";
      } else {
        const data = await resp.json().catch(() => ({}));
        assistantText = data?.text ?? "Assistant temporarily unavailable.";
      }

      const assistantMsg = appendMessage("assistant", assistantText);

      // Save into Supabase chat_history table if available
      try {
        if (supabase && user?.id) {
          const payload = { user_id: user.id, messages: messages.concat(userMsg, assistantMsg), created_at: new Date().toISOString() };
          await supabase.from("chat_history").insert(payload);
        }
      } catch {
        // ignore
      }
    } catch (err) {
      appendMessage("assistant", "Assistant failed to respond. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    try { localStorage.removeItem("bharatsetu_chat"); } catch {}
  };

  return (
    <div className="space-y-6">
      <PageHeader title="BharatSetu Assistant" description="Ask about schemes, eligibility, and next steps." breadcrumbs={[{ label: "Home", href: "/" }, { label: "Chat" }]} />

      <Section title="Chat" description="Use the assistant for scheme and application guidance only.">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={handleNewChat}>New chat</Button>
        </div>
        <div className="mt-4 flex h-[60vh] flex-col gap-3 overflow-auto rounded-lg border p-4">
          {messages.length === 0 ? (
            <div className="text-sm text-muted-foreground">No messages yet — ask about a scheme or eligibility.</div>
          ) : (
            messages.map((m) => (
              <div key={m.id} className={`max-w-[80%] ${m.role === "user" ? "ml-auto bg-primary/10" : "mr-auto bg-muted/20"} rounded-lg p-3 text-sm`}>
                <div className="whitespace-pre-wrap">{m.text}</div>
                <div className="mt-2 text-xs text-muted-foreground">{new Date(m.time).toLocaleString()}</div>
              </div>
            ))
          )}
        </div>
        <div className="mt-3 flex gap-2">
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about a scheme, eligibility, or documents." className="flex-1 rounded-md border px-3 py-2" />
          <Button onClick={handleSend} disabled={loading}>{loading ? "..." : "Send"}</Button>
        </div>
      </Section>
    </div>
  );
}
