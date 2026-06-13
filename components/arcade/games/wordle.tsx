"use client";

import { useCallback, useEffect, useState } from "react";

const WORDS = [
  "REACT", "REDIS", "LINUX", "NGINX", "SWIFT", "MYSQL", "REGEX", "ARRAY",
  "STACK", "QUEUE", "CACHE", "CLOUD", "TOKEN", "ASYNC", "DEBUG", "MERGE",
  "FETCH", "PROXY", "QUERY", "BYTES", "LOGIC", "CLASS", "SCOPE", "MACRO",
  "SHELL", "MOUSE", "PIXEL", "FRAME", "NODES", "PARSE",
];
const ROWS = 6;
const ROWS_KB = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];
type Mark = "correct" | "present" | "absent";

function evaluate(guess: string, answer: string): Mark[] {
  const res: Mark[] = Array(5).fill("absent");
  const a = answer.split("");
  const taken = Array(5).fill(false);
  for (let i = 0; i < 5; i++) if (guess[i] === a[i]) { res[i] = "correct"; taken[i] = true; }
  for (let i = 0; i < 5; i++) {
    if (res[i] === "correct") continue;
    const j = a.findIndex((c, k) => c === guess[i] && !taken[k]);
    if (j !== -1) { res[i] = "present"; taken[j] = true; }
  }
  return res;
}

const COLORS: Record<Mark, string> = {
  correct: "#22c55e",
  present: "#eab308",
  absent: "#3f3f46",
};

export function WordleGame() {
  const [answer, setAnswer] = useState("REACT");
  const [guesses, setGuesses] = useState<string[]>([]);
  const [current, setCurrent] = useState("");
  const [done, setDone] = useState<null | "win" | "lose">(null);

  const reset = useCallback(() => {
    setAnswer(WORDS[Math.floor(Math.random() * WORDS.length)]);
    setGuesses([]);
    setCurrent("");
    setDone(null);
  }, []);

  useEffect(() => { reset(); }, [reset]);

  const submit = useCallback(() => {
    setCurrent((cur) => {
      if (cur.length !== 5) return cur;
      setGuesses((g) => {
        const ng = [...g, cur];
        if (cur === answer) setDone("win");
        else if (ng.length >= ROWS) setDone("lose");
        return ng;
      });
      return "";
    });
  }, [answer]);

  const type = useCallback((ch: string) => {
    if (done) return;
    setCurrent((cur) => (cur.length < 5 ? cur + ch : cur));
  }, [done]);

  const back = useCallback(() => setCurrent((cur) => cur.slice(0, -1)), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (done) return;
      if (e.key === "Enter") submit();
      else if (e.key === "Backspace") back();
      else if (/^[a-zA-Z]$/.test(e.key)) type(e.key.toUpperCase());
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [submit, back, type, done]);

  // letter states for the on-screen keyboard
  const letterState: Record<string, Mark> = {};
  guesses.forEach((g) => {
    const marks = evaluate(g, answer);
    g.split("").forEach((ch, i) => {
      const cur = letterState[ch];
      const m = marks[i];
      if (m === "correct" || (m === "present" && cur !== "correct") || (m === "absent" && !cur)) letterState[ch] = m;
    });
  });

  return (
    <div className="font-mono flex flex-col items-center">
      <div className="grid grid-rows-6 gap-1.5 mb-4">
        {Array.from({ length: ROWS }).map((_, r) => {
          const guess = guesses[r];
          const isCurrent = r === guesses.length && !done;
          const marks = guess ? evaluate(guess, answer) : null;
          return (
            <div key={r} className="flex gap-1.5">
              {Array.from({ length: 5 }).map((__, c) => {
                const letter = guess ? guess[c] : isCurrent ? current[c] ?? "" : "";
                const m = marks?.[c];
                return (
                  <div
                    key={c}
                    className="w-9 h-9 rounded flex items-center justify-center text-sm font-bold border"
                    style={{
                      color: m ? "#0a0a0f" : "#fff",
                      background: m ? COLORS[m] : "rgba(255,255,255,0.03)",
                      borderColor: m ? COLORS[m] : letter ? "rgba(168,85,247,0.5)" : "rgba(255,255,255,0.1)",
                    }}
                  >
                    {letter}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {done ? (
        <div className="text-center">
          <p className={`text-sm ${done === "win" ? "text-emerald-300" : "text-neutral-300"}`}>
            {done === "win" ? `nailed it in ${guesses.length} 🎉` : `the word was ${answer}`}
          </p>
          <button type="button" onClick={reset} className="mt-3 px-4 py-2 rounded-lg bg-purple-500/15 border border-purple-500/30 text-[13px] text-purple-300 hover:text-white hover:bg-purple-500/25 transition-colors cursor-pointer">New word</button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-1">
          {ROWS_KB.map((row, i) => (
            <div key={i} className="flex gap-1">
              {i === 2 && <button type="button" onClick={submit} className="px-2 h-8 rounded bg-white/[0.06] text-[10px] text-neutral-300 hover:bg-white/10 cursor-pointer">ENTER</button>}
              {row.split("").map((ch) => {
                const st = letterState[ch];
                return (
                  <button
                    key={ch}
                    type="button"
                    onClick={() => type(ch)}
                    className="w-6 h-8 rounded text-[11px] font-medium cursor-pointer transition-colors"
                    style={{ color: st && st !== "absent" ? "#0a0a0f" : "#e5e5e5", background: st ? COLORS[st] : "rgba(255,255,255,0.06)" }}
                  >
                    {ch}
                  </button>
                );
              })}
              {i === 2 && <button type="button" onClick={back} className="px-2 h-8 rounded bg-white/[0.06] text-[11px] text-neutral-300 hover:bg-white/10 cursor-pointer">⌫</button>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
