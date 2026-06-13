"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

function openGame() {
  window.dispatchEvent(new CustomEvent("typing-game:open"));
}

const rnd = (min: number, max: number) => min + Math.random() * (max - min);

// Stick figure skeleton (local coords, facing right). punch/kick in 0..1.
function bodyPath(punch: number, kick: number): string {
  const leadHandX = 16 + 14 * punch;
  const leadHandY = 14 - 2 * punch;
  const frontFootX = 16 + 14 * kick;
  const frontFootY = 36 - 18 * kick;
  return (
    `M10,10 L10,22` + // torso
    ` M10,22 L4,36` + // back leg
    ` M10,22 L${frontFootX.toFixed(1)},${frontFootY.toFixed(1)}` + // front leg (kicks)
    ` M10,10 L4,18` + // rear arm (guard)
    ` M10,10 L${leadHandX.toFixed(1)},${leadHandY.toFixed(1)}` // lead arm (punches)
  );
}

/** Two stick fighters trading randomized punches and kicks, with impact bursts. */
function StickFight() {
  const wrapRef = useRef<HTMLButtonElement>(null);
  const innerA = useRef<SVGGElement>(null);
  const innerB = useRef<SVGGElement>(null);
  const pathA = useRef<SVGPathElement>(null);
  const pathB = useRef<SVGPathElement>(null);
  const sparkRef = useRef<SVGTextElement>(null);
  const [w, setW] = useState(420);

  const C = w / 2;
  const GAP = 40;
  const xL = C - GAP / 2;
  const xR = C + GAP / 2;

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const measure = () => setW(wrap.clientWidth || 420);
    measure();
    window.addEventListener("resize", measure);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return () => window.removeEventListener("resize", measure);
    }

    // mutable per-frame state
    const fs = {
      a: { punch: 0, kick: 0, lunge: 0, recoil: 0, lean: 0, phase: 0, bobOut: 0 },
      b: { punch: 0, kick: 0, lunge: 0, recoil: 0, lean: 0, phase: 1.6, bobOut: 0 },
      attacking: false,
      who: "a" as "a" | "b",
      action: "punch" as "punch" | "kick",
      moveStart: 0,
      moveDur: 0.34,
      nextAt: 0.7,
      sparked: false,
      spark: 0,
      t: 0,
    };

    let last = performance.now();
    let raf = 0;

    const setFighter = (
      inner: SVGGElement | null,
      path: SVGPathElement | null,
      f: typeof fs.a
    ) => {
      if (path) path.setAttribute("d", bodyPath(f.punch, f.kick));
      if (inner) {
        const tx = f.lunge - f.recoil;
        inner.setAttribute("transform", `translate(${tx.toFixed(2)},${(-f.bobOut).toFixed(2)}) rotate(${f.lean.toFixed(2)} 10 22)`);
      }
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      fs.t += dt;

      // footwork bob
      fs.a.bobOut = Math.sin(fs.t * 7 + fs.a.phase) * 1.1;
      fs.b.bobOut = Math.sin(fs.t * 7 + fs.b.phase) * 1.1;

      // start a move
      if (!fs.attacking && fs.t >= fs.nextAt) {
        fs.attacking = true;
        fs.who = Math.random() < 0.5 ? "a" : "b";
        fs.action = Math.random() < 0.6 ? "punch" : "kick";
        fs.moveStart = fs.t;
        fs.moveDur = rnd(0.28, 0.42);
        fs.sparked = false;
      }

      const atk = fs.who === "a" ? fs.a : fs.b;
      const def = fs.who === "a" ? fs.b : fs.a;

      if (fs.attacking) {
        const local = Math.min(1, (fs.t - fs.moveStart) / fs.moveDur);
        const strength = Math.sin(local * Math.PI); // 0 -> 1 -> 0
        if (fs.action === "punch") {
          atk.punch = strength;
          atk.kick = 0;
        } else {
          atk.kick = strength;
          atk.punch = 0;
        }
        atk.lunge = strength * 5;
        // contact near the peak
        if (!fs.sparked && local > 0.45) {
          fs.sparked = true;
          def.recoil = 6;
          def.lean = fs.who === "a" ? -10 : 10; // lean away from attacker
          fs.spark = 1;
        }
        if (local >= 1) {
          fs.attacking = false;
          atk.punch = 0;
          atk.kick = 0;
          atk.lunge = 0;
          fs.nextAt = fs.t + rnd(0.35, 1.0);
        }
      }

      // decay recoil + lean back to neutral
      for (const f of [fs.a, fs.b]) {
        f.recoil *= Math.pow(0.0008, dt); // fast settle
        f.lean += (0 - f.lean) * Math.min(1, dt * 9);
        if (f.recoil < 0.05) f.recoil = 0;
      }
      fs.spark = Math.max(0, fs.spark - dt * 2.4);

      setFighter(innerA.current, pathA.current, fs.a);
      setFighter(innerB.current, pathB.current, fs.b);
      if (sparkRef.current) sparkRef.current.setAttribute("opacity", fs.spark.toFixed(2));

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
    };
  }, []);

  const stroke = "#c4b5fd";
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
        {/* ground */}
        <line x1="0" y1="42" x2={w} y2="42" stroke="rgba(168,85,247,0.25)" strokeWidth="1" strokeDasharray="3 3" />
        {/* fighter A (faces right) */}
        <g transform={`translate(${xL},6)`}>
          <g ref={innerA}>
            <path ref={pathA} d={bodyPath(0, 0)} stroke={stroke} strokeWidth="1.6" strokeLinecap="round" fill="none" />
            <circle cx="10" cy="6" r="3.5" stroke={stroke} strokeWidth="1.6" fill="none" />
          </g>
        </g>
        {/* fighter B (mirrored, faces left) */}
        <g transform={`translate(${xR},6) scale(-1,1)`}>
          <g ref={innerB}>
            <path ref={pathB} d={bodyPath(0, 0)} stroke="#a78bfa" strokeWidth="1.6" strokeLinecap="round" fill="none" />
            <circle cx="10" cy="6" r="3.5" stroke="#a78bfa" strokeWidth="1.6" fill="none" />
          </g>
        </g>
        {/* impact burst */}
        <text ref={sparkRef} x={C} y="20" textAnchor="middle" fontSize="13" opacity="0">💥</text>
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
