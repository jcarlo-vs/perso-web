"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Zap, Trophy } from "lucide-react";

const BEST_KEY = "reaction-best-ms";
type Phase = "idle" | "waiting" | "go" | "result" | "tooSoon";

export function ReactionGame() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [ms, setMs] = useState(0);
  const [best, setBest] = useState<number | null>(null);
  const goAt = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try { const b = localStorage.getItem(BEST_KEY); if (b) setBest(parseInt(b, 10)); } catch {}
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, []);

  const arm = useCallback(() => {
    setPhase("waiting");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      goAt.current = performance.now();
      setPhase("go");
    }, 1400 + Math.random() * 2600);
  }, []);

  const handle = () => {
    if (phase === "idle" || phase === "result" || phase === "tooSoon") {
      arm();
    } else if (phase === "waiting") {
      if (timer.current) clearTimeout(timer.current);
      setPhase("tooSoon");
    } else if (phase === "go") {
      const t = Math.round(performance.now() - goAt.current);
      setMs(t);
      setBest((prev) => {
        const next = prev === null ? t : Math.min(prev, t);
        try { localStorage.setItem(BEST_KEY, String(next)); } catch {}
        return next;
      });
      setPhase("result");
    }
  };

  const bg =
    phase === "go" ? "rgba(34,197,94,0.18)" :
    phase === "waiting" ? "rgba(220,38,38,0.14)" :
    phase === "tooSoon" ? "rgba(220,38,38,0.2)" :
    "rgba(255,255,255,0.02)";
  const border =
    phase === "go" ? "rgba(74,222,128,0.5)" :
    phase === "waiting" ? "rgba(248,113,113,0.4)" :
    "rgba(168,85,247,0.25)";

  return (
    <div className="font-mono">
      <button
        type="button"
        onClick={handle}
        className="w-full h-[240px] rounded-xl flex flex-col items-center justify-center gap-3 transition-colors cursor-pointer select-none"
        style={{ background: bg, border: `1px solid ${border}` }}
      >
        {phase === "idle" && (
          <>
            <Zap className="w-8 h-8 text-purple-300" />
            <p className="text-sm text-white">Reaction Time</p>
            <p className="text-[12px] text-neutral-400">Click to start, then click the instant it turns green.</p>
          </>
        )}
        {phase === "waiting" && (
          <>
            <p className="text-lg text-red-300">wait for green…</p>
            <p className="text-[11px] text-neutral-500">don&apos;t click yet</p>
          </>
        )}
        {phase === "go" && <p className="text-3xl font-bold text-emerald-300 tracking-widest">CLICK!</p>}
        {phase === "tooSoon" && (
          <>
            <p className="text-lg text-red-300">too soon! 😅</p>
            <p className="text-[12px] text-neutral-400">click to try again</p>
          </>
        )}
        {phase === "result" && (
          <>
            <div className="flex items-end gap-1"><span className="text-5xl font-bold text-white">{ms}</span><span className="text-sm text-purple-300 mb-1.5">ms</span></div>
            <p className="text-[12px] text-neutral-400">{ms < 200 ? "lightning ⚡" : ms < 280 ? "sharp" : ms < 380 ? "solid" : "click again to beat it"}</p>
            <p className="text-[12px] text-neutral-500">click to go again</p>
          </>
        )}
      </button>
      {best !== null && (
        <p className="mt-3 text-center text-[11px] text-neutral-500 flex items-center justify-center gap-1.5">
          <Trophy className="w-3 h-3 text-amber-300/80" /> best {best} ms
        </p>
      )}
    </div>
  );
}
