"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

function openGame() {
  window.dispatchEvent(new CustomEvent("typing-game:open"));
}

const rnd = (min: number, max: number) => min + Math.random() * (max - min);
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const easeInOut = (k: number) => (k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2);
const easeOut = (k: number) => 1 - Math.pow(1 - k, 3);

// Poses: [leadHandX, leadHandY, swordTipX, swordTipY, frontFootX, frontFootY] (facing right)
const GUARD =      [13, 12, 21, 3, 16, 36];
const SLASH_UP =   [7, 7, 1, -5, 15, 36];
const SLASH_DOWN = [17, 15, 31, 21, 18, 36];
const THRUST =     [20, 12, 34, 12, 22, 34];
const PARRY =      [15, 6, 25, -2, 15, 36];
const STAGGER =    [8, 14, 1, 11, 11, 36];
const KICK =       [12, 12, 20, 3, 30, 18];
const RUN =        [15, 11, 23, 5, 16, 36];

type Fighter = {
  x: number;
  jumpY: number;
  facing: number; // 1 = right, -1 = left
  pose: number[];
  target: number[];
  recoil: number;
  lean: number;
  bob: number;
  running: boolean;
  runPhase: number;
};

function pathFrom(f: Fighter): string {
  const p = f.pose;
  let backFoot = [4, 36];
  let frontFoot = [p[4], p[5]];
  if (f.running) {
    const s = Math.sin(f.runPhase) * 6;
    frontFoot = [10 + s, 36 - Math.max(0, Math.sin(f.runPhase)) * 2];
    backFoot = [10 - s, 36 - Math.max(0, -Math.sin(f.runPhase)) * 2];
  }
  let dx = p[2] - p[0];
  let dy = p[3] - p[1];
  const len = Math.hypot(dx, dy) || 1;
  dx /= len;
  dy /= len;
  const px = -dy * 2.2;
  const py = dx * 2.2;
  const fn = (n: number) => n.toFixed(1);
  return (
    `M10,10 L10,22` +
    ` M10,22 L${fn(backFoot[0])},${fn(backFoot[1])}` +
    ` M10,22 L${fn(frontFoot[0])},${fn(frontFoot[1])}` +
    ` M10,10 L4,18` +
    ` M10,10 L${fn(p[0])},${fn(p[1])}` +
    ` M${fn(p[0])},${fn(p[1])} L${fn(p[2])},${fn(p[3])}` +
    ` M${fn(p[0] - px)},${fn(p[1] - py)} L${fn(p[0] + px)},${fn(p[1] + py)}`
  );
}

export function GameHeader() {
  return (
    <div className="flex items-end justify-between gap-4 mb-3">
      <StickFight />
      <PlayMeButton />
    </div>
  );
}

