"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

function openGame() {
  window.dispatchEvent(new CustomEvent("typing-game:open"));
}

const rnd = (min: number, max: number) => min + Math.random() * (max - min);

// Poses: [leadHandX, leadHandY, swordTipX, swordTipY, frontFootX, frontFootY]
// Local coords, facing right. Opponent is toward +x.
const GUARD =      [13, 12, 21, 3, 16, 36];
const SLASH_UP =   [7, 7, 1, -5, 15, 36];   // sword cocked overhead/behind
const SLASH_DOWN = [17, 15, 31, 21, 18, 36]; // slashed down toward opponent
const THRUST =     [20, 12, 34, 12, 22, 34]; // sword stabbed forward
const PARRY =      [15, 6, 25, -2, 15, 36];  // sword raised to block
const STAGGER =    [8, 14, 1, 10, 12, 36];   // knocked back, sword low
const KICK =       [12, 12, 20, 3, 30, 18];  // front kick, sword in guard

function pathFrom(p: number[]): string {
  const [lhx, lhy, stx, sty, ffx, ffy] = p;
  let dx = stx - lhx;
  let dy = sty - lhy;
  const len = Math.hypot(dx, dy) || 1;
  dx /= len;
  dy /= len;
  const px = -dy * 2.2;
  const py = dx * 2.2;
  const f = (n: number) => n.toFixed(1);
  return (
    `M10,10 L10,22` + // torso
    ` M10,22 L4,36` + // back leg
    ` M10,22 L${f(ffx)},${f(ffy)}` + // front leg
    ` M10,10 L4,18` + // rear arm
    ` M10,10 L${f(lhx)},${f(lhy)}` + // lead arm
    ` M${f(lhx)},${f(lhy)} L${f(stx)},${f(sty)}` + // sword blade
    ` M${f(lhx - px)},${f(lhy - py)} L${f(lhx + px)},${f(lhy + py)}` // hilt guard
  );
}

function lerpPose(p: number[], target: number[], a: number) {
  for (let i = 0; i < p.length; i++) p[i] += (target[i] - p[i]) * a;
}

