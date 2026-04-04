"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronRight } from "lucide-react";

export function RevealWrapper({ children }: { children: React.ReactNode }) {
  const [lightMode, setLightMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [sweepDone, setSweepDone] = useState(false);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const x = useMotionValue(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Light overlay reveals from left as you drag right
  // inset(top right bottom left) — clip the right side to hide initially
  const lightClipPath = useTransform(x, (val) => {
    const w = typeof window !== "undefined" ? window.innerWidth : 1440;
    const right = Math.max(0, w - val);
    return `inset(0 ${right}px 0 0)`;
  });

  const glowOpacity = useTransform(x, [0, 300], [0.4, 1]);

  const snapOpen = useCallback(() => {
    const width = window.innerWidth;
    animate(x, width + 100, {
      type: "spring",
      stiffness: 150,
      damping: 20,
      onComplete: () => {
        setLightMode(true);
        setSweepDone(true);
      },
    });
  }, [x]);

  const snapBack = useCallback(() => {
    animate(x, 0, { type: "spring", stiffness: 400, damping: 35 });
  }, [x]);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      isDragging.current = true;
      startX.current = e.clientX - x.get();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [x]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging.current) return;
      const newX = Math.max(0, e.clientX - startX.current);
      x.set(newX);
    },
    [x]
  );

  const onPointerUp = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const currentX = x.get();
    const width = window.innerWidth;
    if (currentX > width * 0.3) {
      snapOpen();
    } else {
      snapBack();
    }
  }, [x, snapOpen, snapBack]);

  return (
    <div className={lightMode ? "light-mode" : ""}>
      {/* Page content — always rendered in dark, CSS filter flips to light */}
      {children}

      {/* Light sweep overlay + zipper — hidden once transition completes */}
      {mounted && !sweepDone && (
        <>
          {/* White sweep overlay — reveals from left to right */}
          <motion.div
            style={{ clipPath: lightClipPath }}
            className="fixed inset-0 z-[100] pointer-events-none bg-white"
          />

          {/* Zipper line + handle */}
          <motion.div
            style={{ x }}
            className="fixed top-0 bottom-0 left-0 z-[101] flex items-center"
          >
            {/* Purple glow line */}
            <motion.div
              style={{ opacity: glowOpacity }}
              className="absolute top-0 bottom-0 right-0 w-[2px]"
            >
              <div className="w-full h-full bg-purple-500 shadow-[0_0_20px_4px_rgba(168,85,247,0.4)]" />
            </motion.div>

            {/* Drag handle */}
            <div
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              className="relative z-10 cursor-grab active:cursor-grabbing touch-none select-none"
            >
              <div className="flex items-center justify-center w-11 h-20 rounded-r-2xl bg-purple-500/20 border border-l-0 border-purple-500/30 backdrop-blur-sm">
                <motion.div
                  animate={{ x: [0, 3, 0] }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <ChevronRight className="w-5 h-5 text-purple-400" />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}
