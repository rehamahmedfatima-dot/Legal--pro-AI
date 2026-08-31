"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
}

export function AiAssistantWidget() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function ask() {
    const question = input.trim();
    if (!question) return;

    setMessages((prev) => [...prev, { role: "user", text: question }]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/ai/legal-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question })
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        return;
      }

      setMessages((prev) => [...prev, { role: "assistant", text: data.answer }]);
    } catch {
      setError("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-[520px] w-full max-w-xl flex-col rounded-xl2 border border-black/5 bg-white/80 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-white/5">
      <div className="border-b border-black/5 p-4 dark:border-white/10">
        <h3 className="font-semibold text-navy dark:text-white">AI Legal Assistant</h3>
        <p className="text-xs text-black/50 dark:text-white/50">
          This AI does not replace professional legal advice.
        </p>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={
              m.role === "user"
                ? "ms-auto max-w-[85%] rounded-xl2 bg-navy px-4 py-2 text-sm text-white"
                : "me-auto max-w-[85%] rounded-xl2 bg-black/5 px-4 py-2 text-sm text-navy dark:bg-white/10 dark:text-white"
            }
          >
            {m.text}
          </div>
        ))}
        {loading && (
          <div className="me-auto max-w-[85%] rounded-xl2 bg-black/5 px-4 py-2 text-sm text-black/50 dark:bg-white/10 dark:text-white/50">
            Thinking…
          </div>
        )}
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>

      <div className="flex gap-2 border-t border-black/5 p-4 dark:border-white/10">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !loading && ask()}
          placeholder="Ask a general legal question…"
          className="flex-1 rounded-lg border border-black/10 bg-white px-3.5 py-2.5 text-sm dark:border-white/10 dark:bg-bg-dark"
        />
        <Button onClick={ask} loading={loading}>
          Send
        </Button>
      </div>
    </div>
  );
}
