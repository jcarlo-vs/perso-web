"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Trophy } from "lucide-react";

const W = 440;
const H = 250;
const PW = 72;       // paddle width
const PY = H - 22;   // paddle top
const R = 9;         // item radius
const BEST_KEY = "catch-best";

type Item = { x: number; y: number; vy: number; good: boolean };

export function PacketCatch() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [running, setRunning] = useState(false);
  const [over, setOver] = useState(false);
  const [best, setBest] = useState<number | null>(null);

  const px = useRef(W / 2);
  const items = useRef<Item[]>([]);
  const speed = useRef(95);
  const spawnAcc = useRef(0);
  const raf = useRef(0);
  const last = useRef(0);
  const livesRef = useRef(3);
  const scoreRef = useRef(0);
  const keyDir = useRef(0);
  const runningRef = useRef(false);

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
    // items
    for (const it of items.current) {
      if (it.good) {
        ctx.fillStyle = "#a855f7";
        ctx.shadowColor = "rgba(168,85,247,0.6)";
        ctx.shadowBlur = 8;
        ctx.beginPath(); ctx.arc(it.x, it.y, R, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;
      } else {
        ctx.fillStyle = "#ef4444";
        ctx.beginPath(); ctx.arc(it.x, it.y, R, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = "#fff"; ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(it.x - 3.5, it.y - 3.5); ctx.lineTo(it.x + 3.5, it.y + 3.5);
        ctx.moveTo(it.x + 3.5, it.y - 3.5); ctx.lineTo(it.x - 3.5, it.y + 3.5);
        ctx.stroke();
      }
    }
    // paddle (catcher)
    ctx.fillStyle = "#d8b4fe";
    ctx.beginPath();
    ctx.roundRect(px.current - PW / 2, PY, PW, 11, 5);
    ctx.fill();
    ctx.fillStyle = "rgba(216,180,254,0.25)";
    ctx.beginPath();
    ctx.roundRect(px.current - PW / 2, PY + 11, PW, 5, 3);
    ctx.fill();
  }, []);

  const endGame = useCallback(() => {
    cancelAnimationFrame(raf.current);
    runningRef.current = false;
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
    speed.current += dt * 7;

    // keyboard movement
    if (keyDir.current !== 0) px.current += keyDir.current * 320 * dt;
    px.current = Math.max(PW / 2, Math.min(W - PW / 2, px.current));

    spawnAcc.current += dt;
    if (spawnAcc.current > Math.max(0.45, 0.9 - now / 90000)) {
      spawnAcc.current = 0;
      items.current.push({
        x: 18 + Math.random() * (W - 36),
        y: -R,
        vy: speed.current * (0.85 + Math.random() * 0.4),
        good: Math.random() < 0.72,
      });
    }

    const keep: Item[] = [];
    for (const it of items.current) {
      it.y += it.vy * dt;
      const caught = it.y + R >= PY && it.y - R <= PY + 12 && Math.abs(it.x - px.current) <= PW / 2 + R * 0.5;
      if (caught) {
        if (it.good) { scoreRef.current += 1; setScore(scoreRef.current); }
        else {
          livesRef.current -= 1; setLives(livesRef.current);
          if (livesRef.current <= 0) { draw(); endGame(); return; }
        }
        continue;
      }
      if (it.y - R > H) continue; // missed (no penalty for missed good)
      keep.push(it);
    }
    items.current = keep;

    draw();
    raf.current = requestAnimationFrame(tick);
  }, [draw, endGame]);

  const start = () => {
    items.current = [];
    px.current = W / 2;
    speed.current = 95;
    spawnAcc.current = 0;
    scoreRef.current = 0; livesRef.current = 3;
    setScore(0); setLives(3); setOver(false); setRunning(true);
    runningRef.current = true;
    last.current = performance.now();
    raf.current = requestAnimationFrame(tick);
  };

  const onPointer = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    px.current = Math.max(PW / 2, Math.min(W - PW / 2, e.clientX - rect.left));
    if (!runningRef.current) draw();
  };

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") keyDir.current = -1;
      else if (e.key === "ArrowRight") keyDir.current = 1;
    };
    const up = (e: KeyboardEvent) => {
      if ((e.key === "ArrowLeft" && keyDir.current === -1) || (e.key === "ArrowRight" && keyDir.current === 1)) keyDir.current = 0;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); };
  }, []);

  return (
    <div className="font-mono flex flex-col items-center">
      <div className="flex items-center gap-5 text-[11px] mb-3 w-full justify-center">
        <span className="text-neutral-500">CAUGHT <span className="text-purple-300 text-sm">{score}</span></span>
        <span className="text-red-400/80 text-sm">{"♥".repeat(Math.max(0, lives))}</span>
        {best !== null && <span className="text-amber-300 flex items-center gap-1 text-sm"><Trophy className="w-3.5 h-3.5" />{best}</span>}
      </div>
      <div className="relative">
        <canvas ref={canvasRef} onPointerMove={onPointer} className="rounded-lg border border-white/10 bg-black/40 touch-none cursor-none" />
        {!running && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 bg-black/55 rounded-lg backdrop-blur-sm">
            <p className="text-sm text-white text-center px-4">{over ? `Game over — caught ${score}` : "Packet Catch"}</p>
            {!over && (
              <p className="text-[11px] text-neutral-400 text-center px-6">
                Catch the <span className="text-purple-300">purple packets</span>, dodge the <span className="text-red-400">red bugs ✕</span>. Move with your mouse or ← →.
              </p>
            )}
            <button type="button" onClick={start} className="px-4 py-2 rounded-lg bg-purple-500/15 border border-purple-500/30 text-[13px] text-purple-300 hover:text-white hover:bg-purple-500/25 transition-colors cursor-pointer">{over ? "Play again" : "Start"}</button>
          </div>
        )}
      </div>
    </div>
  );
}