function StickFight() {
  const wrapRef = useRef<HTMLButtonElement>(null);
  const gA = useRef<SVGGElement>(null);
  const gB = useRef<SVGGElement>(null);
  const pA = useRef<SVGPathElement>(null);
  const pB = useRef<SVGPathElement>(null);
  const sparkRef = useRef<SVGTextElement>(null);
  const [w, setW] = useState(440);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const measure = () => setW(wrap.clientWidth || 440);
    measure();
    window.addEventListener("resize", measure);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return () => window.removeEventListener("resize", measure);
    }

    const mk = (facing: number): Fighter => ({
      x: 0, jumpY: 0, facing, pose: GUARD.slice(), target: GUARD,
      recoil: 0, lean: 0, bob: 0, running: false, runPhase: 0,
    });
    const a = mk(1);
    const b = mk(-1);

    const baseY = 10;
    const W = () => wrap.clientWidth || 440;

    let spark = 0;
    let sparkChar = "💥";
    let sparkX = 0;
    let sparkY = 16;
    const flash = (ch: string, x: number, y: number) => {
      spark = 1; sparkChar = ch; sparkX = x; sparkY = y;
    };

    // ---- choreography: a queue of timed steps ----
    type Step = { dur: number; start?: () => void; update?: (k: number) => void; end?: () => void };
    let steps: Step[] = [];
    let idx = 0;
    let stepT = 0;
    let started = false;
    const mem: { def?: Fighter; atk?: Fighter; resolved?: boolean; hits?: number } = {};

    const mid = (f: Fighter) => (f === a ? W() / 2 - 22 : W() / 2 + 22);
    const wall = (f: Fighter) => (f.facing === 1 ? 14 : W() - 14); // wall behind the fighter
    const pickRoles = () => {
      const atkIsA = Math.random() < 0.5;
      mem.atk = atkIsA ? a : b;
      mem.def = atkIsA ? b : a;
    };
    const contactX = () => W() / 2;

    const stepEnter = (): Step => ({
      dur: 1.15,
      start: () => {
        a.x = -30; b.x = W() + 30; a.facing = 1; b.facing = -1;
        a.running = b.running = true; a.target = RUN; b.target = RUN;
      },
      update: (k) => {
        const e = easeOut(k);
        a.x = lerp(-30, W() / 2 - 22, e);
        b.x = lerp(W() + 30, W() / 2 + 22, e);
        a.running = b.running = k < 0.92;
      },
      end: () => { a.running = b.running = false; a.target = GUARD; b.target = GUARD; },
    });

    const stepFaceOff = (dur: number): Step => ({
      dur,
      start: () => { a.target = GUARD; b.target = GUARD; },
    });

    const stepExchange = (): Step => {
      pickRoles();
      const slash = Math.random() < 0.6;
      return {
        dur: rnd(0.5, 0.7),
        start: () => { mem.resolved = false; },
        update: (k) => {
          const atk = mem.atk!, def = mem.def!;
          if (k < 0.32) atk.target = slash ? SLASH_UP : GUARD;
          else if (k < 0.62) {
            atk.target = slash ? SLASH_DOWN : THRUST;
            if (!mem.resolved) {
              mem.resolved = true;
              if (Math.random() < 0.5) { def.target = PARRY; flash("✦", contactX(), 14); }
              else { def.target = STAGGER; def.recoil = 7; def.lean = -12; flash("💥", contactX(), 15); }
            }
          } else { atk.target = GUARD; }
        },
        end: () => { a.target = GUARD; b.target = GUARD; },
      };
    };

    const stepFlurry = (): Step => ({
      dur: rnd(1.0, 1.4),
      start: () => { mem.hits = 0; },
      update: (k) => {
        const seg = Math.floor(k * 5);
        const atk = seg % 2 === 0 ? a : b;
        const def = seg % 2 === 0 ? b : a;
        const local = (k * 5) % 1;
        atk.target = local < 0.5 ? SLASH_UP : SLASH_DOWN;
        def.target = GUARD;
        if (local > 0.45 && local < 0.6 && mem.hits !== seg) {
          mem.hits = seg;
          flash(Math.random() < 0.5 ? "✦" : "💥", contactX(), 14);
          def.target = PARRY;
        }
      },
      end: () => { a.target = GUARD; b.target = GUARD; },
    });

    const stepLungeRetreat = (): Step => {
      pickRoles();
      const atk = mem.atk!, def = mem.def!;
      const ax0 = atk.x, dx0 = def.x;
      return {
        dur: 0.6,
        update: (k) => {
          atk.target = THRUST;
          atk.x = lerp(ax0, ax0 + atk.facing * 12, easeOut(Math.min(1, k * 1.4)));
          // defender leaps back with a small hop
          def.target = GUARD;
          def.x = lerp(dx0, dx0 - def.facing * 34, easeOut(k));
          def.jumpY = Math.sin(k * Math.PI) * 8;
          if (k > 0.25 && k < 0.4) flash("✦", contactX(), 14);
        },
        end: () => { atk.x = ax0; def.jumpY = 0; a.target = GUARD; b.target = GUARD; },
      };
    };

    const stepCharge = (): Step => {
      const ax0 = a.x, bx0 = b.x;
      return {
        dur: 0.55,
        start: () => { a.running = b.running = true; a.target = RUN; b.target = RUN; },
        update: (k) => {
          const e = easeInOut(k);
          a.x = lerp(ax0, W() / 2 - 22, e);
          b.x = lerp(bx0, W() / 2 + 22, e);
        },
        end: () => { a.running = b.running = false; a.target = GUARD; b.target = GUARD; },
      };
    };

    const stepJumpStrike = (): Step => {
      pickRoles();
      const atk = mem.atk!, def = mem.def!;
      const ax0 = atk.x;
      return {
        dur: 0.85,
        start: () => { mem.resolved = false; },
        update: (k) => {
          atk.jumpY = Math.sin(k * Math.PI) * 13;
          atk.x = lerp(ax0, ax0 + atk.facing * 14, easeInOut(k));
          atk.target = k < 0.55 ? SLASH_UP : SLASH_DOWN;
          if (k > 0.55 && !mem.resolved) {
            mem.resolved = true;
            if (Math.random() < 0.45) { def.target = PARRY; flash("✦", contactX(), 13); }
            else { def.target = STAGGER; def.recoil = 8; def.lean = -14; flash("💥", contactX(), 15); }
          }
        },
        end: () => { atk.jumpY = 0; atk.x = ax0; a.target = GUARD; b.target = GUARD; },
      };
    };

    const stepKnockbackWall = (): Step => {
      pickRoles();
      const atk = mem.atk!, def = mem.def!;
      const dx0 = def.x;
      const wx = wall(def);
      mem.def = def;
      return {
        dur: 0.95,
        start: () => { atk.target = SLASH_DOWN; },
        update: (k) => {
          if (k < 0.2) atk.target = SLASH_DOWN;
          else atk.target = GUARD;
          def.target = STAGGER;
          def.x = lerp(dx0, wx, easeOut(k));
          def.lean = -16 * (1 - k);
          if (k > 0.82 && spark < 0.2) flash("✦", wx + def.facing * 8, 30);
        },
        end: () => { def.lean = 0; atk.target = GUARD; },
      };
    };

    const stepChargeBack = (): Step => {
      const def = mem.def ?? b;
      const dx0 = def.x;
      const target = mid(def);
      return {
        dur: 0.6,
        start: () => { def.running = true; def.target = RUN; },
        update: (k) => { def.x = lerp(dx0, target, easeInOut(k)); },
        end: () => { def.running = false; def.target = GUARD; },
      };
    };

    const stepFinisher = (): Step => {
      pickRoles();
      const atk = mem.atk!, def = mem.def!;
      return {
        dur: 1.0,
        start: () => { mem.resolved = false; },
        update: (k) => {
          if (k < 0.3) atk.target = SLASH_UP;
          else if (k < 0.55) {
            atk.target = SLASH_DOWN;
            if (!mem.resolved) { mem.resolved = true; def.target = STAGGER; def.recoil = 10; def.lean = -20; flash("💥", contactX(), 15); }
          } else { atk.target = GUARD; def.target = STAGGER; def.lean = lerp(-20, -6, (k - 0.55) / 0.45); }
        },
        end: () => { def.lean = 0; def.recoil = 0; a.target = GUARD; b.target = GUARD; },
      };
    };

    const stepExit = (): Step => {
      const ax0 = a.x, bx0 = b.x;
      return {
        dur: 0.7,
        start: () => { a.running = b.running = true; a.target = RUN; b.target = RUN; a.facing = -1; b.facing = 1; },
        update: (k) => { a.x = lerp(ax0, -30, easeInOut(k)); b.x = lerp(bx0, W() + 30, easeInOut(k)); },
        end: () => { a.facing = 1; b.facing = -1; },
      };
    };

    const buildScript = (): Step[] => {
      const s: Step[] = [stepEnter(), stepFaceOff(rnd(0.35, 0.6))];
      const beats = Math.floor(rnd(4, 7));
      for (let i = 0; i < beats; i++) {
        const r = Math.random();
        if (r < 0.32) s.push(stepExchange());
        else if (r < 0.52) s.push(stepFlurry());
        else if (r < 0.7) { s.push(stepLungeRetreat()); s.push(stepCharge()); }
        else if (r < 0.86) s.push(stepJumpStrike());
        else { s.push(stepKnockbackWall()); s.push(stepChargeBack()); }
        s.push(stepFaceOff(rnd(0.15, 0.4)));
      }
      s.push(stepFinisher());
      s.push(stepExit());
      return s;
    };

    steps = buildScript();

    let last = performance.now();
    let raf = 0;

    const render = (f: Fighter, g: SVGGElement | null, path: SVGPathElement | null) => {
      if (path) path.setAttribute("d", pathFrom(f));
      if (g) {
        const rx = f.x - f.facing * f.recoil;
        const ry = baseY - f.jumpY - f.bob;
        g.setAttribute("transform", `translate(${rx.toFixed(2)},${ry.toFixed(2)}) scale(${f.facing},1) rotate(${(f.lean * f.facing).toFixed(2)} 10 22)`);
      }
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      // director
      if (idx >= steps.length) { steps = buildScript(); idx = 0; stepT = 0; started = false; }
      const s = steps[idx];
      if (!started) { s.start?.(); started = true; stepT = 0; }
      stepT += dt;
      const k = Math.min(1, stepT / s.dur);
      s.update?.(k);
      if (stepT >= s.dur) { s.end?.(); idx++; started = false; }

      // integrate
      for (const f of [a, b]) {
        f.runPhase += dt * (f.running ? 22 : 0);
        f.bob = f.running ? Math.abs(Math.sin(f.runPhase)) * 1.5 : Math.sin(now / 90 + f.facing) * 0.8;
        lerpPose(f.pose, f.target, Math.min(1, dt * 17));
        f.recoil += (0 - f.recoil) * Math.min(1, dt * 9);
        f.lean += (0 - f.lean) * Math.min(1, dt * 7);
        if (f.recoil < 0.04) f.recoil = 0;
      }
      spark = Math.max(0, spark - dt * 2.6);

      render(a, gA.current, pA.current);
      render(b, gB.current, pB.current);
      if (sparkRef.current) {
        sparkRef.current.textContent = sparkChar;
        sparkRef.current.setAttribute("x", String(sparkX));
        sparkRef.current.setAttribute("y", String(sparkY));
        sparkRef.current.setAttribute("opacity", spark.toFixed(2));
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <button
      ref={wrapRef}
      type="button"
      onClick={openGame}
      aria-label="Play the typing game"
      title="Play the typing game"
      className="group relative flex-1 h-14 cursor-pointer text-left"
    >
      <span className="absolute top-0 left-1 text-[9px] font-mono text-neutral-600 group-hover:text-fuchsia-400 transition-colors z-10">
        click to play
      </span>
      <svg width="100%" height="52" viewBox={`0 0 ${w} 52`} preserveAspectRatio="xMidYMax meet">
        <line x1="0" y1="46" x2={w} y2="46" stroke="rgba(168,85,247,0.25)" strokeWidth="1" strokeDasharray="3 3" />
        <g ref={gA}>
          <path ref={pA} stroke="#c4b5fd" strokeWidth="1.6" strokeLinecap="round" fill="none" />
          <circle cx="10" cy="6" r="3.5" stroke="#c4b5fd" strokeWidth="1.6" fill="none" />
        </g>
        <g ref={gB}>
          <path ref={pB} stroke="#f0abfc" strokeWidth="1.6" strokeLinecap="round" fill="none" />
          <circle cx="10" cy="6" r="3.5" stroke="#f0abfc" strokeWidth="1.6" fill="none" />
        </g>
        <text ref={sparkRef} textAnchor="middle" fontSize="13" opacity="0">💥</text>
      </svg>
    </button>
  );
}

function lerpPose(p: number[], target: number[], a: number) {
  for (let i = 0; i < p.length; i++) p[i] += (target[i] - p[i]) * a;
}

function PlayMeButton() {
  return (
    <motion.button
      type="button"
      onClick={openGame}
      aria-label="Play the typing game"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      animate={{
        boxShadow: [
          "0 0 0px rgba(217,70,239,0.0)",
          "0 0 20px rgba(217,70,239,0.55)",
          "0 0 0px rgba(217,70,239,0.0)",
        ],
      }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      className="relative shrink-0 px-4 py-2 rounded-md border-2 border-fuchsia-400/70 bg-fuchsia-500/10 hover:bg-fuchsia-500/20 cursor-pointer"
    >
      <span
        className="font-mono font-bold text-sm tracking-[0.2em]"
        style={{ color: "#f5b8fb", textShadow: "0 0 8px rgba(232,121,249,0.85)" }}
      >
        PLAY ME
      </span>
    </motion.button>
  );
}
