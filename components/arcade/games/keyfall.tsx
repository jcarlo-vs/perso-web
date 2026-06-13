"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Trophy } from "lucide-react";

const LANES = ["f", "g", "h", "j"];
const LANE_W = 46;
const W = LANES.length * LANE_W;
const H = 240;
const HIT_Y = H - 38;
const HIT_WINDOW = 26;
const COLORS = ["#a855f7", "#22d3ee", "#f472b6", "#fbbf24"];
const BEST_KEY = "keyfall-best";

export function Keyfall() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [lives, setLives] = useState(5);
  const [running, setRunning] = useState(false);
  const [over, setOver] = useState(false);
  const [best, setBest] = useState<number | null>(null);

  const tiles = useRef<{ lane: number; y: number }[]>([]);
  const flash = useRef<number[]>([0, 0, 0, 0]);
  const speed = useRef(120);
  const spawnAcc = useRef(0);
  const spawnEvery = useRef(0.85);
  const raf = useRef(0);
  const last = useRef(0);
  const scoreRef = useRef(0);
  const livesRef = useRef(5);

  useEffect(() => {
    try { const b = localStorage.getItem(BEST_KEY); if (b) setBest(parseInt(b, 10)); } catch {}
    const c = canvasRef.current;
    if (c) {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      c.width = W * dpr; c.height = H * dpr;
      c.style.width = `${W}px`; c.style.height = `${H}px`;
      c.getContext("2d")?.scale(dpr, dpr);
    }
    draw();
    return () => cancelAnimationFrame(raf.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const draw = useCallback(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);
    // lanes
    for (let i = 0; i < LANES.length; i++) {
      ctx.fillStyle = i % 2 ? "rgba(255,255,255,0.015)" : "rgba(255,255,255,0.03)";
      ctx.fillRect(i * LANE_W, 0, LANE_W, H);
    }
    // hit line
    ctx.strokeStyle = "rgba(168,85,247,0.5)";
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, HIT_Y); ctx.lineTo(W, HIT_Y); ctx.stroke();
    // tiles
    for (const t of tiles.current) {
      ctx.fillStyle = COLORS[t.lane];
      ctx.beginPath();
      ctx.roundRect(t.lane * LANE_W + 5, t.y - 9, LANE_W - 10, 18, 4);
      ctx.fill();
    }
    // key caps
    for (let i = 0; i < LANES.length; i++) {
      const lit = flash.current[i] > 0;
      ctx.fillStyle = lit ? COLORS[i] : "rgba(255,255,255,0.05)";
      ctx.beginPath();
      ctx.roundRect(i * LANE_W + 6, HIT_Y + 6, LANE_W - 12, 24, 4);
      ctx.fill();
      ctx.fillStyle = lit ? "#0a0a0f" : "#888";
      ctx.font = "bold 12px monospace";
      ctx.textAlign = "center";
      ctx.fillText(LANES[i].toUpperCase(), i * LANE_W + LANE_W / 2, HIT_Y + 22);
    }
  }, []);

  const endGame = useCallback(() => {
    cancelAnimationFrame(raf.current);
    setRunning(false);
    setOver(true);
    setBest((p) => {
      const n = p === null ? scoreRef.current : Math.max(p, scoreRef.current);
      try { localStorage.setItem(BEST_KEY, String(n)); } catch {}
      return n;
    });
  }, []);

  const tick = useCallback((now: number) => {
    const dt = Math.min(0.05, (now - last.current) / 1000);
    last.current = now;
    speed.current += dt * 6;
    spawnEvery.current = Math.max(0.4, spawnEvery.current - dt * 0.02);
    flash.current = flash.current.map((f) => Math.max(0, f - dt));

    spawnAcc.current += dt;
    if (spawnAcc.current >= spawnEvery.current) {
      spawnAcc.current = 0;
      tiles.current.push({ lane: Math.floor(Math.random() * LANES.length), y: -10 });
    }
    const keep: typeof tiles.current = [];
    for (const t of tiles.current) {
      t.y += speed.current * dt;
      if (t.y > HIT_Y + HIT_WINDOW + 6) {
        livesRef.current -= 1;
        setLives(livesRef.current);
        setCombo(0);
        if (livesRef.current <= 0) { draw(); endGame(); return; }
      } else {
        keep.push(t);
      }
    }
    tiles.current = keep;
    draw();
    raf.current = requestAnimationFrame(tick);
  }, [draw, endGame]);

  const start = () => {
    tiles.current = [];
    speed.current = 120;
    spawnEvery.current = 0.85;
    spawnAcc.current = 0;
    scoreRef.current = 0; livesRef.current = 5;
    setScore(0); setCombo(0); setLives(5); setOver(false); setRunning(true);
    last.current = performance.now();
    raf.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      const lane = LANES.indexOf(k);
      if (lane === -1 || !running) return;
      e.preventDefault();
      flash.current[lane] = 0.12;
      // find lowest tile in this lane within hit window
      let bestIdx = -1; let bestY = -Infinity;
      tiles.current.forEach((t, i) => {
        if (t.lane === lane && Math.abs(t.y - HIT_Y) <= HIT_WINDOW && t.y > bestY) { bestY = t.y; bestIdx = i; }
      });
      if (bestIdx >= 0) {
        tiles.current.splice(bestIdx, 1);
        scoreRef.current += 1;
        setScore(scoreRef.current);
        setCombo((c) => c + 1);
      } else {
        setCombo(0);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [running]);

  return (
    <div className="font-mono flex flex-col items-center">
      <div className="flex items-center gap-5 text-[11px] mb-3 w-full justify-center">
        <span className="text-neutral-500">HITS <span className="text-purple-300 text-sm">{score}</span></span>
        <span className="text-neutral-500">COMBO <span className="text-cyan-300 text-sm">{combo}</span></span>
        <span className="text-red-400/80 text-sm">{"♥".repeat(Math.max(0, lives))}</span>
        {best !== null && <span className="text-amber-300 flex items-center gap-1 text-sm"><Trophy className="w-3.5 h-3.5" />{best}</span>}
      </div>
      <div className="relative">
        <canvas ref={canvasRef} className="rounded-lg border border-white/10 bg-black/40" />
        {!running && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/55 rounded-lg backdrop-blur-sm">
            <p className="text-sm text-white text-center">{over ? `Game over — ${score} hits` : "Keyfall"}</p>
            {!over && <p className="text-[11px] text-neutral-400 text-center px-4">Press F G H J as the tiles hit the line.</p>}
            <button type="button" onClick={start} className="px-4 py-2 rounded-lg bg-purple-500/15 border border-purple-500/30 text-[13px] text-purple-300 hover:text-white hover:bg-purple-500/25 transition-colors cursor-pointer">{over ? "Play again" : "Start"}</button>
          </div>
        )}
      </div>
    </div>
  );
}
