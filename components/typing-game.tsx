"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { X, RotateCcw, Trophy, Keyboard, Send } from "lucide-react";
import { TYPING_WORDS } from "@/lib/typing-words";

const DURATION = 30; // seconds
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

function countCorrect(typed: string, target: string): number {
  let n = 0;
  for (let i = 0; i < typed.length; i++) if (typed[i] === target[i]) n++;
  return n;
}

export function TypingGame() {
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState("");
  const [typed, setTyped] = useState("");
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [best, setBest] = useState<number | null>(null);
  const [result, setResult] = useState<{ wpm: number; acc: number; chars: number } | null>(null);

  // Leaderboard
  const [board, setBoard] = useState<Score[]>([]);
  const [playerName, setPlayerName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [rank, setRank] = useState<number | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const caretRef = useRef<HTMLSpanElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const startTime = useRef(0);
  const typedRef = useRef("");

  const topRecord = board.length ? board[0] : null;

  const loadBoard = useCallback(async () => {
    try {
      const res = await fetch("/api/leaderboard", { cache: "no-store" });
      const data = await res.json();
      setBoard(Array.isArray(data.scores) ? data.scores : []);
    } catch {
      setBoard([]);
    }
  }, []);

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
    setSubmitError(null);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  // Open via custom event
  useEffect(() => {
    const handler = () => {
      setOpen(true);
      reset();
      loadBoard();
    };
    window.addEventListener("typing-game:open", handler);
    return () => window.removeEventListener("typing-game:open", handler);
  }, [reset, loadBoard]);

  // Load local best + last name
  useEffect(() => {
    try {
      const b = localStorage.getItem(BEST_KEY);
      if (b) setBest(parseInt(b, 10));
      const n = localStorage.getItem(NAME_KEY);
      if (n) setPlayerName(n);
    } catch {
      /* ignore */
    }
  }, []);

  // Body scroll lock + escape
  useEffect(() => {
    if (!open) {
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

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
      try {
        localStorage.setItem(BEST_KEY, String(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, [target]);

  // Countdown
  useEffect(() => {
    if (!started || finished) return;
    const id = setInterval(() => {
      const elapsed = (Date.now() - startTime.current) / 1000;
      const left = Math.max(0, DURATION - elapsed);
      setTimeLeft(left);
      if (left <= 0) finish();
    }, 100);
    return () => clearInterval(id);
  }, [started, finished, finish]);

  useEffect(() => {
    caretRef.current?.scrollIntoView({ block: "nearest" });
  }, [typed]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (finished) return;
    if (!started) {
      setStarted(true);
      startTime.current = Date.now();
    }
    const val = e.target.value.slice(0, target.length);
    typedRef.current = val;
    setTyped(val);
    if (val.length >= target.length) finish();
  };

  const submitScore = async () => {
    const nm = playerName.trim();
    if (!result || result.wpm <= 0 || submitting || submitted) return;
    if (!nm) {
      nameRef.current?.focus();
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
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
        try {
          localStorage.setItem(NAME_KEY, nm);
        } catch {
          /* ignore */
        }
      } else {
        setSubmitError(data.error ?? "Could not save your score.");
      }
    } catch {
      setSubmitError("Could not save your score.");
    } finally {
      setSubmitting(false);
    }
  };

  // Live stats
  const liveElapsed = started ? Math.max(0.001, DURATION - timeLeft) : 0;
  const liveCorrect = countCorrect(typed, target);
  const liveWpm = started ? Math.max(0, Math.round(liveCorrect / 5 / (liveElapsed / 60))) : 0;
  const liveAcc = typed.length ? Math.round((liveCorrect / typed.length) * 100) : 100;

  const beatRecord = result !== null && topRecord !== null && result.wpm > topRecord.wpm;

  // Prominent trophy / top-record banner
  const RecordBanner = () => (
    <div
      className="flex items-center gap-3 rounded-xl border border-amber-400/25 px-4 py-3"
      style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.12) 0%, rgba(20,14,8,0.5) 100%)" }}
    >
      <motion.div
        animate={{ rotate: [0, -8, 8, -5, 0], scale: [1, 1.12, 1] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        className="shrink-0"
        style={{ filter: "drop-shadow(0 0 8px rgba(251,191,36,0.55))" }}
      >
        <Trophy className="w-7 h-7 text-amber-300" />
      </motion.div>
      <div className="min-w-0">
        <p className="font-mono text-[10px] tracking-[0.25em] text-amber-300/80 uppercase">Top Record</p>
        {topRecord ? (
          <p className="font-mono text-sm text-white">
            <span className="text-amber-200 font-bold">{topRecord.wpm}</span> wpm
            <span className="text-neutral-500"> · </span>
            <span className="text-neutral-300">{topRecord.name}</span>
          </p>
        ) : (
          <p className="font-mono text-sm text-neutral-300">Be the first to set it!</p>
        )}
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/40"
            onClick={() => setOpen(false)}
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
              {/* Title bar */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                  <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
                  <span className="w-3 h-3 rounded-full bg-[#28c840]" />
                  <span className="ml-3 font-mono text-[11px] text-neutral-500 flex items-center gap-1.5">
                    <Keyboard className="w-3.5 h-3.5" /> type-the-stack
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

              {/* Stats bar */}
              <div className="flex items-center gap-5 px-4 py-2.5 border-b border-white/[0.06] font-mono text-[11px]">
                <span className="text-neutral-500">
                  WPM <span className="text-purple-300 text-sm">{result ? result.wpm : liveWpm}</span>
                </span>
                <span className="text-neutral-500">
                  ACC <span className="text-purple-300 text-sm">{result ? result.acc : liveAcc}%</span>
                </span>
                <span className="ml-auto tabular-nums text-amber-300/90 text-sm">{Math.ceil(timeLeft)}s</span>
                {best !== null && (
                  <span className="text-neutral-600 flex items-center gap-1" title="Your local best">
                    <Trophy className="w-3 h-3" /> {best}
                  </span>
                )}
              </div>

              {/* Body */}
              <div className="relative px-5 py-5 min-h-[200px]" onClick={() => !finished && inputRef.current?.focus()}>
                <input
                  ref={inputRef}
                  value={typed}
                  onChange={onChange}
                  disabled={finished}
                  autoCapitalize="off"
                  autoCorrect="off"
                  autoComplete="off"
                  spellCheck={false}
                  aria-label="Typing input"
                  className="absolute opacity-0 w-px h-px pointer-events-none"
                />

                {!finished ? (
                  <>
                    {/* Prominent record banner on the start screen */}
                    {!started && (
                      <div className="mb-5">
                        <RecordBanner />
                      </div>
                    )}

                    <div
                      data-target={target}
                      className="font-mono text-[15px] leading-[2] tracking-wide max-h-[150px] overflow-hidden text-left cursor-text"
                    >
                      {target.split("").map((ch, i) => {
                        let cls = "text-neutral-600";
                        if (i < typed.length) {
                          cls = typed[i] === ch ? "text-white" : "text-red-400 bg-red-500/15 rounded-sm";
                        }
                        const isCaret = i === typed.length;
                        return (
                          <span
                            key={i}
                            ref={isCaret ? caretRef : undefined}
                            className={`${cls} ${isCaret ? "border-l-2 border-purple-400 -ml-[1px] animate-pulse" : ""}`}
                          >
                            {ch}
                          </span>
                        );
                      })}
                    </div>
                    {!started && (
                      <p className="mt-5 font-mono text-[11px] text-neutral-600">
                        <span className="text-purple-400">❯</span> start typing to begin the {DURATION}s test...
                      </p>
                    )}
                  </>
                ) : (
                  /* Results */
                  <div className="text-center">
                    {beatRecord ? (
                      <p className="font-mono text-[11px] text-amber-300 mb-2 flex items-center justify-center gap-1.5">
                        <Trophy className="w-3.5 h-3.5" /> you beat the top record!
                      </p>
                    ) : (
                      best !== null && result !== null && result.wpm >= best && result.wpm > 0 && (
                        <p className="font-mono text-[11px] text-purple-300 mb-2">new personal best!</p>
                      )
                    )}

                    <div className="flex items-end justify-center gap-1">
                      <span className="font-mono text-6xl font-bold text-white">{result?.wpm}</span>
                      <span className="font-mono text-sm text-purple-300 mb-2">wpm</span>
                    </div>
                    <div className="flex items-center justify-center gap-6 mt-2 font-mono text-[12px] text-neutral-400">
                      <span>accuracy <span className="text-purple-300">{result?.acc}%</span></span>
                      <span>chars <span className="text-purple-300">{result?.chars}</span></span>
                    </div>

                    {/* Record to beat (the hook) */}
                    {topRecord && !beatRecord && (
                      <p className="mt-3 font-mono text-[11px] text-amber-300/90 flex items-center justify-center gap-1.5">
                        <Trophy className="w-3 h-3" />
                        record to beat: {topRecord.wpm} wpm by {topRecord.name}
                        {result && result.wpm > 0 && (
                          <span className="text-neutral-500">({topRecord.wpm - result.wpm} to go)</span>
                        )}
                      </p>
                    )}

                    {/* Submit to leaderboard */}
                    {result && result.wpm > 0 && !submitted && (
                      <div className="mt-5 flex items-center justify-center gap-2">
                        <input
                          ref={nameRef}
                          value={playerName}
                          onChange={(e) => setPlayerName(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && submitScore()}
                          placeholder="your name"
                          maxLength={20}
                          className="w-36 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 focus:border-purple-500/40 outline-none font-mono text-[12px] text-white placeholder:text-neutral-600"
                        />
                        <button
                          type="button"
                          onClick={submitScore}
                          disabled={submitting}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/15 border border-purple-500/30 text-[12px] text-purple-300 hover:text-white hover:bg-purple-500/25 hover:border-purple-400/50 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          <Send className="w-3.5 h-3.5" />
                          {submitting ? "Saving..." : "Submit"}
                        </button>
                      </div>
                    )}
                    {submitError && (
                      <p className="mt-2 font-mono text-[11px] text-red-400">{submitError}</p>
                    )}

                    {/* Leaderboard after submit */}
                    {submitted && board.length > 0 && (
                      <div className="mt-5 text-left">
                        <p className="font-mono text-[10px] tracking-[0.25em] text-amber-300/80 uppercase mb-2 flex items-center gap-1.5">
                          <Trophy className="w-3 h-3" /> Top racers
                          {rank && <span className="ml-auto text-neutral-500 normal-case tracking-normal">you ranked #{rank}</span>}
                        </p>
                        <div className="space-y-1">
                          {board.slice(0, 5).map((s, i) => {
                            const isYou = submitted && rank === i + 1 && s.name === playerName.trim() && s.wpm === result?.wpm;
                            return (
                              <div
                                key={i}
                                className={`flex items-center gap-3 px-3 py-1.5 rounded-md font-mono text-[12px] ${
                                  isYou ? "bg-purple-500/15 border border-purple-500/30" : "bg-white/[0.02]"
                                }`}
                              >
                                <span className={`w-4 ${i === 0 ? "text-amber-300" : "text-neutral-600"}`}>{i + 1}</span>
                                <span className="flex-1 truncate text-neutral-200">{s.name}</span>
                                <span className="text-purple-300">{s.wpm}</span>
                                <span className="text-neutral-600 text-[10px]">{s.accuracy}%</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={reset}
                      className="mt-6 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-white/10 text-sm text-neutral-300 hover:text-white hover:border-purple-500/40 hover:bg-purple-500/10 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Play again
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
