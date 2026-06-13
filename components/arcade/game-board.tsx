"use client";

import { useEffect, useState } from "react";
import { Trophy, Send } from "lucide-react";

type Score = { name: string; score: number };

const NAME_KEY = "arcade-player-name";

/** Global leaderboard UI for a game's results screen: shows the top scores,
 *  lets the player submit theirs, and highlights their rank. */
export function GameBoard({
  game,
  score,
  unit = "",
  submittable = true,
}: {
  game: string;
  score: number;
  unit?: string;
  submittable?: boolean;
}) {
  const [board, setBoard] = useState<Score[]>([]);
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [rank, setRank] = useState<number | null>(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    try { const n = localStorage.getItem(NAME_KEY); if (n) setName(n); } catch {}
    fetch(`/api/scores?game=${game}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setBoard(Array.isArray(d.scores) ? d.scores : []))
      .catch(() => {});
  }, [game]);

  const submit = async () => {
    const nm = name.trim();
    if (!nm || submitting || submitted) return;
    setSubmitting(true);
    setErr("");
    try {
      const res = await fetch("/api/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ game, name: nm, score }),
      });
      const d = await res.json();
      if (res.ok) {
        setBoard(Array.isArray(d.scores) ? d.scores : board);
        setRank(typeof d.rank === "number" ? d.rank : null);
        setSubmitted(true);
        try { localStorage.setItem(NAME_KEY, nm); } catch {}
      } else {
        setErr(d.error ?? "Could not save");
      }
    } catch {
      setErr("Could not save");
    } finally {
      setSubmitting(false);
    }
  };

  const fmt = (s: number) => `${s}${unit}`;

  return (
    <div className="mt-4 w-full max-w-[280px] mx-auto font-mono">
      {submittable && !submitted && (
        <div className="flex items-center justify-center gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="your name"
            maxLength={20}
            className="w-32 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 focus:border-purple-500/40 outline-none text-[12px] text-white placeholder:text-neutral-600"
          />
          <button type="button" onClick={submit} disabled={submitting} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/15 border border-purple-500/30 text-[12px] text-purple-300 hover:text-white hover:bg-purple-500/25 transition-colors cursor-pointer disabled:opacity-50">
            <Send className="w-3.5 h-3.5" />{submitting ? "…" : "Submit"}
          </button>
        </div>
      )}
      {err && <p className="text-[11px] text-red-400 mt-1.5 text-center">{err}</p>}

      {board.length > 0 && (
        <div className="mt-3 text-left">
          <p className="text-[10px] tracking-[0.25em] text-amber-300/80 uppercase mb-1.5 flex items-center gap-1.5">
            <Trophy className="w-3 h-3" /> Global top
            {rank && <span className="ml-auto text-neutral-500 normal-case tracking-normal">you ranked #{rank}</span>}
          </p>
          <div className="space-y-1">
            {board.slice(0, 5).map((s, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-1 rounded-md text-[12px] bg-white/[0.02]">
                <span className={`w-4 ${i === 0 ? "text-amber-300" : "text-neutral-600"}`}>{i + 1}</span>
                <span className="flex-1 truncate text-neutral-200">{s.name}</span>
                <span className="text-purple-300">{fmt(s.score)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
