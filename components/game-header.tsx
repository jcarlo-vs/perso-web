"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

function openGame() {
  window.dispatchEvent(new CustomEvent("typing-game:open"));
}

const rnd = (min: number, max: number) => min + Math.random() * (max - min);

/** A live Chrome-dino scene driven by requestAnimationFrame: cacti scroll in at
 *  randomized speeds/gaps, and the T-rex reacts and jumps when one gets close. */
function DinoRunner() {
  const wrapRef = useRef<HTMLButtonElement>(null);
  const dinoRef = useRef<HTMLSpanElement>(null);
  const c1Ref = useRef<HTMLSpanElement>(null);
  const c2Ref = useRef<HTMLSpanElement>(null);
  const walkerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const wrap = wrapRef.current;
    const dino = dinoRef.current;
    const cacti = [c1Ref.current, c2Ref.current].filter(Boolean) as HTMLSpanElement[];
    const walker = walkerRef.current;
    if (!wrap || !dino) return;

    let width = wrap.clientWidth || 400;
    let dinoX = width / 2; // T-rex runs in the middle
    const onResize = () => {
      width = wrap.clientWidth || 400;
      dinoX = width / 2;
    };
    window.addEventListener("resize", onResize);

    const GRAVITY = 1500;

    // obstacle state, spaced out and at varied speeds
    const obs = cacti.map((el, i) => ({
      el,
      x: width + i * rnd(200, 360) + 80,
      speed: rnd(75, 135),
    }));

    let dy = 0; // height above ground
    let vy = 0;
    let jumping = false;

    let wx = -30;
    let wSpeed = rnd(20, 46);
    let wPause = 0;

    let last = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      // move + respawn cacti with fresh random speed and gap
      for (const o of obs) {
        o.x -= o.speed * dt;
        if (o.x < -26) {
          const furthest = Math.max(width, ...obs.map((b) => b.x));
          o.x = furthest + rnd(170, 380);
          o.speed = rnd(75, 145);
        }
        o.el.style.transform = `translateX(${o.x}px)`;
      }

      // react: jump when a cactus enters a (randomized) reaction window
      if (!jumping) {
        for (const o of obs) {
          const dist = o.x - dinoX;
          if (dist > 6 && dist < rnd(40, 64)) {
            vy = rnd(245, 285);
            jumping = true;
            break;
          }
        }
      }
      if (jumping) {
        dy += vy * dt;
        vy -= GRAVITY * dt;
        if (dy <= 0) {
          dy = 0;
          vy = 0;
          jumping = false;
        }
      }
      const bob = jumping ? 0 : Math.sin(now / 90) * 1.5;
      // scaleX(-1) flips the T-rex to face right, toward the PLAY ME button
      dino.style.transform = `translateX(${dinoX}px) translateY(${-(dy) - bob}px) scaleX(-1)`;

      // background walker: varied speed + occasional pauses
      if (walker) {
        if (wPause > 0) {
          wPause -= dt;
        } else {
          wx += wSpeed * dt;
          if (wx > width + 24) {
            wx = -30;
            wSpeed = rnd(18, 50);
            wPause = rnd(0, 1.8);
          }
        }
        walker.style.transform = `translateX(${wx}px) translateY(${-Math.sin(now / 170) * 1.2}px)`;
      }

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
      <span className="absolute top-0 left-1 text-[9px] font-mono text-neutral-600 group-hover:text-fuchsia-400 transition-colors">
        click to play
      </span>

      {/* ground line */}
      <div className="absolute bottom-1.5 left-0 right-0 border-b border-dashed border-purple-500/25" />

      <span ref={walkerRef} className="absolute bottom-[7px] left-0 text-[12px] opacity-60 select-none" style={{ transform: "translateX(-30px)" }}>
        🦕
      </span>
      <span ref={c1Ref} className="absolute bottom-[6px] left-0 text-[14px] select-none" style={{ transform: "translateX(400px)" }}>
        🌵
      </span>
      <span ref={c2Ref} className="absolute bottom-[6px] left-0 text-[13px] select-none" style={{ transform: "translateX(700px)" }}>
        🌵
      </span>
      <span ref={dinoRef} className="absolute bottom-[6px] left-0 text-[17px] select-none" style={{ transform: "translateX(160px) scaleX(-1)" }}>
        🦖
      </span>
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
      <DinoRunner />
      <PlayMeButton />
    </div>
  );
}
