"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import type { MessagingDictionary } from "@/lib/i18n/translations";

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  body: string;
  created_at: string;
}

export function MessageThread({
  currentUserId,
  partnerId,
  partnerName,
  initialMessages,
  t,
  locale
}: {
  currentUserId: string;
  partnerId: string;
  partnerName: string;
  initialMessages: Message[];
  t: MessagingDictionary;
  locale: "ar" | "en";
}) {
  const supabase = createClient();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Mark incoming messages from this partner as read as soon as the thread opens
  useEffect(() => {
    fetch("/api/messages/mark-read", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ partnerId })
    }).catch(() => {
      // Non-critical — read status can be retried next time the thread opens
    });
  }, [partnerId]);

  // Live updates: append any new message this user receives from the partner
  useEffect(() => {
    const channel = supabase
      .channel(`messages-${currentUserId}-${partnerId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `receiver_id=eq.${currentUserId}`
        },
        (payload) => {
          const newMessage = payload.new as Message;
          if (newMessage.sender_id === partnerId) {
            setMessages((prev) => [...prev, newMessage]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId, partnerId, supabase]);

  async function handleSend() {
    const body = input.trim();
    if (!body) return;

    setSending(true);
    setError(null);

    try {
      const res = await fetch("/api/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverId: partnerId, body })
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Failed to send message.");
        return;
      }

      setMessages((prev) => [...prev, data.message]);
      setInput("");
    } catch {
      setError("Network error — please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex h-[600px] flex-col rounded-xl2 border border-black/5 bg-white/80 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-white/5">
      <div className="border-b border-black/5 p-4 dark:border-white/10">
        <h3 className="font-semibold text-navy dark:text-white">{partnerName}</h3>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.length === 0 && (
          <p className="text-center text-sm text-black/50 dark:text-white/50">
            {t.noMessagesYet}
          </p>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={
              m.sender_id === currentUserId
                ? "ms-auto max-w-[75%] rounded-xl2 bg-navy px-4 py-2 text-sm text-white"
                : "me-auto max-w-[75%] rounded-xl2 bg-black/5 px-4 py-2 text-sm text-navy dark:bg-white/10 dark:text-white"
            }
          >
            <p>{m.body}</p>
            <p className="mt-1 text-[10px] opacity-60">
              {new Date(m.created_at).toLocaleTimeString(locale === "ar" ? "ar-EG" : "en-US")}
            </p>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {error && <p className="px-4 text-sm text-red-600">{error}</p>}

      <div className="flex gap-2 border-t border-black/5 p-4 dark:border-white/10">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !sending && handleSend()}
          placeholder={t.typePlaceholder}
          className="flex-1 rounded-lg border border-black/10 bg-white px-3.5 py-2.5 text-sm dark:border-white/10 dark:bg-bg-dark"
        />
        <Button onClick={handleSend} loading={sending}>
          {t.send}
        </Button>
      </div>
    </div>
  );
}
