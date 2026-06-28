"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { accent } from "@/lib/accent";
import { Trophy, ArrowUp, ArrowDown } from "lucide-react";

const W = 460;
const H = 180;
const GROUND = H - 30;
const RX = Math.round(W * 0.45);
const BEST_KEY = "hire-best";

const LOW_H = 26;
const GAP = 22;
const STAND_TOP = 36;
const SLIDE_TOP = 14;
const JUMP_V = 360;
const GRAV = 1300;

const SKILLS = ["React", "AWS", "n8n", "Next", "Node", "TS", "Claude"];
const LOW_LABELS = ["lowball", "rejected", "no reply"];
const HIGH_LABELS = ["ghosted", "signed?"];

type Ob = { x: number; w: number; type: "low" | "high"; label: string };
type Pickup = { x: number; y: number; label: string; got: boolean };

export function HireRunner() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [running, setRunning] = useState(false);
  const [over, setOver] = useState(false);
  const [best, setBest] = useState<number | null>(null);

  const y = useRef(0);
  const vy = useRef(0);
  const slideHeld = useRef(false);
  const phase = useRef(0);
  const obstacles = useRef<Ob[]>([]);
  const pickups = useRef<Pickup[]>([]);
  const speed = useRef(190);
  const dist = useRef(0);
  const skills = useRef(0);
  const spawnAcc = useRef(0);
  const pickAcc = useRef(0);
  const raf = useRef(0);
  const last = useRef(0);
  const runningRef = useRef(false);

  const isSliding = () => slideHeld.current && y.current <= 1;

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

  const drawRunner = useCallback((ctx: CanvasRenderingContext2D) => {
    const sliding = isSliding();
    const bottom = GROUND - y.current;
    const P = accent();
    ctx.save();
    ctx.fillStyle = P;
    ctx.strokeStyle = P;
    ctx.lineWidth = 3;
    ctx.lineCap = "round";

    if (sliding) {
      ctx.beginPath(); ctx.roundRect(RX - 13, bottom - 13, 28, 11, 6); ctx.fill();
      ctx.beginPath(); ctx.arc(RX + 15, bottom - 8, 5, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.moveTo(RX - 11, bottom - 2); ctx.lineTo(RX - 19, bottom); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(RX - 6, bottom - 2); ctx.lineTo(RX - 14, bottom); ctx.stroke();
      ctx.fillStyle = "#0a0a0f"; ctx.beginPath(); ctx.arc(RX + 17, bottom - 9, 1.3, 0, 7); ctx.fill();
    } else {
      ctx.beginPath(); ctx.roundRect(RX - 7, bottom - 26, 14, 20, 7); ctx.fill();
      ctx.beginPath(); ctx.arc(RX, bottom - 31, 5.5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#0a0a0f"; ctx.beginPath(); ctx.arc(RX + 2.6, bottom - 32, 1.4, 0, 7); ctx.fill();
      ctx.fillStyle = P;
      const air = y.current > 3;
      if (air) {
        ctx.beginPath(); ctx.moveTo(RX - 3, bottom - 6); ctx.lineTo(RX - 7, bottom - 1); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(RX + 3, bottom - 6); ctx.lineTo(RX + 8, bottom - 2); ctx.stroke();
      } else {
        const s = Math.sin(phase.current) * 5;
        ctx.beginPath(); ctx.moveTo(RX - 2, bottom - 6); ctx.lineTo(RX - 2 + s, bottom); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(RX + 2, bottom - 6); ctx.lineTo(RX + 2 - s, bottom); ctx.stroke();
      }
      const a = Math.sin(phase.current) * 4;
      ctx.beginPath(); ctx.moveTo(RX + 4, bottom - 20); ctx.lineTo(RX + 9, bottom - 16 + a); ctx.stroke();
    }
    ctx.restore();
  }, []);

  const draw = useCallback(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = accent(0.3);
    ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(0, GROUND); ctx.lineTo(W, GROUND); ctx.stroke();
    ctx.setLineDash([]);

    for (const o of obstacles.current) {
      ctx.fillStyle = "rgba(220,38,38,0.18)";
      ctx.strokeStyle = "rgba(248,113,113,0.6)";
      ctx.lineWidth = 1;
      if (o.type === "low") {
        ctx.beginPath(); ctx.roundRect(o.x, GROUND - LOW_H, o.w, LOW_H, 4); ctx.fill(); ctx.stroke();
        ctx.fillStyle = "#fca5a5"; ctx.font = "8px monospace"; ctx.textAlign = "center";
        ctx.fillText(o.label, o.x + o.w / 2, GROUND - LOW_H - 4);
      } else {
        ctx.beginPath(); ctx.roundRect(o.x, GROUND - 56, o.w, 56 - GAP, 4); ctx.fill(); ctx.stroke();
        ctx.fillStyle = "#fca5a5"; ctx.font = "8px monospace"; ctx.textAlign = "center";
        ctx.fillText(o.label, o.x + o.w / 2, GROUND - 60);
      }
    }
    for (const p of pickups.current) {
      if (p.got) continue;
      ctx.fillStyle = accent(0.18);
      ctx.strokeStyle = accent(0.7);
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.roundRect(p.x, p.y, 34, 16, 4); ctx.fill(); ctx.stroke();
      ctx.fillStyle = accent(); ctx.font = "9px monospace"; ctx.textAlign = "center";
      ctx.fillText(p.label, p.x + 17, p.y + 11);
    }
    drawRunner(ctx);
  }, [drawRunner]);

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
    if (y.current <= 1) vy.current = JUMP_V;
  }, []);

  const tick = useCallback((now: number) => {
    const dt = Math.min(0.05, (now - last.current) / 1000);
    last.current = now;
    speed.current += dt * 9;
    dist.current += speed.current * dt;
    phase.current += dt * 14;

    vy.current -= GRAV * dt;
    y.current += vy.current * dt;
    if (y.current < 0) { y.current = 0; vy.current = 0; }
    const sliding = isSliding();

    spawnAcc.current += dt;
    if (spawnAcc.current > Math.max(0.95, 1.7 - dist.current / 4500)) {
      spawnAcc.current = 0;
      const high = Math.random() < 0.4;
      obstacles.current.push(
        high
          ? { x: W + 10, w: 24, type: "high", label: HIGH_LABELS[Math.floor(Math.random() * HIGH_LABELS.length)] }
          : { x: W + 10, w: 28 + Math.random() * 20, type: "low", label: LOW_LABELS[Math.floor(Math.random() * LOW_LABELS.length)] }
      );
    }
    pickAcc.current += dt;
    if (pickAcc.current > 1.6) {
      pickAcc.current = 0;
      pickups.current.push({ x: W + 10, y: GROUND - 34 - Math.random() * 30, label: SKILLS[Math.floor(Math.random() * SKILLS.length)], got: false });
    }

    const runnerTop = (sliding ? SLIDE_TOP : STAND_TOP) + y.current;
    const keepO: Ob[] = [];
    for (const o of obstacles.current) {
      o.x -= speed.current * dt;
      const overlap = o.x < RX + 10 && o.x + o.w > RX - 10;
      if (overlap) {
        if (o.type === "low" && y.current <= LOW_H) { draw(); endGame(); return; }
        if (o.type === "high" && runnerTop >= GAP) { draw(); endGame(); return; }
      }
      if (o.x + o.w > -10) keepO.push(o);
    }
    obstacles.current = keepO;

    const keepP: Pickup[] = [];
    for (const p of pickups.current) {
      p.x -= speed.current * dt;
      const ry = GROUND - y.current;
      if (!p.got && p.x < RX + 12 && p.x + 34 > RX - 12 && ry - 30 < p.y + 16 && ry > p.y) {
        p.got = true; skills.current += 1;
      }
      if (p.x + 34 > -10 && !p.got) keepP.push(p);
    }
    pickups.current = keepP;

    setScore(Math.floor(dist.current / 10) + skills.current * 5);
    draw();
    raf.current = requestAnimationFrame(tick);
  }, [draw, endGame]);

  const start = () => {
    y.current = 0; vy.current = 0; slideHeld.current = false; phase.current = 0;
    obstacles.current = []; pickups.current = [];
    speed.current = 190; dist.current = 0; skills.current = 0;
    spawnAcc.current = 0; pickAcc.current = 0;
    setScore(0); setOver(false); setRunning(true);
    runningRef.current = true;
    last.current = performance.now();
    raf.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === " " || k === "arrowup" || k === "w") { e.preventDefault(); jump(); }
      else if (k === "arrowdown" || k === "s") { e.preventDefault(); slideHeld.current = true; }
    };
    const up = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === "arrowdown" || k === "s") slideHeld.current = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); };
  }, [jump]);

  return (
    <div className="font-mono flex flex-col items-center">
      <div className="flex items-center gap-5 text-[11px] mb-3 w-full justify-center">
        <span className="text-neutral-500">SCORE <span className="text-accent text-sm">{score}</span></span>
        {best !== null && <span className="text-amber-300 flex items-center gap-1 text-sm"><Trophy className="w-3.5 h-3.5" />{best}</span>}
      </div>
      <div className="relative">
        <canvas ref={canvasRef} className="rounded-lg border border-white/10 bg-black/40" />
        {!running && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 bg-black/55 rounded-lg backdrop-blur-sm">
            <p className="text-sm text-white text-center px-4">{over ? `Game over — score ${score}` : "Hire Juan: The Runner"}</p>
            {!over && <p className="text-[11px] text-neutral-400 text-center px-6">Jump low rejections, hold slide under overhead ones, grab skills.</p>}
            <button type="button" onClick={start} className="px-4 py-2 rounded-lg bg-accent/15 border border-accent/30 text-[13px] text-accent hover:text-white hover:bg-accent/25 transition-colors cursor-pointer">{over ? "Run again" : "Start running"}</button>
          </div>
        )}
      </div>
      {running && (
        <div className="flex gap-2 mt-3">
          <button type="button" onClick={jump} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-[12px] text-neutral-300 hover:border-accent/40 hover:text-white transition-colors cursor-pointer active:scale-95"><ArrowUp className="w-3.5 h-3.5" /> Jump</button>
          <button
            type="button"
            onPointerDown={(e) => { e.preventDefault(); slideHeld.current = true; }}
            onPointerUp={() => { slideHeld.current = false; }}
            onPointerLeave={() => { slideHeld.current = false; }}
            onPointerCancel={() => { slideHeld.current = false; }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-[12px] text-neutral-300 hover:border-accent/40 hover:text-white transition-colors cursor-pointer active:scale-95 touch-none"
          ><ArrowDown className="w-3.5 h-3.5" /> Slide (hold)</button>
        </div>
      )}
      <p className="text-[10px] text-neutral-600 mt-2">↑ / space to jump · hold ↓ to slide</p>
    </div>
  );
}
