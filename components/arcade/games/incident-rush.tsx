"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Trophy } from "lucide-react";

const SERVICES = ["API", "Auth", "DB", "Queue", "Cache", "Lambda"];
const BEST_KEY = "incident-best";
type Phase = "idle" | "play" | "over";

type Incident = { startedAt: number; ttl: number };

export function IncidentRush() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [incidents, setIncidents] = useState<Record<number, Incident>>({});
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [, force] = useState(0); // re-render for countdown bars
  const [best, setBest] = useState<number | null>(null);

  const livesRef = useRef(3);
  const scoreRef = useRef(0);
  const elapsed = useRef(0);

  useEffect(() => {
    try { const b = localStorage.getItem(BEST_KEY); if (b) setBest(parseInt(b, 10)); } catch {}
  }, []);

  const start = () => {
    setIncidents({});
    setScore(0); setLives(3);
    scoreRef.current = 0; livesRef.current = 3; elapsed.current = 0;
    setPhase("play");
  };

  useEffect(() => {
    if (phase !== "play") return;
    const id = setInterval(() => {
      const now = Date.now();
      elapsed.current += 0.12;
      // expire
      setIncidents((prev) => {
        const next = { ...prev };
        let died = false;
        for (const k in next) {
          if (now - next[+k].startedAt >= next[+k].ttl) { delete next[+k]; died = true; }
        }
        if (died) {
          livesRef.current -= 1;
          setLives(livesRef.current);
          if (livesRef.current <= 0) setPhase("over");
        }
        // spawn (rate + urgency increase over time)
        const spawnChance = Math.min(0.5, 0.18 + elapsed.current * 0.004);
        if (Math.random() < spawnChance) {
          const free = SERVICES.map((_, i) => i).filter((i) => !(i in next));
          if (free.length) {
            const ttl = Math.max(1500, 3200 - elapsed.current * 12);
            next[free[Math.floor(Math.random() * free.length)]] = { startedAt: now, ttl };
          }
        }
        return next;
      });
      force((n) => n + 1);
    }, 120);
    return () => clearInterval(id);
  }, [phase]);

  useEffect(() => {
    if (phase !== "over") return;
    setIncidents({});
    setBest((p) => {
      const n = p === null ? scoreRef.current : Math.max(p, scoreRef.current);
      try { localStorage.setItem(BEST_KEY, String(n)); } catch {}
      return n;
    });
  }, [phase]);

  const resolve = useCallback((i: number) => {
    if (phase !== "play") return;
    setIncidents((prev) => {
      if (!(i in prev)) return prev;
      const n = { ...prev };
      delete n[i];
      return n;
    });
    setIncidents((prev) => prev); // no-op to keep order
    scoreRef.current += 1;
    setScore(scoreRef.current);
  }, [phase]);

  const now = Date.now();

  return (
    <div className="font-mono flex flex-col items-center">
      <div className="flex items-center gap-5 text-[11px] mb-4 w-full justify-center">
        <span className="text-neutral-500">RESOLVED <span className="text-accent text-sm">{score}</span></span>
        <span className="text-red-400/80 text-sm">{"♥".repeat(Math.max(0, lives))}</span>
        {best !== null && <span className="text-amber-300 flex items-center gap-1 text-sm"><Trophy className="w-3.5 h-3.5" />{best}</span>}
      </div>

      <div className="relative">
        <div className="grid grid-cols-3 gap-3">
          {SERVICES.map((name, i) => {
            const inc = incidents[i];
            const pct = inc ? Math.max(0, 1 - (now - inc.startedAt) / inc.ttl) : 0;
            return (
              <button
                key={i}
                type="button"
                onClick={() => resolve(i)}
                className="relative w-[88px] h-[64px] rounded-xl border flex flex-col items-center justify-center gap-1 overflow-hidden transition-colors"
                style={{
                  borderColor: inc ? "rgba(248,113,113,0.6)" : "rgba(255,255,255,0.1)",
                  background: inc ? "rgba(220,38,38,0.14)" : "rgba(255,255,255,0.02)",
                  cursor: inc ? "pointer" : "default",
                }}
              >
                <span className="text-base">{inc ? "🔥" : "🟢"}</span>
                <span className="text-[10px] text-neutral-400">{name}</span>
                {inc && (
                  <span className="absolute bottom-0 left-0 h-1 bg-red-400" style={{ width: `${pct * 100}%` }} />
                )}
              </button>
            );
          })}
        </div>

        {phase !== "play" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/55 rounded-xl backdrop-blur-sm">
            <p className="text-sm text-white text-center">{phase === "over" ? `Outage! Resolved ${score} incidents` : "On-Call: Incident Rush"}</p>
            {phase === "idle" && <p className="text-[11px] text-neutral-400 text-center px-6">Click 🔥 services to resolve incidents before they time out. 3 strikes.</p>}
            <button type="button" onClick={start} className="px-4 py-2 rounded-lg bg-accent/15 border border-accent/30 text-[13px] text-accent hover:text-white hover:bg-accent/25 transition-colors cursor-pointer">{phase === "over" ? "Back on call" : "Start shift"}</button>
          </div>
        )}
      </div>
    </div>
  );
}
