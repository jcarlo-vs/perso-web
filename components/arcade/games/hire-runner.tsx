"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Trophy } from "lucide-react";

const W = 460;
const H = 170;
const GROUND = H - 28;
const BEST_KEY = "hire-best";
const SKILLS = ["React", "AWS", "n8n", "Next", "Node", "TS", "Claude"];
const OBSTACLES = ["ghosted", "lowball", "rejected", "no reply"];

type Ob = { x: number; w: number; label: string };
type Pickup = { x: number; y: number; label: string; got: boolean };

export function HireRunner() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [running, setRunning] = useState(false);
  const [over, setOver] = useState(false);
  const [best, setBest] = useState<number | null>(null);

  const y = useRef(0);
  const vy = useRef(0);
  const obstacles = useRef<Ob[]>([]);
  const pickups = useRef<Pickup[]>([]);
  const speed = useRef(180);
  const dist = useRef(0);
  const skills = useRef(0);
  const spawnAcc = useRef(0);
  const pickAcc = useRef(0);
  const raf = useRef(0);
  const last = useRef(0);
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
    // ground
    ctx.strokeStyle = "rgba(168,85,247,0.3)";
    ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(0, GROUND + 16); ctx.lineTo(W, GROUND + 16); ctx.stroke();
    ctx.setLineDash([]);
    // runner (recruiter)
    const rx = 46;
    const ry = GROUND - y.current;
    ctx.font = "22px serif";
    ctx.textAlign = "center";
    ctx.fillText("🏃", rx, ry + 16);
    // obstacles
    for (const o of obstacles.current) {
      ctx.fillStyle = "rgba(220,38,38,0.18)";
      ctx.strokeStyle = "rgba(248,113,113,0.6)";
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.roundRect(o.x, GROUND - 2, o.w, 20, 4); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#fca5a5";
      ctx.font = "9px monospace";
      ctx.fillText(o.label, o.x + o.w / 2, GROUND + 12);
    }
    // pickups
    for (const p of pickups.current) {
      if (p.got) continue;
      ctx.fillStyle = "rgba(168,85,247,0.18)";
      ctx.strokeStyle = "rgba(192,132,252,0.7)";
      ctx.beginPath(); ctx.roundRect(p.x, p.y, 34, 16, 4); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#d8b4fe";
      ctx.font = "9px monospace";
      ctx.fillText(p.label, p.x + 17, p.y + 11);
    }
  }, []);

  const endGame = useCallback(() => {
    cancelAnimationFrame(raf.current);
    runningRef.current = false;
    setRunning(false);
    setOver(true);
    const sc = Math.floor(dist.current / 10) + skills.current * 5;
    setScore(sc);
    setBest((p) => {
      const n = p === null ? sc : Math.max(p, sc);
      try { localStorage.setItem(BEST_KEY, String(n)); } catch {}
      return n;
    });
  }, []);

  const jump = useCallback(() => {
    if (!runningRef.current) return;
    if (y.current <= 0.5) vy.current = 360;
  }, []);

  const tick = useCallback((now: number) => {
    const dt = Math.min(0.05, (now - last.current) / 1000);
    last.current = now;
    speed.current += dt * 8;
    dist.current += speed.current * dt;

    // physics
    vy.current -= 1100 * dt;
    y.current += vy.current * dt;
    if (y.current < 0) { y.current = 0; vy.current = 0; }

    // spawn obstacles
    spawnAcc.current += dt;
    if (spawnAcc.current > Math.max(0.9, 1.6 - dist.current / 4000)) {
      spawnAcc.current = 0;
      obstacles.current.push({ x: W + 10, w: 30 + Math.random() * 22, label: OBSTACLES[Math.floor(Math.random() * OBSTACLES.length)] });
    }
    // spawn pickups
    pickAcc.current += dt;
    if (pickAcc.current > 1.4) {
      pickAcc.current = 0;
      pickups.current.push({ x: W + 10, y: GROUND - 30 - Math.random() * 34, label: SKILLS[Math.floor(Math.random() * SKILLS.length)], got: false });
    }

    const rx = 46;
    const ry = GROUND - y.current;
    // move + collide obstacles
    const keepO: Ob[] = [];
    for (const o of obstacles.current) {
      o.x -= speed.current * dt;
      // collision: runner box ~ (rx-9 .. rx+9, ry .. ry+18)
      if (o.x < rx + 9 && o.x + o.w > rx - 9 && ry + 14 > GROUND - 2) { draw(); endGame(); return; }
      if (o.x + o.w > -10) keepO.push(o);
    }
    obstacles.current = keepO;
    // move + collect pickups
    const keepP: Pickup[] = [];
    for (const p of pickups.current) {
      p.x -= speed.current * dt;
      if (!p.got && p.x < rx + 12 && p.x + 34 > rx - 12 && ry < p.y + 16 && ry + 18 > p.y) {
        p.got = true;
        skills.current += 1;
      }
      if (p.x + 34 > -10 && !p.got) keepP.push(p);
    }
    pickups.current = keepP;

    setScore(Math.floor(dist.current / 10) + skills.current * 5);
    draw();
    raf.current = requestAnimationFrame(tick);
  }, [draw, endGame]);

  const start = () => {
    y.current = 0; vy.current = 0;
    obstacles.current = []; pickups.current = [];
    speed.current = 180; dist.current = 0; skills.current = 0;
    spawnAcc.current = 0; pickAcc.current = 0;
    setScore(0); setOver(false); setRunning(true);
    runningRef.current = true;
    last.current = performance.now();
    raf.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "ArrowUp" || e.key === "w") { e.preventDefault(); jump(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [jump]);

  return (
    <div className="font-mono flex flex-col items-center">
      <div className="flex items-center gap-5 text-[11px] mb-3 w-full justify-center">
        <span className="text-neutral-500">SCORE <span className="text-purple-300 text-sm">{score}</span></span>
        {best !== null && <span className="text-amber-300 flex items-center gap-1 text-sm"><Trophy className="w-3.5 h-3.5" />{best}</span>}
      </div>
      <div className="relative" onClick={jump}>
        <canvas ref={canvasRef} className="rounded-lg border border-white/10 bg-black/40" />
        {!running && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 bg-black/55 rounded-lg backdrop-blur-sm">
            <p className="text-sm text-white text-center px-4">{over ? `Game over — score ${score}` : "Hire Juan: The Runner"}</p>
            {!over && <p className="text-[11px] text-neutral-400 text-center px-6">Jump (space / tap) over rejections, grab skills to score.</p>}
            <button type="button" onClick={(e) => { e.stopPropagation(); start(); }} className="px-4 py-2 rounded-lg bg-purple-500/15 border border-purple-500/30 text-[13px] text-purple-300 hover:text-white hover:bg-purple-500/25 transition-colors cursor-pointer">{over ? "Run again" : "Start running"}</button>
          </div>
        )}
      </div>
    </div>
  );
}
