"use client";

import { useEffect, useState } from "react";
import { Trophy } from "lucide-react";

const CELLS = 9;
const DURATION = 20;
const BEST_KEY = "bugsquash-best";
const rnd = (a: number, b: number) => a + Math.random() * (b - a);

type Phase = "idle" | "play" | "over";

export function BugSquash() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [bugs, setBugs] = useState<Record<number, number>>({}); // cell -> expiry timestamp
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [best, setBest] = useState<number | null>(null);
  const [endAt, setEndAt] = useState(0);

  useEffect(() => {
    try { const b = localStorage.getItem(BEST_KEY); if (b) setBest(parseInt(b, 10)); } catch {}
  }, []);

  const start = () => {
    setScore(0);
    setBugs({});
    setTimeLeft(DURATION);
    setEndAt(Date.now() + DURATION * 1000);
    setPhase("play");
  };

  // game loop: spawn + expire bugs, run timer
  useEffect(() => {
    if (phase !== "play") return;
    const id = setInterval(() => {
      const now = Date.now();
      setTimeLeft(Math.max(0, (endAt - now) / 1000));
      setBugs((prev) => {
        const next: Record<number, number> = {};
        for (const k in prev) if (prev[k] > now) next[+k] = prev[k];
        if (Math.random() < 0.55) {
          const empty = Array.from({ length: CELLS }, (_, c) => c).filter((c) => !(c in next));
          if (empty.length) next[empty[Math.floor(Math.random() * empty.length)]] = now + rnd(700, 1400);
        }
        return next;
      });
      if (now >= endAt) setPhase("over");
    }, 170);
    return () => clearInterval(id);
  }, [phase, endAt]);

  // save best when a round ends
  useEffect(() => {
    if (phase !== "over") return;
    setBugs({});
    setBest((p) => {
      const n = p === null ? score : Math.max(p, score);
      try { localStorage.setItem(BEST_KEY, String(n)); } catch {}
      return n;
    });
  }, [phase, score]);

  const squash = (cell: number) => {
    if (phase !== "play" || !(cell in bugs)) return;
    setBugs((prev) => {
      const n = { ...prev };
      delete n[cell];
      return n;
    });
    setScore((s) => s + 1);
  };

  return (
    <div className="font-mono flex flex-col items-center">
      <div className="flex items-center gap-5 text-[11px] mb-3 w-full justify-center">
        <span className="text-neutral-500">SQUASHED <span className="text-accent text-sm">{score}</span></span>
        <span className="text-amber-300/90 tabular-nums text-sm">{Math.ceil(timeLeft)}s</span>
        {best !== null && <span className="text-amber-300 flex items-center gap-1 text-sm"><Trophy className="w-3.5 h-3.5" />{best}</span>}
      </div>

      <div className="relative">
        <div className="grid grid-cols-3 gap-2.5">
          {Array.from({ length: CELLS }, (_, c) => {
            const hasBug = c in bugs;
            return (
              <button
                key={c}
                type="button"
                onClick={() => squash(c)}
                className="w-[68px] h-[68px] rounded-xl border border-white/[0.08] bg-white/[0.02] flex items-center justify-center text-3xl transition-transform active:scale-90"
                style={{ cursor: hasBug ? "pointer" : "default" }}
              >
                <span className={hasBug ? "inline-block animate-[wiggle_0.5s_ease-in-out_infinite]" : "opacity-0"}>🐞</span>
              </button>
            );
          })}
        </div>

        {phase !== "play" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/55 rounded-xl backdrop-blur-sm">
            <p className="text-sm text-white text-center">
              {phase === "over" ? `Time! You squashed ${score} 🐞` : "Bug Squash"}
            </p>
            {phase === "idle" && <p className="text-[11px] text-neutral-400 text-center px-6">Click the bugs before they scurry off. 20 seconds.</p>}
            <button type="button" onClick={start} className="px-4 py-2 rounded-lg bg-accent/15 border border-accent/30 text-[13px] text-accent hover:text-white hover:bg-accent/25 transition-colors cursor-pointer">
              {phase === "over" ? "Play again" : "Start"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