/** Two stick swordsmen dueling with randomized slashes, thrusts, parries and kicks. */
function StickFight() {
  const wrapRef = useRef<HTMLButtonElement>(null);
  const innerA = useRef<SVGGElement>(null);
  const innerB = useRef<SVGGElement>(null);
  const pathA = useRef<SVGPathElement>(null);
  const pathB = useRef<SVGPathElement>(null);
  const sparkRef = useRef<SVGTextElement>(null);
  const [w, setW] = useState(420);

  const C = w / 2;
  const xL = C - 21;
  const xR = C + 21;

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const measure = () => setW(wrap.clientWidth || 420);
    measure();
    window.addEventListener("resize", measure);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return () => window.removeEventListener("resize", measure);
    }

    const mk = (phase: number) => ({
      pose: GUARD.slice(),
      target: GUARD as number[],
      lunge: 0,
      recoil: 0,
      lean: 0,
      bobOut: 0,
      phase,
      recoverAt: 0,
    });
    const fs = {
      a: mk(0),
      b: mk(1.6),
      attacking: false,
      who: "a" as "a" | "b",
      action: "slash" as "slash" | "thrust" | "kick",
      step: "" as "" | "windup" | "strike" | "recover",
      stepEnd: 0,
      resolved: false,
      nextAt: 0.7,
      spark: 0,
      sparkChar: "💥",
      t: 0,
    };

    let last = performance.now();
    let raf = 0;

    const resolveHit = () => {
      if (fs.resolved) return;
      fs.resolved = true;
      const atk = fs.who === "a" ? fs.a : fs.b;
      const def = fs.who === "a" ? fs.b : fs.a;
      const parry = fs.action !== "kick" && Math.random() < 0.5;
      if (parry) {
        def.target = PARRY;
        def.recoverAt = fs.t + 0.3;
        atk.recoil = 3; // bounce off the block
        fs.spark = 1;
        fs.sparkChar = "✦";
      } else {
        def.target = STAGGER;
        def.recoverAt = fs.t + 0.32;
        def.recoil = 7;
        def.lean = -13; // lean away from opponent
        fs.spark = 1;
        fs.sparkChar = "💥";
      }
    };

    const setEl = (inner: SVGGElement | null, path: SVGPathElement | null, f: typeof fs.a) => {
      if (path) path.setAttribute("d", pathFrom(f.pose));
      if (inner) {
        const tx = f.lunge - f.recoil;
        inner.setAttribute(
          "transform",
          `translate(${tx.toFixed(2)},${(-f.bobOut).toFixed(2)}) rotate(${f.lean.toFixed(2)} 10 22)`
        );
      }
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      fs.t += dt;

      fs.a.bobOut = Math.sin(fs.t * 7 + fs.a.phase) * 1.0;
      fs.b.bobOut = Math.sin(fs.t * 7 + fs.b.phase) * 1.0;

      // begin a move
      if (!fs.attacking && fs.t >= fs.nextAt) {
        fs.attacking = true;
        fs.who = Math.random() < 0.5 ? "a" : "b";
        const r = Math.random();
        fs.action = r < 0.55 ? "slash" : r < 0.85 ? "thrust" : "kick";
        fs.step = "windup";
        fs.stepEnd = fs.t + (fs.action === "slash" ? 0.14 : 0.08);
        fs.resolved = false;
      }

      if (fs.attacking) {
        const atk = fs.who === "a" ? fs.a : fs.b;
        if (fs.step === "windup") {
          atk.target = fs.action === "slash" ? SLASH_UP : GUARD;
          if (fs.t >= fs.stepEnd) {
            fs.step = "strike";
            atk.target = fs.action === "slash" ? SLASH_DOWN : fs.action === "thrust" ? THRUST : KICK;
            atk.lunge = fs.action === "thrust" ? 6 : fs.action === "kick" ? 3 : 4;
            resolveHit();
            fs.stepEnd = fs.t + 0.16;
          }
        } else if (fs.step === "strike") {
          if (fs.t >= fs.stepEnd) {
            fs.step = "recover";
            atk.target = GUARD;
            atk.lunge = 0;
            fs.stepEnd = fs.t + 0.18;
          }
        } else if (fs.step === "recover") {
          if (fs.t >= fs.stepEnd) {
            fs.attacking = false;
            fs.step = "";
            fs.nextAt = fs.t + rnd(0.35, 1.1);
          }
        }
      }

      // return non-attacking fighters to guard after their recovery window
      for (const key of ["a", "b"] as const) {
        const f = fs[key];
        const isActiveAttacker = fs.attacking && fs.who === key;
        if (!isActiveAttacker && fs.t > f.recoverAt) f.target = GUARD;
      }

      // integrate
      for (const f of [fs.a, fs.b]) {
        lerpPose(f.pose, f.target, Math.min(1, dt * 17));
        f.recoil += (0 - f.recoil) * Math.min(1, dt * 9);
        f.lean += (0 - f.lean) * Math.min(1, dt * 8);
        if (f.recoil < 0.04) f.recoil = 0;
      }
      fs.spark = Math.max(0, fs.spark - dt * 2.6);

      setEl(innerA.current, pathA.current, fs.a);
      setEl(innerB.current, pathB.current, fs.b);
      if (sparkRef.current) {
        sparkRef.current.textContent = fs.sparkChar;
        sparkRef.current.setAttribute("opacity", fs.spark.toFixed(2));
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
      className="group relative flex-1 h-12 cursor-pointer text-left"
    >
      <span className="absolute top-0 left-1 text-[9px] font-mono text-neutral-600 group-hover:text-fuchsia-400 transition-colors z-10">
        click to play
      </span>
      <svg width="100%" height="46" viewBox={`0 0 ${w} 46`} preserveAspectRatio="xMidYMax meet">
        <line x1="0" y1="42" x2={w} y2="42" stroke="rgba(168,85,247,0.25)" strokeWidth="1" strokeDasharray="3 3" />
        <g transform={`translate(${xL},6)`}>
          <g ref={innerA}>
            <path ref={pathA} d={pathFrom(GUARD)} stroke="#c4b5fd" strokeWidth="1.6" strokeLinecap="round" fill="none" />
            <circle cx="10" cy="6" r="3.5" stroke="#c4b5fd" strokeWidth="1.6" fill="none" />
          </g>
        </g>
        <g transform={`translate(${xR},6) scale(-1,1)`}>
          <g ref={innerB}>
            <path ref={pathB} d={pathFrom(GUARD)} stroke="#f0abfc" strokeWidth="1.6" strokeLinecap="round" fill="none" />
            <circle cx="10" cy="6" r="3.5" stroke="#f0abfc" strokeWidth="1.6" fill="none" />
          </g>
        </g>
        <text ref={sparkRef} x={C} y="16" textAnchor="middle" fontSize="13" opacity="0">💥</text>
      </svg>
    </button>
  );
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

export function GameHeader() {
  return (
    <div className="flex items-end justify-between gap-4 mb-3">
      <StickFight />
      <PlayMeButton />
    </div>
  );
}
