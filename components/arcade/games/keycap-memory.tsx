"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Trophy } from "lucide-react";

const BEST_KEY = "memory-best-round";
const KEYS = [
  { label: "Q", color: "#a855f7" },
  { label: "W", color: "#22d3ee" },
  { label: "E", color: "#f472b6" },
  { label: "R", color: "#fbbf24" },
];

type State = "idle" | "showing" | "input" | "over";

export function KeycapMemory() {
  const [seq, setSeq] = useState<number[]>([]);
  const [state, setState] = useState<State>("idle");
  const [lit, setLit] = useState<number | null>(null);
  const [round, setRound] = useState(0);
  const [best, setBest] = useState<number | null>(null);
  const inputPos = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    try { const b = localStorage.getItem(BEST_KEY); if (b) setBest(parseInt(b, 10)); } catch {}
    return () => timers.current.forEach(clearTimeout);
  }, []);

  const playSequence = useCallback((s: number[]) => {
    setState("showing");
    timers.current.forEach(clearTimeout);
    timers.current = [];
    s.forEach((key, i) => {
      timers.current.push(setTimeout(() => setLit(key), 600 * i + 300));
      timers.current.push(setTimeout(() => setLit(null), 600 * i + 650));
    });
    timers.current.push(setTimeout(() => { setState("input"); inputPos.current = 0; }, 600 * s.length + 400));
  }, []);

  const start = () => {
    const first = [Math.floor(Math.random() * 4)];
    setSeq(first);
    setRound(1);
    playSequence(first);
  };

  const nextRound = useCallback((prev: number[]) => {
    const s = [...prev, Math.floor(Math.random() * 4)];
    setSeq(s);
    setRound(s.length);
    playSequence(s);
  }, [playSequence]);

  const press = (key: number) => {
    if (state !== "input") return;
    setLit(key);
    setTimeout(() => setLit(null), 160);
    if (key === seq[inputPos.current]) {
      inputPos.current += 1;
      if (inputPos.current === seq.length) {
        setState("showing");
        setTimeout(() => nextRound(seq), 700);
      }
    } else {
      setState("over");
      setBest((p) => {
        const reached = seq.length - 1; // rounds fully cleared
        const next = p === null ? reached : Math.max(p, reached);
        try { localStorage.setItem(BEST_KEY, String(next)); } catch {}
        return next;
      });
    }
  };

  return (
    <div className="font-mono text-center">
      <p className="text-[11px] text-neutral-500 mb-4 h-4">
        {state === "showing" && "watch the sequence…"}
        {state === "input" && "your turn — repeat it"}
        {state === "idle" && "repeat the glowing sequence, one key longer each round"}
        {state === "over" && "wrong key!"}
      </p>

      <div className="grid grid-cols-2 gap-3 w-[220px] mx-auto">
        {KEYS.map((k, i) => (
          <button
            key={i}
            type="button"
            onClick={() => press(i)}
            disabled={state !== "input"}
            className="h-20 rounded-xl border font-bold text-lg transition-all duration-100 cursor-pointer disabled:cursor-default"
            style={{
              color: lit === i ? "#0a0a0f" : k.color,
              background: lit === i ? k.color : "rgba(255,255,255,0.03)",
              borderColor: lit === i ? k.color : "rgba(255,255,255,0.1)",
              boxShadow: lit === i ? `0 0 24px ${k.color}` : "none",
            }}
          >
            {k.label}
          </button>
        ))}
      </div>

      <div className="mt-5 h-9 flex flex-col items-center justify-center">
        {state === "idle" && <button type="button" onClick={start} className="px-4 py-2 rounded-lg bg-purple-500/15 border border-purple-500/30 text-[13px] text-purple-300 hover:text-white hover:bg-purple-500/25 transition-colors cursor-pointer">Start</button>}
        {(state === "showing" || state === "input") && <p className="text-sm text-white">round <span className="text-purple-300">{round}</span></p>}
        {state === "over" && <button type="button" onClick={start} className="px-4 py-2 rounded-lg bg-purple-500/15 border border-purple-500/30 text-[13px] text-purple-300 hover:text-white hover:bg-purple-500/25 transition-colors cursor-pointer">reached round {Math.max(0, seq.length - 1)} · retry</button>}
      </div>

      {best !== null && <p className="mt-2 text-[11px] text-neutral-500 flex items-center justify-center gap-1.5"><Trophy className="w-3 h-3 text-amber-300/80" /> best round {best}</p>}
    </div>
  );
}
