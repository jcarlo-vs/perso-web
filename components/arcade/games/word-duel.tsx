"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { TECH_SET, TECH_WORDS } from "@/lib/tech-words";

type Turn = "player" | "ai";
type Entry = { word: string; by: Turn };

const BEST_KEY = "wordduel-best";

function localOpponent(letter: string, used: Set<string>): string | null {
  const opts = TECH_WORDS.filter((w) => w[0] === letter && !used.has(w));
  if (!opts.length) return null;
  return opts[Math.floor(Math.random() * opts.length)];
}

export function WordDuel() {
  const [chain, setChain] = useState<Entry[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"intro" | "player" | "thinking" | "won" | "lost">("intro");
  const [taunt, setTaunt] = useState("");
  const [error, setError] = useState("");
  const [best, setBest] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const used = useRef<Set<string>>(new Set());
  const requiredLetter = chain.length ? chain[chain.length - 1].word.slice(-1) : "";

  useEffect(() => {
    try { const b = localStorage.getItem(BEST_KEY); if (b) setBest(parseInt(b, 10)); } catch {}
  }, []);

  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight }); }, [chain, taunt]);

  const start = () => {
    used.current = new Set();
    setChain([]);
    setInput("");
    setTaunt("");
    setError("");
    setStatus("player");
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const endLost = (reason: string) => { setError(reason); setStatus("lost"); };

  const recordBest = useCallback((playerWords: number) => {
    setBest((p) => {
      const n = p === null ? playerWords : Math.max(p, playerWords);
      try { localStorage.setItem(BEST_KEY, String(n)); } catch {}
      return n;
    });
  }, []);

  const aiMove = useCallback(async (letter: string, currentChain: Entry[]) => {
    setStatus("thinking");
    let aiWord: string | null = null;
    let aiTaunt = "";
    try {
      const res = await fetch("/api/word-duel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chain: currentChain.map((e) => e.word), letter }),
      });
      const data = await res.json();
      const w = typeof data.word === "string" ? data.word.toLowerCase() : null;
      if (w && w[0] === letter && !used.current.has(w) && TECH_SET.has(w)) {
        aiWord = w;
        aiTaunt = typeof data.taunt === "string" ? data.taunt : "";
      }
    } catch {}
    if (!aiWord) aiWord = localOpponent(letter, used.current); // fallback opponent

    if (!aiWord) {
      // AI can't continue -> player wins
      const playerWords = currentChain.filter((e) => e.by === "player").length;
      recordBest(playerWords);
      setTaunt("Ok, you got me — I'm out of words. You win! 🏳️");
      setStatus("won");
      return;
    }
    used.current.add(aiWord);
    setChain((c) => [...c, { word: aiWord!, by: "ai" }]);
    setTaunt(aiTaunt || "your move.");
    setStatus("player");
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [recordBest]);

  const submit = () => {
    if (status !== "player") return;
    const w = input.trim().toLowerCase().replace(/[^a-z]/g, "");
    setInput("");
    if (w.length < 2) { setError("at least 2 letters"); return; }
    if (requiredLetter && w[0] !== requiredLetter) { endLost(`"${w}" must start with "${requiredLetter.toUpperCase()}"`); return; }
    if (used.current.has(w)) { endLost(`"${w}" was already used`); return; }
    if (!TECH_SET.has(w)) { endLost(`"${w}" isn't in our tech dictionary`); return; }

    used.current.add(w);
    const newChain: Entry[] = [...chain, { word: w, by: "player" }];
    setChain(newChain);
    setError("");
    aiMove(w.slice(-1), newChain);
  };

  const playerCount = chain.filter((e) => e.by === "player").length;

  return (
    <div className="font-mono flex flex-col h-full">
      {status === "intro" ? (
        <div className="text-center my-auto">
          <p className="text-3xl mb-2">🤖⚔️</p>
          <p className="text-sm text-white mb-1">Beat the AI: Word Duel</p>
          <p className="text-[12px] text-neutral-400 max-w-xs mx-auto mb-5">
            Trade tech words with Juan&apos;s AI. Each word must start with the last letter of the previous one — no repeats. Stump it to win.
          </p>
          <button type="button" onClick={start} className="px-4 py-2 rounded-lg bg-purple-500/15 border border-purple-500/30 text-[13px] text-purple-300 hover:text-white hover:bg-purple-500/25 transition-colors cursor-pointer">Start duel</button>
          {best !== null && <p className="mt-4 text-[11px] text-neutral-500">your longest streak: {best} words</p>}
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between text-[11px] mb-2">
            <span className="text-neutral-500">your words <span className="text-purple-300 text-sm">{playerCount}</span></span>
            {best !== null && <span className="text-amber-300/80">best {best}</span>}
          </div>
          <div ref={scrollRef} className="flex-1 max-h-[220px] overflow-y-auto space-y-1.5 pr-1 mb-3">
            {chain.map((e, i) => (
              <div key={i} className={`flex ${e.by === "player" ? "justify-end" : "justify-start"}`}>
                <span className={`px-3 py-1.5 rounded-lg text-[13px] ${e.by === "player" ? "bg-purple-500/15 border border-purple-500/25 text-purple-200" : "bg-white/[0.04] border border-white/10 text-neutral-200"}`}>
                  {e.by === "ai" && <span className="text-fuchsia-400 mr-1">🤖</span>}{e.word}
                </span>
              </div>
            ))}
            {status === "thinking" && <div className="text-left"><span className="px-3 py-1.5 rounded-lg text-[13px] bg-white/[0.04] border border-white/10 text-neutral-500">🤖 thinking…</span></div>}
            {taunt && (status === "player" || status === "won") && <p className="text-[11px] text-fuchsia-300/80 text-center pt-1">🤖 “{taunt}”</p>}
          </div>

          {status === "player" && (
            <form onSubmit={(e) => { e.preventDefault(); submit(); }} className="flex items-center gap-2">
              <span className="text-purple-400 text-sm">❯</span>
              <input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} placeholder={requiredLetter ? `tech word starting with "${requiredLetter.toUpperCase()}"` : "any tech word to begin"} maxLength={20} autoCapitalize="off" autoCorrect="off" spellCheck={false} className="flex-1 bg-transparent text-[13px] text-white placeholder:text-neutral-600 outline-none" />
              <button type="submit" className="px-3 py-1.5 rounded-lg bg-purple-500/15 border border-purple-500/30 text-[12px] text-purple-300 hover:text-white hover:bg-purple-500/25 transition-colors cursor-pointer">Play</button>
            </form>
          )}
          {error && status === "player" && <p className="text-[11px] text-amber-400 mt-1.5">{error}</p>}

          {(status === "won" || status === "lost") && (
            <div className="text-center pt-2">
              <p className={`text-sm ${status === "won" ? "text-emerald-300" : "text-neutral-300"}`}>
                {status === "won" ? `🏆 You win! ${playerCount}-word streak.` : `Defeated — ${error}. Streak: ${playerCount}.`}
              </p>
              <button type="button" onClick={start} className="mt-3 px-4 py-2 rounded-lg bg-purple-500/15 border border-purple-500/30 text-[13px] text-purple-300 hover:text-white hover:bg-purple-500/25 transition-colors cursor-pointer">Rematch</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
