"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { RotateCcw, Trophy, Send } from "lucide-react";
import { TYPING_WORDS } from "@/lib/typing-words";

const DURATION = 30;
const WORD_COUNT = 45;
const BEST_KEY = "typing-best-wpm";
const NAME_KEY = "typing-player-name";

type Score = { name: string; wpm: number; accuracy: number };

function buildStream(count: number): string {
  const pool = [...TYPING_WORDS];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  const words: string[] = [];
  while (words.length < count) words.push(...pool);
  return words.slice(0, count).join(" ");
}

const countCorrect = (typed: string, target: string) => {
  let n = 0;
  for (let i = 0; i < typed.length; i++) if (typed[i] === target[i]) n++;
  return n;
};

export function TypingGame() {
  const [target, setTarget] = useState("");
  const [typed, setTyped] = useState("");
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [best, setBest] = useState<number | null>(null);
  const [result, setResult] = useState<{ wpm: number; acc: number; chars: number } | null>(null);
  const [board, setBoard] = useState<Score[]>([]);
  const [playerName, setPlayerName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [rank, setRank] = useState<number | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const caretRef = useRef<HTMLSpanElement>(null);
  const startTime = useRef(0);
  const typedRef = useRef("");

  const topRecord = board[0] ?? null;

  const reset = useCallback(() => {
    setTarget(buildStream(WORD_COUNT));
    setTyped("");
    typedRef.current = "";
    setStarted(false);
    setFinished(false);
    setTimeLeft(DURATION);
    setResult(null);
    setSubmitted(false);
    setRank(null);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  useEffect(() => {
    reset();
    fetch("/api/leaderboard", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setBoard(Array.isArray(d.scores) ? d.scores : []))
      .catch(() => {});
    try {
      const b = localStorage.getItem(BEST_KEY);
      if (b) setBest(parseInt(b, 10));
      const n = localStorage.getItem(NAME_KEY);
      if (n) setPlayerName(n);
    } catch {}
  }, [reset]);

  const finish = useCallback(() => {
    setFinished(true);
    const elapsed = Math.min(DURATION, (Date.now() - startTime.current) / 1000) || DURATION;
    const t = typedRef.current;
    const correct = countCorrect(t, target);
    const wpm = Math.max(0, Math.round(correct / 5 / (elapsed / 60)));
    const acc = t.length ? Math.round((correct / t.length) * 100) : 100;
    setResult({ wpm, acc, chars: correct });
    setBest((prev) => {
      const next = prev === null ? wpm : Math.max(prev, wpm);
      try { localStorage.setItem(BEST_KEY, String(next)); } catch {}
      return next;
    });
  }, [target]);

  useEffect(() => {
    if (!started || finished) return;
    const id = setInterval(() => {
      const left = Math.max(0, DURATION - (Date.now() - startTime.current) / 1000);
      setTimeLeft(left);
      if (left <= 0) finish();
    }, 100);
    return () => clearInterval(id);
  }, [started, finished, finish]);

  useEffect(() => { caretRef.current?.scrollIntoView({ block: "nearest" }); }, [typed]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (finished) return;
    if (!started) { setStarted(true); startTime.current = Date.now(); }
    const val = e.target.value.slice(0, target.length);
    typedRef.current = val;
    setTyped(val);
    if (val.length >= target.length) finish();
  };

  const submitScore = async () => {
    const nm = playerName.trim();
    if (!result || result.wpm <= 0 || submitting || submitted || !nm) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/leaderboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nm, wpm: result.wpm, accuracy: result.acc }),
      });
      const data = await res.json();
      if (res.ok) {
        setBoard(Array.isArray(data.scores) ? data.scores : board);
        setRank(typeof data.rank === "number" ? data.rank : null);
        setSubmitted(true);
        try { localStorage.setItem(NAME_KEY, nm); } catch {}
      }
    } finally {
      setSubmitting(false);
    }
  };

  const liveElapsed = started ? Math.max(0.001, DURATION - timeLeft) : 0;
  const liveCorrect = countCorrect(typed, target);
  const liveWpm = started ? Math.max(0, Math.round(liveCorrect / 5 / (liveElapsed / 60))) : 0;
  const liveAcc = typed.length ? Math.round((liveCorrect / typed.length) * 100) : 100;
  const beatRecord = result && topRecord && result.wpm > topRecord.wpm;

  return (
    <div className="font-mono" onClick={() => !finished && inputRef.current?.focus()}>
      <div className="flex items-center gap-5 text-[11px] mb-4">
        <span className="text-neutral-500">WPM <span className="text-purple-300 text-sm">{result ? result.wpm : liveWpm}</span></span>
        <span className="text-neutral-500">ACC <span className="text-purple-300 text-sm">{result ? result.acc : liveAcc}%</span></span>
        <span className="ml-auto tabular-nums text-amber-300/90 text-sm">{Math.ceil(timeLeft)}s</span>
        {best !== null && <span className="text-neutral-600 flex items-center gap-1"><Trophy className="w-3 h-3" />{best}</span>}
      </div>

      <input ref={inputRef} value={typed} onChange={onChange} disabled={finished} autoCapitalize="off" autoCorrect="off" autoComplete="off" spellCheck={false} aria-label="Typing input" className="absolute opacity-0 w-px h-px pointer-events-none" />

      {!finished ? (
        <>
          {!started && topRecord && (
            <div className="flex items-center gap-2.5 rounded-xl border border-amber-400/25 px-3.5 py-2.5 mb-4" style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.12), rgba(20,14,8,0.5))" }}>
              <Trophy className="w-6 h-6 text-amber-300 shrink-0" style={{ filter: "drop-shadow(0 0 8px rgba(251,191,36,0.5))" }} />
              <div>
                <p className="text-[10px] tracking-[0.25em] text-amber-300/80 uppercase">Top Record</p>
                <p className="text-sm text-white"><span className="text-amber-200 font-bold">{topRecord.wpm}</span> wpm · {topRecord.name}</p>
              </div>
            </div>
          )}
          <div className="text-[15px] leading-[2] tracking-wide max-h-[150px] overflow-hidden cursor-text">
            {target.split("").map((ch, i) => {
              let cls = "text-neutral-600";
              if (i < typed.length) cls = typed[i] === ch ? "text-white" : "text-red-400 bg-red-500/15 rounded-sm";
              const isCaret = i === typed.length;
              return <span key={i} ref={isCaret ? caretRef : undefined} className={`${cls} ${isCaret ? "border-l-2 border-purple-400 -ml-[1px] animate-pulse" : ""}`}>{ch}</span>;
            })}
          </div>
          {!started && <p className="mt-5 text-[11px] text-neutral-600"><span className="text-purple-400">❯</span> start typing to begin the {DURATION}s test...</p>}
        </>
      ) : (
        <div className="text-center">
          {beatRecord ? (
            <p className="text-[11px] text-amber-300 mb-2 flex items-center justify-center gap-1.5"><Trophy className="w-3.5 h-3.5" /> you beat the top record!</p>
          ) : best !== null && result && result.wpm >= best && result.wpm > 0 ? (
            <p className="text-[11px] text-purple-300 mb-2">new personal best!</p>
          ) : null}
          <div className="flex items-end justify-center gap-1"><span className="text-6xl font-bold text-white">{result?.wpm}</span><span className="text-sm text-purple-300 mb-2">wpm</span></div>
          <div className="flex items-center justify-center gap-6 mt-2 text-[12px] text-neutral-400"><span>accuracy <span className="text-purple-300">{result?.acc}%</span></span><span>chars <span className="text-purple-300">{result?.chars}</span></span></div>
          {topRecord && !beatRecord && (
            <p className="mt-3 text-[11px] text-amber-300/90 flex items-center justify-center gap-1.5"><Trophy className="w-3 h-3" /> record: {topRecord.wpm} by {topRecord.name}{result && result.wpm > 0 && <span className="text-neutral-500">({topRecord.wpm - result.wpm} to go)</span>}</p>
          )}
          {result && result.wpm > 0 && !submitted && (
            <div className="mt-5 flex items-center justify-center gap-2">
              <input value={playerName} onChange={(e) => setPlayerName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submitScore()} placeholder="your name" maxLength={20} className="w-36 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 focus:border-purple-500/40 outline-none text-[12px] text-white placeholder:text-neutral-600" />
              <button type="button" onClick={submitScore} disabled={submitting} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/15 border border-purple-500/30 text-[12px] text-purple-300 hover:text-white hover:bg-purple-500/25 transition-colors cursor-pointer disabled:opacity-50"><Send className="w-3.5 h-3.5" />{submitting ? "Saving..." : "Submit"}</button>
            </div>
          )}
          {submitted && board.length > 0 && (
            <div className="mt-5 text-left">
              <p className="text-[10px] tracking-[0.25em] text-amber-300/80 uppercase mb-2 flex items-center gap-1.5"><Trophy className="w-3 h-3" /> Top racers{rank && <span className="ml-auto text-neutral-500 normal-case tracking-normal">you ranked #{rank}</span>}</p>
              <div className="space-y-1">
                {board.slice(0, 5).map((s, i) => (
                  <div key={i} className="flex items-center gap-3 px-3 py-1.5 rounded-md text-[12px] bg-white/[0.02]">
                    <span className={`w-4 ${i === 0 ? "text-amber-300" : "text-neutral-600"}`}>{i + 1}</span>
                    <span className="flex-1 truncate text-neutral-200">{s.name}</span>
                    <span className="text-purple-300">{s.wpm}</span>
                    <span className="text-neutral-600 text-[10px]">{s.accuracy}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <button type="button" onClick={reset} className="mt-6 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-white/10 text-sm text-neutral-300 hover:text-white hover:border-purple-500/40 hover:bg-purple-500/10 transition-colors cursor-pointer"><RotateCcw className="w-3.5 h-3.5" /> Play again</button>
        </div>
      )}
    </div>
  );
}
