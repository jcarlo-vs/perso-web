"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { TYPING_WORDS } from "@/lib/typing-words";

const PASSAGE_WORDS = 16;
const DEFAULT_GHOST_WPM = 55;

function buildPassage(): string {
  const pool = [...TYPING_WORDS];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, PASSAGE_WORDS).join(" ");
}

const countCorrect = (typed: string, target: string) => {
  let n = 0;
  for (let i = 0; i < typed.length; i++) if (typed[i] === target[i]) n++;
  return n;
};

export function GhostRace() {
  const [target, setTarget] = useState("");
  const [typed, setTyped] = useState("");
  const [ghostWpm, setGhostWpm] = useState(DEFAULT_GHOST_WPM);
  const [ghostName, setGhostName] = useState("the record holder");
  const [ghostProgress, setGhostProgress] = useState(0); // chars
  const [started, setStarted] = useState(false);
  const [result, setResult] = useState<null | "win" | "lose">(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const caretRef = useRef<HTMLSpanElement>(null);
  const startTime = useRef(0);
  const raf = useRef(0);

  const reset = useCallback((p: string) => {
    setTarget(p);
    setTyped("");
    setGhostProgress(0);
    setStarted(false);
    setResult(null);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  useEffect(() => {
    reset(buildPassage());
    fetch("/api/leaderboard", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        const top = Array.isArray(d.scores) && d.scores[0];
        if (top && top.wpm > 0) { setGhostWpm(top.wpm); setGhostName(top.name); }
      })
      .catch(() => {});
    return () => cancelAnimationFrame(raf.current);
  }, [reset]);

  useEffect(() => { caretRef.current?.scrollIntoView({ block: "nearest" }); }, [typed]);

  const finish = useCallback((outcome: "win" | "lose") => {
    cancelAnimationFrame(raf.current);
    setResult(outcome);
  }, []);

  // ghost loop
  useEffect(() => {
    if (!started || result) return;
    const cps = (ghostWpm * 5) / 60;
    const loop = (now: number) => {
      const elapsed = (now - startTime.current) / 1000;
      const g = Math.min(target.length, cps * elapsed);
      setGhostProgress(g);
      if (g >= target.length) { finish("lose"); return; }
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, [started, result, ghostWpm, target.length, finish]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (result) return;
    if (!started) { setStarted(true); startTime.current = performance.now(); }
    const val = e.target.value.slice(0, target.length);
    setTyped(val);
    if (countCorrect(val, target) >= target.length) finish("win");
  };

  const playerPct = target.length ? (countCorrect(typed, target) / target.length) * 100 : 0;
  const ghostPct = target.length ? (ghostProgress / target.length) * 100 : 0;

  return (
    <div className="font-mono" onClick={() => !result && inputRef.current?.focus()}>
      <p className="text-[11px] text-neutral-500 mb-3">
        <span className="text-purple-400">❯</span> race the ghost of <span className="text-amber-300">{ghostName}</span> ({ghostWpm} wpm) — type the line before it finishes
      </p>

      <div className="space-y-2 mb-4">
        <div>
          <div className="flex justify-between text-[10px] mb-1"><span className="text-purple-300">you</span><span className="text-neutral-500">{Math.round(playerPct)}%</span></div>
          <div className="h-2 rounded-full bg-white/[0.05] overflow-hidden"><div className="h-full bg-purple-400 transition-[width] duration-75" style={{ width: `${playerPct}%` }} /></div>
        </div>
        <div>
          <div className="flex justify-between text-[10px] mb-1"><span className="text-amber-300/80">👻 {ghostName}</span><span className="text-neutral-500">{Math.round(ghostPct)}%</span></div>
          <div className="h-2 rounded-full bg-white/[0.05] overflow-hidden"><div className="h-full bg-amber-400/70" style={{ width: `${ghostPct}%` }} /></div>
        </div>
      </div>

      <input ref={inputRef} value={typed} onChange={onChange} disabled={!!result} autoCapitalize="off" autoCorrect="off" autoComplete="off" spellCheck={false} aria-label="Typing input" className="absolute opacity-0 w-px h-px pointer-events-none" />

      {!result ? (
        <>
          <div className="text-[15px] leading-[2] tracking-wide cursor-text">
            {target.split("").map((ch, i) => {
              let cls = "text-neutral-600";
              if (i < typed.length) cls = typed[i] === ch ? "text-white" : "text-red-400 bg-red-500/15 rounded-sm";
              const isCaret = i === typed.length;
              return <span key={i} ref={isCaret ? caretRef : undefined} className={`${cls} ${isCaret ? "border-l-2 border-purple-400 -ml-[1px] animate-pulse" : ""}`}>{ch}</span>;
            })}
          </div>
          {!started && <p className="mt-4 text-[11px] text-neutral-600">start typing to begin the race…</p>}
        </>
      ) : (
        <div className="text-center py-4">
          <p className={`text-xl font-bold ${result === "win" ? "text-emerald-300" : "text-neutral-300"}`}>
            {result === "win" ? "🏁 You beat the ghost!" : "👻 The ghost won this one"}
          </p>
          <button type="button" onClick={() => reset(buildPassage())} className="mt-4 px-4 py-2 rounded-lg bg-purple-500/15 border border-purple-500/30 text-[13px] text-purple-300 hover:text-white hover:bg-purple-500/25 transition-colors cursor-pointer">Race again</button>
        </div>
      )}
    </div>
  );
}
