"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft } from "lucide-react";
import { TypingGame } from "./games/typing-game";
import { ReactionGame } from "./games/reaction";
import { KeycapMemory } from "./games/keycap-memory";
import { SnakeGame } from "./games/snake";
import { BugSquash } from "./games/bug-squash";

const GAMES = [
  { id: "type", emoji: "⌨️", name: "Type the Stack", desc: "30s speed test + global leaderboard", Comp: TypingGame },
  { id: "react", emoji: "⚡", name: "Reaction Time", desc: "Click the instant it turns green", Comp: ReactionGame },
  { id: "memory", emoji: "🧠", name: "Keycap Memory", desc: "Repeat the glowing sequence", Comp: KeycapMemory },
  { id: "snake", emoji: "🐍", name: "Terminal Snake", desc: "Eat, grow, don't bite yourself", Comp: SnakeGame },
  { id: "bugs", emoji: "🐛", name: "Bug Squash", desc: "Squash the bugs before they escape", Comp: BugSquash },
];

export function Arcade({ onClose }: { onClose: () => void }) {
  const [active, setActive] = useState<string | null>(null);
  const current = GAMES.find((g) => g.id === active);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (active) setActive(null);
        else onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [active, onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 bg-black/40"
        onClick={onClose}
      />
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
            background: "linear-gradient(135deg, rgba(20,20,28,0.94) 0%, rgba(10,10,16,0.96) 100%)",
            backdropFilter: "blur(20px) saturate(1.8)",
            WebkitBackdropFilter: "blur(20px) saturate(1.8)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.12)",
          }}
        >
          {/* title bar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
              <span className="w-3 h-3 rounded-full bg-[#28c840]" />
              <span className="ml-3 font-mono text-[11px] text-neutral-500">
                {current ? `arcade / ${current.name.toLowerCase()}` : "arcade"}
              </span>
            </div>
            <div className="flex items-center gap-1">
              {active && (
                <button type="button" onClick={() => setActive(null)} title="Back to games" className="p-1 rounded-lg text-neutral-500 hover:text-white hover:bg-white/10 transition-colors cursor-pointer">
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              <button type="button" onClick={onClose} title="Close" className="p-1 rounded-lg text-neutral-500 hover:text-white hover:bg-white/10 transition-colors cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* body */}
          <div className="p-5 min-h-[360px] flex flex-col">
            {current ? (
              <current.Comp />
            ) : (
              <div>
                <p className="font-mono text-[11px] text-neutral-500 mb-4">
                  <span className="text-purple-400">❯</span> pick a game — high scores save locally
                </p>
                <div className="grid sm:grid-cols-2 gap-2.5">
                  {GAMES.map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setActive(g.id)}
                      className="group flex items-center gap-3 p-3 rounded-xl border border-white/[0.08] hover:border-purple-500/40 hover:bg-purple-500/[0.06] transition-all text-left cursor-pointer"
                    >
                      <span className="text-2xl shrink-0 group-hover:scale-110 transition-transform">{g.emoji}</span>
                      <span className="min-w-0">
                        <span className="block text-sm text-white/90 group-hover:text-purple-200 transition-colors">{g.name}</span>
                        <span className="block text-[11px] text-neutral-500 truncate">{g.desc}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
