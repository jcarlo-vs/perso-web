"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";

function openGame() {
  window.dispatchEvent(new CustomEvent("typing-game:open"));
}

const rnd = (min: number, max: number) => min + Math.random() * (max - min);

// Each critter wanders independently: walk, pause, turn at edges, face its
// direction, and (some) hop now and then. Emoji animals face left by default,
// so we flip scaleX when walking right.
const SPECIES = [
  { emoji: "🐢", size: 15, speed: 11, hops: false, pauseChance: 0.005, pause: [1.2, 3.5] as const },
  { emoji: "🦖", size: 16, speed: 25, hops: false, pauseChance: 0.003, pause: [0.5, 1.6] as const },
  { emoji: "🐕", size: 15, speed: 38, hops: true, pauseChance: 0.004, pause: [0.4, 1.3] as const },
  { emoji: "🐈", size: 14, speed: 31, hops: true, pauseChance: 0.007, pause: [0.8, 2.6] as const },
];

function PetParade() {
  const wrapRef = useRef<HTMLButtonElement>(null);
  const petEls = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let width = wrap.clientWidth || 440;
    const onResize = () => (width = wrap.clientWidth || 440);
    window.addEventListener("resize", onResize);

    const pets = SPECIES.map((s) => ({
      ...s,
      x: rnd(20, width - 40),
      dir: Math.random() < 0.5 ? 1 : -1,
      v: s.speed * rnd(0.85, 1.2),
      pauseLeft: rnd(0, 2),
      phase: rnd(0, 6),
      hop: 0,
      hopVel: 0,
    }));

    let last = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      pets.forEach((p, i) => {
        const el = petEls.current[i];
        if (!el) return;

        if (p.pauseLeft > 0) {
          p.pauseLeft -= dt;
        } else {
          p.x += p.dir * p.v * dt;
          p.phase += dt * (p.v * 0.16);
          if (p.x < 2) {
            p.x = 2;
            p.dir = 1;
          } else if (p.x > width - 20) {
            p.x = width - 20;
            p.dir = -1;
          } else if (Math.random() < p.pauseChance) {
            p.pauseLeft = rnd(p.pause[0], p.pause[1]);
          } else if (Math.random() < 0.0015) {
            p.dir *= -1;
          }
          if (p.hops && p.hop <= 0 && Math.random() < 0.004) p.hopVel = 130;
        }

        if (p.hopVel > 0 || p.hop > 0) {
          p.hop += p.hopVel * dt;
          p.hopVel -= 520 * dt;
          if (p.hop <= 0) {
            p.hop = 0;
            p.hopVel = 0;
          }
        }

        const walking = p.pauseLeft <= 0;
        const bob = walking ? Math.abs(Math.sin(p.phase)) * 1.6 : Math.sin(now / 420 + p.phase) * 0.6;
        const face = p.dir > 0 ? -1 : 1;
        el.style.transform = `translateX(${p.x.toFixed(1)}px) translateY(${(-(bob + p.hop)).toFixed(1)}px) scaleX(${face})`;
      });

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <button
      ref={wrapRef}
      type="button"
      onClick={openGame}
      aria-label="Play the typing game"
      title="Play the typing game"
      className="group relative flex-1 h-12 overflow-hidden cursor-pointer text-left"
    >
      {/* pulsing invite */}
      <motion.span
        animate={{
          scale: [1, 1.07, 1],
          opacity: [0.75, 1, 0.75],
          boxShadow: [
            "0 0 0px rgba(168,85,247,0.0)",
            "0 0 14px rgba(168,85,247,0.4)",
            "0 0 0px rgba(168,85,247,0.0)",
          ],
        }}
        transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1 left-1 z-10 inline-flex items-center gap-1.5 rounded-full border border-purple-500/35 bg-purple-500/10 px-2.5 py-1 font-mono text-[10px] tracking-wide text-purple-200 group-hover:text-fuchsia-200 group-hover:border-fuchsia-400/50 transition-colors"
      >
        <Play className="w-2.5 h-2.5 fill-current" />
        click to play
      </motion.span>

      {/* ground */}
      <div className="absolute bottom-1.5 left-0 right-0 border-b border-dashed border-purple-500/25" />

      {SPECIES.map((s, i) => (
        <span
          key={i}
          ref={(el) => {
            petEls.current[i] = el;
          }}
          className="absolute bottom-[4px] left-0 select-none"
          style={{ fontSize: s.size, transform: "translateX(-40px)" }}
        >
          {s.emoji}
        </span>
      ))}
    </button>
  );
}

export function GameHeader() {
  return (
    <div className="flex mb-3">
      <PetParade />
    </div>
  );
}
