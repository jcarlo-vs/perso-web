"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { Sparkles, X, Mail } from "lucide-react";

type ChatMessage = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "What's his strongest tech stack?",
  "Tell me about TALENT SCREEN",
  "Why should we hire him?",
];

// The AI (and the error states) emit this token to surface a Send Email button.
const EMAIL_CTA = "[[SEND_EMAIL]]";

// Remove the token from displayed text, including a partial token still streaming in.
function stripCta(text: string): string {
  return text
    .replace(/\[\[SEND_EMAIL\]\]/g, "")
    .replace(/\s*\[\[?[A-Z_]*\]?$/, "")
    .trimEnd();
}

export function AiTerminal() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Open via custom event (from status bar button or command palette)
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("ai-terminal:open", handler);
    return () => window.removeEventListener("ai-terminal:open", handler);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 250);
      const handleKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") setOpen(false);
      };
      window.addEventListener("keydown", handleKey);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKey);
      };
    }
    document.body.style.overflow = "";
  }, [open]);

  // Keep scrolled to the bottom while streaming
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  const send = useCallback(
    async (text: string) => {
      const question = text.trim();
      if (!question || streaming) return;
      setInput("");
      setStreaming(true);

      const history: ChatMessage[] = [...messages, { role: "user", content: question }];
      setMessages([...history, { role: "assistant", content: "" }]);

      const appendToReply = (chunk: string) => {
        setMessages((prev) => {
          const next = [...prev];
          const last = next[next.length - 1];
          next[next.length - 1] = { ...last, content: last.content + chunk };
          return next;
        });
      };

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => null);
          const msg = data?.error ?? "Something went wrong - please try again.";
          appendToReply(`${msg}\n\nYou can always reach Juan Carlo directly:\n${EMAIL_CTA}`);
          return;
        }

        const reader = res.body?.getReader();
        if (!reader) {
          appendToReply(`Something went wrong - please try again.\n\nYou can reach Juan Carlo directly:\n${EMAIL_CTA}`);
          return;
        }
        const decoder = new TextDecoder();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          appendToReply(decoder.decode(value, { stream: true }));
        }
      } catch {
        appendToReply(`Connection failed - please try again.\n\nYou can reach Juan Carlo directly:\n${EMAIL_CTA}`);
      } finally {
        setStreaming(false);
        inputRef.current?.focus();
      }
    },
    [messages, streaming]
  );

  const openEmail = useCallback(() => {
    setOpen(false);
    setTimeout(() => window.dispatchEvent(new CustomEvent("open-email-modal")), 220);
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/40"
            onClick={() => setOpen(false)}
          />

          {/* Terminal window */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[92%] max-w-xl"
          >
            <div
              className="rounded-2xl overflow-hidden border border-white/[0.15]"
              style={{
                background: "linear-gradient(135deg, rgba(20,20,28,0.92) 0%, rgba(10,10,16,0.94) 100%)",
                backdropFilter: "blur(20px) saturate(1.8)",
                WebkitBackdropFilter: "blur(20px) saturate(1.8)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.12)",
              }}
            >
              {/* Title bar */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                  <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
                  <span className="w-3 h-3 rounded-full bg-[#28c840]" />
                  <span className="ml-3 font-mono text-[11px] text-neutral-500">
                    ask-juan-ai — powered by Claude
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  title="Close"
                  className="p-1 rounded-lg text-neutral-500 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Transcript */}
              <div ref={scrollRef} className="h-[320px] overflow-y-auto px-4 py-4 font-mono text-[12.5px] leading-relaxed scrollbar-thin">
                {messages.length === 0 && (
                  <div>
                    <p className="text-neutral-400 mb-1">
                      <span className="text-accent">❯</span> Hi! Ask me anything about Juan Carlo — his experience, projects, or skills.
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {SUGGESTIONS.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => send(s)}
                          className="text-[11px] text-accent/80 px-2.5 py-1 rounded-full bg-accent/10 border border-accent/20 hover:bg-accent/20 hover:text-white transition-colors cursor-pointer"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((m, i) => (
                  <div key={i} className="mb-3">
                    {m.role === "user" ? (
                      <p className="text-white/90">
                        <span className="text-accent">❯ </span>
                        {m.content}
                      </p>
                    ) : (
                      <div>
                        <p className="text-neutral-400 whitespace-pre-wrap">
                          {stripCta(m.content)}
                          {streaming && i === messages.length - 1 && (
                            <span className="inline-block w-[7px] h-[13px] bg-accent/70 ml-0.5 align-middle animate-pulse" />
                          )}
                        </p>
                        {m.content.includes(EMAIL_CTA) && !(streaming && i === messages.length - 1) && (
                          <button
                            type="button"
                            onClick={openEmail}
                            className="mt-2.5 inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-accent/15 border border-accent/30 text-[12px] text-accent hover:text-white hover:bg-accent/25 hover:border-accent/50 transition-colors cursor-pointer"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            Send Juan an email
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send(input);
                }}
                className="flex items-center gap-2 px-4 py-3 border-t border-white/[0.08]"
              >
                <span className="text-accent font-mono text-sm">❯</span>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={streaming ? "Thinking..." : "Ask about Juan Carlo..."}
                  disabled={streaming}
                  maxLength={1000}
                  className="flex-1 bg-transparent font-mono text-[13px] text-white placeholder:text-neutral-600 outline-none disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={streaming || !input.trim()}
                  title="Send"
                  className="p-1.5 rounded-lg text-accent hover:text-white hover:bg-accent/20 transition-colors disabled:opacity-30 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
