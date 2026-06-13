"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Trophy } from "lucide-react";

const COLS = 21;
const ROWS = 14;
const CELL = 14;
const BEST_KEY = "snake-best-score";
const TICK = 95;

type P = { x: number; y: number };

export function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const snake = useRef<P[]>([]);
  const dir = useRef<P>({ x: 1, y: 0 });
  const nextDir = useRef<P>({ x: 1, y: 0 });
  const food = useRef<P>({ x: 5, y: 5 });
  const loop = useRef<ReturnType<typeof setInterval> | null>(null);
  const [score, setScore] = useState(0);
  const [running, setRunning] = useState(false);
  const [over, setOver] = useState(false);
  const [best, setBest] = useState<number | null>(null);

  const placeFood = useCallback(() => {
    let p: P;
    do {
      p = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
    } while (snake.current.some((s) => s.x === p.x && s.y === p.y));
    food.current = p;
  }, []);

  const draw = useCallback(() => {
    const c = canvasRef.current;
    const ctx = c?.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, COLS * CELL, ROWS * CELL);
    // subtle grid
    ctx.strokeStyle = "rgba(168,85,247,0.06)";
    ctx.lineWidth = 1;
    for (let x = 0; x <= COLS; x++) { ctx.beginPath(); ctx.moveTo(x * CELL + 0.5, 0); ctx.lineTo(x * CELL + 0.5, ROWS * CELL); ctx.stroke(); }
    for (let y = 0; y <= ROWS; y++) { ctx.beginPath(); ctx.moveTo(0, y * CELL + 0.5); ctx.lineTo(COLS * CELL, y * CELL + 0.5); ctx.stroke(); }
    // food
    const f = food.current;
    ctx.fillStyle = "#fbbf24";
    ctx.shadowColor = "rgba(251,191,36,0.7)";
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.roundRect(f.x * CELL + 3, f.y * CELL + 3, CELL - 6, CELL - 6, 3);
    ctx.fill();
    ctx.shadowBlur = 0;
    // snake
    snake.current.forEach((s, i) => {
      const head = i === snake.current.length - 1;
      ctx.fillStyle = head ? "#d8b4fe" : "#a855f7";
      ctx.beginPath();
      ctx.roundRect(s.x * CELL + 1.5, s.y * CELL + 1.5, CELL - 3, CELL - 3, 3);
      ctx.fill();
    });
  }, []);

  const tick = useCallback(() => {
    dir.current = nextDir.current;
    const head = snake.current[snake.current.length - 1];
    const nh = { x: head.x + dir.current.x, y: head.y + dir.current.y };
    if (nh.x < 0 || nh.y < 0 || nh.x >= COLS || nh.y >= ROWS || snake.current.some((s) => s.x === nh.x && s.y === nh.y)) {
      if (loop.current) clearInterval(loop.current);
      setRunning(false);
      setOver(true);
      setBest((p) => {
        const sc = snake.current.length - 3;
        const next = p === null ? sc : Math.max(p, sc);
        try { localStorage.setItem(BEST_KEY, String(next)); } catch {}
        return next;
      });
      return;
    }
    snake.current.push(nh);
    if (nh.x === food.current.x && nh.y === food.current.y) {
      setScore(snake.current.length - 3);
      placeFood();
    } else {
      snake.current.shift();
    }
    draw();
  }, [draw, placeFood]);

  const start = useCallback(() => {
    snake.current = [{ x: 4, y: 7 }, { x: 5, y: 7 }, { x: 6, y: 7 }];
    dir.current = { x: 1, y: 0 };
    nextDir.current = { x: 1, y: 0 };
    placeFood();
    setScore(0);
    setOver(false);
    setRunning(true);
    draw();
    if (loop.current) clearInterval(loop.current);
    loop.current = setInterval(tick, TICK);
  }, [draw, placeFood, tick]);

  useEffect(() => {
    try { const b = localStorage.getItem(BEST_KEY); if (b) setBest(parseInt(b, 10)); } catch {}
    // dpr-crisp canvas
    const c = canvasRef.current;
    if (c) {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      c.width = COLS * CELL * dpr;
      c.height = ROWS * CELL * dpr;
      c.style.width = `${COLS * CELL}px`;
      c.style.height = `${ROWS * CELL}px`;
      c.getContext("2d")?.scale(dpr, dpr);
    }
    snake.current = [{ x: 4, y: 7 }, { x: 5, y: 7 }, { x: 6, y: 7 }];
    placeFood();
    draw();
    return () => { if (loop.current) clearInterval(loop.current); };
  }, [draw, placeFood]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      const map: Record<string, P> = {
        arrowup: { x: 0, y: -1 }, w: { x: 0, y: -1 },
        arrowdown: { x: 0, y: 1 }, s: { x: 0, y: 1 },
        arrowleft: { x: -1, y: 0 }, a: { x: -1, y: 0 },
        arrowright: { x: 1, y: 0 }, d: { x: 1, y: 0 },
      };
      const nd = map[k];
      if (!nd) return;
      e.preventDefault();
      const cur = dir.current;
      if (nd.x === -cur.x && nd.y === -cur.y) return; // no reverse
      nextDir.current = nd;
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="font-mono flex flex-col items-center">
      <div className="flex items-center gap-5 text-[11px] mb-3 w-full justify-center">
        <span className="text-neutral-500">SCORE <span className="text-purple-300 text-sm">{score}</span></span>
        {best !== null && <span className="text-amber-300 flex items-center gap-1 text-sm"><Trophy className="w-3.5 h-3.5" />{best}</span>}
      </div>
      <div className="relative">
        <canvas ref={canvasRef} className="rounded-lg border border-white/10 bg-black/40" />
        {!running && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/55 rounded-lg backdrop-blur-sm">
            <p className="text-sm text-white">{over ? `Game over — score ${score}` : "Terminal Snake"}</p>
            <button type="button" onClick={start} className="px-4 py-2 rounded-lg bg-purple-500/15 border border-purple-500/30 text-[13px] text-purple-300 hover:text-white hover:bg-purple-500/25 transition-colors cursor-pointer">{over ? "Play again" : "Start"}</button>
            <p className="text-[10px] text-neutral-500">arrow keys / WASD</p>
          </div>
        )}
      </div>
    </div>
  );
}
