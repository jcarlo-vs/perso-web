"use client";

import { motion } from "framer-motion";

const CYCLE = 2.6; // seconds: cactus scroll + dino jump are synced to this

function openGame() {
  window.dispatchEvent(new CustomEvent("typing-game:open"));
}

/** A tiny Chrome-dino scene: a T-rex runs in place and hops a scrolling cactus,
 *  while a second dino strolls by. The whole strip opens the game on click. */
function DinoRunner() {
  return (
    <button
      type="button"
      onClick={openGame}
      aria-label="Play the typing game"
      title="Play the typing game"
      className="group relative flex-1 h-11 overflow-hidden cursor-pointer text-left"
    >
      <span className="absolute top-0 left-1 text-[9px] font-mono text-neutral-600 group-hover:text-fuchsia-400 transition-colors">
        click to play
      </span>

      {/* ground line */}
      <div className="absolute bottom-1.5 left-0 right-0 border-b border-dashed border-purple-500/25" />

      {/* slow background walker */}
      <motion.span
        className="absolute bottom-[7px] text-[12px] opacity-60 select-none"
        animate={{ left: ["-12%", "112%"], y: [0, -1.5, 0] }}
        transition={{
          left: { duration: 9, repeat: Infinity, ease: "linear" },
          y: { duration: 0.5, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        🦕
      </motion.span>

      {/* scrolling cactus */}
      <motion.span
        className="absolute bottom-[6px] text-[14px] select-none"
        initial={{ left: "100%" }}
        animate={{ left: ["100%", "-12%"] }}
        transition={{ duration: CYCLE, repeat: Infinity, ease: "linear" }}
      >
        🌵
      </motion.span>

      {/* running T-rex: outer = run bob, inner = jump synced to the cactus */}
      <motion.span
        className="absolute bottom-[6px] left-2 text-[17px] select-none"
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 0.26, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.span
          className="inline-block"
          animate={{ y: [0, 0, -22, -22, 0, 0] }}
          transition={{
            duration: CYCLE,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.78, 0.85, 0.88, 0.95, 1],
          }}
        >
          🦖
        </motion.span>
      </motion.span>
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
