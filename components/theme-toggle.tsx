"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);
  const [isPulling, setIsPulling] = useState(false);
  const [nudged, setNudged] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const chainY = useMotionValue(0);
  const startY = useRef(0);

  // Chain stretches as you pull
  // Chain stretches with pull — bead stays at the end
  const chainLength = useTransform(chainY, [0, 25], [20, 45]);

  // Show tooltip after page load, stays until first pull
  useEffect(() => {
    const timer = setTimeout(() => {
      setNudged(true);
      setTooltipVisible(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    setIsPulling(true);
    startY.current = e.clientY;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  // Attach move/up to window so dragging outside the bead still works
  useEffect(() => {
    if (!isPulling) return;

    const onMove = (e: PointerEvent) => {
      const delta = Math.max(0, Math.min(25, e.clientY - startY.current));
      chainY.set(delta);
    };

    const onUp = () => {
      setIsPulling(false);
      const pulled = chainY.get();

      if (pulled > 15) {
        const next = !isDark;
        setIsDark(next);
        if (next) {
          document.documentElement.classList.remove("light-mode");
        } else {
          document.documentElement.classList.add("light-mode");
        }
      }

      animate(chainY, 0, {
        type: "spring",
        stiffness: 500,
        damping: 15,
        mass: 0.5,
      });
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [isPulling, isDark, chainY]);

  return (
    <div className="relative flex flex-col items-center select-none" style={{ width: 32, height: 72 }}>
      {/* Bulb */}
      <div className="relative z-10">
        {/* Bulb glow — only when light mode (on) */}
        {!isDark && (
          <>
            <div
              className="absolute -inset-3 rounded-full blur-lg pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(250,204,21,0.5) 0%, transparent 70%)" }}
            />
            <div
              className="absolute -inset-1.5 rounded-full blur-md pointer-events-none opacity-60"
              style={{ background: "radial-gradient(circle, rgba(250,204,21,0.3) 0%, transparent 70%)" }}
            />
          </>
        )}

        {/* Bulb body */}
        <svg width="24" height="28" viewBox="0 0 24 28" fill="none" className="relative z-10">
          {/* Socket */}
          <rect x="8" y="0" width="8" height="4" rx="1" fill="#525252" />
          <rect x="8.5" y="1" width="7" height="0.8" rx="0.4" fill="#636363" />
          <rect x="8.5" y="2.5" width="7" height="0.8" rx="0.4" fill="#636363" />

          {/* Glass bulb */}
          <path
            d="M12 4C7.5 4 4 8 4 12.5C4 16 6 18.5 8 20C9 20.8 9.5 22 9.5 23H14.5C14.5 22 15 20.8 16 20C18 18.5 20 16 20 12.5C20 8 16.5 4 12 4Z"
            fill={isDark ? "#2a2a2a" : "#fde047"}
            stroke={isDark ? "#404040" : "#eab308"}
            strokeWidth="0.5"
          />

          {/* Filament */}
          <path
            d="M10 14C10.5 12 11 13 11.5 11.5C12 13 12.5 12 13 14"
            stroke={isDark ? "#555" : "#f59e0b"}
            strokeWidth="0.8"
            fill="none"
            opacity={isDark ? 0.3 : 1}
          />

          {/* Bottom cap */}
          <rect x="9" y="23" width="6" height="2" rx="0.5" fill="#525252" />
          <rect x="9.5" y="25" width="5" height="1.5" rx="0.5" fill="#474747" />
        </svg>
      </div>

      {/* Chain/string — swings like a pendulum */}
      <motion.div
        className="relative z-10 flex flex-col items-center origin-top"
        animate={isPulling || !nudged ? {} : { rotate: [0, 3, -2, 2.5, -1.5, 1, 0] }}
        transition={isPulling || !nudged ? {} : {
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Chain line */}
        <motion.div
          className="w-[1px] bg-gradient-to-b from-neutral-500 to-neutral-600"
          style={{ height: chainLength }}
        />

        {/* Pull bead + tooltip */}
        <div className="relative">
          <motion.div
            onPointerDown={(e) => { setTooltipVisible(false); onPointerDown(e); }}
            className="w-3 h-3 rounded-full bg-neutral-400 border border-neutral-500 shadow-sm cursor-grab active:cursor-grabbing touch-none hover:bg-neutral-300 transition-colors"
          />

          {/* Price tag — points left toward the bead */}
          {tooltipVisible && (
            <motion.div
              initial={{ opacity: 0, rotate: -5 }}
              animate={{ opacity: 1, rotate: 3 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute left-full top-1/2 -translate-y-1/2 ml-1 pointer-events-none"
            >
              <div className="relative bg-[#f5f0e8] pl-4 pr-3 py-1 rounded-sm shadow-md" style={{ clipPath: "polygon(0% 50%, 8px 0%, 100% 0%, 100% 100%, 8px 100%)" }}>
                {/* Hole */}
                <div className="absolute left-[4px] top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-neutral-400/50" />

                <span className="text-[8px] font-semibold text-neutral-700 tracking-[0.15em] uppercase font-mono whitespace-nowrap">
                  pull me
                </span>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
