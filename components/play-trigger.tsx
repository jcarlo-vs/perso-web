"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gamepad2 } from "lucide-react";

/**
 * Floating, attention-seeking launcher for the typing game.
 * Sits bottom-left (opposite the Ask my AI launcher), gently bobs, and pulses
 * a ring so it reads as "click me".
 */
export function PlayTrigger() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShown(true), 1400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="fixed bottom-5 left-5 z-40 print:hidden">
      <AnimatePresence>
        {shown && (
          <motion.button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("typing-game:open"))}
            aria-label="Play the typing game"
            initial={{ opacity: 0, scale: 0.6, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: [0, -5, 0] }}
            transition={{
              opacity: { duration: 0.3 },
              scale: { type: "spring", stiffness: 260, damping: 18 },
              y: { duration: 2.4, repeat: Infinity, ease: "easeInOut" },
            }}
            whileHover={{ scale: 1.06, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="group relative inline-flex items-center gap-2 rounded-full border border-purple-500/35 pl-3.5 pr-4 py-2.5 cursor-pointer"
            style={{
              background: "linear-gradient(135deg, rgba(124,58,237,0.22) 0%, rgba(20,14,32,0.9) 100%)",
              backdropFilter: "blur(12px)",
              boxShadow: "0 6px 24px rgba(124,58,237,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
            }}
          >
            {/* Pulsing rings */}
            <span className="absolute inset-0 rounded-full border border-purple-400/40 animate-ping-slow pointer-events-none" />

            <motion.span
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              className="relative text-purple-300 group-hover:text-purple-200"
            >
              <Gamepad2 className="w-4 h-4" />
            </motion.span>
            <span className="relative text-[13px] font-medium text-white/90 group-hover:text-white font-mono">
              Play
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
