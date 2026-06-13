"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, useMotionValue, useTransform, animate, AnimatePresence } from "framer-motion";

type Flash = { x: number; y: number; toLight: boolean; id: number };

const SPARKS = [
  { dx: -18, dy: -14 }, { dx: 16, dy: -18 }, { dx: -22, dy: 6 },
  { dx: 22, dy: 2 }, { dx: -8, dy: -24 }, { dx: 8, dy: 20 },
];

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);
  const [isPulling, setIsPulling] = useState(false);
  const [nudged, setNudged] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [flash, setFlash] = useState<Flash | null>(null);
  const [toggleCount, setToggleCount] = useState(0);
  const [mounted, setMounted] = useState(false);
  const chainY = useMotionValue(0);
  const startY = useRef(0);
  const bulbRef = useRef<HTMLDivElement>(null);

  // Chain stretches with pull - links are revealed as it extends
  const chainLength = useTransform(chainY, [0, 25], [20, 45]);

  useEffect(() => setMounted(true), []);

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
        // Room-light flash radiating from the bulb
        const rect = bulbRef.current?.getBoundingClientRect();
        if (rect) {
          setFlash({
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
            toLight: !next, // next=false means light mode is turning ON
            id: Date.now(),
          });
        }
        setToggleCount((c) => c + 1);
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

  const lightOn = !isDark;

  return (
    <div className="relative flex flex-col items-center select-none" style={{ width: 32, height: 72 }}>
      {/* Full-page flash when the light switches - rendered in a portal so nothing clips it */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {flash && (
              <motion.div
                key={flash.id}
                className="fixed inset-0 z-[100] pointer-events-none"
                style={{
                  background: flash.toLight
                    ? `radial-gradient(circle at ${flash.x}px ${flash.y}px, rgba(255,243,196,0.95) 0%, rgba(253,224,71,0.4) 30%, transparent 65%)`
                    : `radial-gradient(circle at ${flash.x}px ${flash.y}px, rgba(46,16,86,0.95) 0%, rgba(15,8,30,0.55) 35%, transparent 70%)`,
                }}
                initial={{ clipPath: `circle(0px at ${flash.x}px ${flash.y}px)`, opacity: 1 }}
                animate={{ clipPath: `circle(160vmax at ${flash.x}px ${flash.y}px)`, opacity: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 0.8, 0.36, 1] }}
                onAnimationComplete={() => setFlash(null)}
              />
            )}
          </AnimatePresence>,
          document.body
        )}

      {/* Bulb - wobbles when the chain is released */}
      <motion.div
        ref={bulbRef}
        className="relative z-10"
        key={`wobble-${toggleCount}`}
        animate={toggleCount > 0 ? { rotate: [0, -7, 5, -3, 1.5, 0] } : {}}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        {/* Breathing glow - only when the light is on */}
        {lightOn && (
          <>
            <motion.div
              className="absolute -inset-4 rounded-full blur-lg pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(250,204,21,0.55) 0%, transparent 70%)" }}
              animate={{ opacity: [0.7, 1, 0.7], scale: [1, 1.08, 1] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute -inset-1.5 rounded-full blur-md pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(250,204,21,0.35) 0%, transparent 70%)" }}
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            />
          </>
        )}

        {/* Spark particles on switch-on */}
        {lightOn && (
          <div key={`sparks-${toggleCount}`} className="absolute inset-0 pointer-events-none">
            {SPARKS.map((s, i) => (
              <motion.span
                key={i}
                className="absolute left-1/2 top-1/2 w-[3px] h-[3px] rounded-full"
                style={{ background: "#fde047", boxShadow: "0 0 6px rgba(253,224,71,0.9)" }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{ x: s.dx, y: s.dy, opacity: 0, scale: 0.3 }}
                transition={{ duration: 0.55, delay: i * 0.03, ease: "easeOut" }}
              />
            ))}
          </div>
        )}

        {/* Bulb body */}
        <svg width="24" height="28" viewBox="0 0 24 28" fill="none" className="relative z-10">
          {/* Socket */}
          <rect x="8" y="0" width="8" height="4" rx="1" fill="#525252" />
          <rect x="8.5" y="1" width="7" height="0.8" rx="0.4" fill="#636363" />
          <rect x="8.5" y="2.5" width="7" height="0.8" rx="0.4" fill="#636363" />

          {/* Glass bulb */}
          <motion.path
            d="M12 4C7.5 4 4 8 4 12.5C4 16 6 18.5 8 20C9 20.8 9.5 22 9.5 23H14.5C14.5 22 15 20.8 16 20C18 18.5 20 16 20 12.5C20 8 16.5 4 12 4Z"
            animate={{
              fill: isDark ? "#2a2a2a" : "#fde047",
              stroke: isDark ? "#404040" : "#eab308",
            }}
            transition={{ duration: 0.35 }}
            strokeWidth="0.5"
          />

          {/* Glass highlight */}
          <path
            d="M8 8.5C8.5 6.8 10 5.6 11 5.4"
            stroke={isDark ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.65)"}
            strokeWidth="1.1"
            strokeLinecap="round"
            fill="none"
          />

          {/* Filament - flickers to life like a real incandescent */}
          <motion.path
            key={`filament-${toggleCount}`}
            d="M10 14C10.5 12 11 13 11.5 11.5C12 13 12.5 12 13 14"
            stroke={isDark ? "#555" : "#f59e0b"}
            strokeWidth="0.8"
            fill="none"
            animate={lightOn ? { opacity: [0, 1, 0.4, 1, 0.75, 1] } : { opacity: 0.3 }}
            transition={lightOn ? { duration: 0.6, ease: "easeOut" } : { duration: 0.3 }}
          />

          {/* Bottom cap */}
          <rect x="9" y="23" width="6" height="2" rx="0.5" fill="#525252" />
          <rect x="9.5" y="25" width="5" height="1.5" rx="0.5" fill="#474747" />
        </svg>
      </motion.div>

      {/* Ball chain - swings like a pendulum, links revealed as it stretches */}
      <motion.div
        className="relative z-10 flex flex-col items-center origin-top"
        animate={isPulling || !nudged ? {} : { rotate: [0, 3, -2, 2.5, -1.5, 1, 0] }}
        transition={isPulling || !nudged ? {} : {
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Chain of tiny ball links inside a stretching window */}
        <motion.div className="overflow-hidden flex justify-center" style={{ height: chainLength, width: 6 }}>
          <div className="flex flex-col items-center gap-[1.5px] pt-[1px]">
            {Array.from({ length: 14 }).map((_, i) => (
              <span
                key={i}
                className="w-[2.5px] h-[2.5px] rounded-full shrink-0"
                style={{
                  background: "linear-gradient(135deg, #8a8a8a, #5a5a5a)",
                  boxShadow: "inset 0 0.5px 0 rgba(255,255,255,0.4)",
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Pull bead + tooltip */}
        <div className="relative">
          <motion.div
            onPointerDown={(e) => { setTooltipVisible(false); onPointerDown(e); }}
            whileHover={{ scale: 1.25 }}
            className="w-3 h-3 rounded-full cursor-grab active:cursor-grabbing touch-none"
            style={{
              background: "radial-gradient(circle at 35% 30%, #d4d4d4, #737373 70%)",
              border: "1px solid #525252",
              boxShadow: "0 1px 3px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.35)",
            }}
            role="button"
            aria-label="Toggle light and dark mode"
          />

          {/* Price tag - points left toward the bead */}
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
