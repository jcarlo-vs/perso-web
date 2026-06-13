"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X } from "lucide-react";

const NUDGE_KEY = "ai-nudge-dismissed";

export function AiLauncher() {
  const [shown, setShown] = useState(false);
  const [nudge, setNudge] = useState(false);

  // Reveal the launcher shortly after load; show the one-time nudge a beat later
  useEffect(() => {
    const t1 = setTimeout(() => setShown(true), 1200);
    let t2: ReturnType<typeof setTimeout> | undefined;
    try {
      if (!localStorage.getItem(NUDGE_KEY)) {
        t2 = setTimeout(() => setNudge(true), 3200);
      }
    } catch {
      /* localStorage blocked - skip the nudge */
    }
    return () => {
      clearTimeout(t1);
      if (t2) clearTimeout(t2);
    };
  }, []);

  const dismissNudge = () => {
    setNudge(false);
    try {
      localStorage.setItem(NUDGE_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  const open = () => {
    dismissNudge();
    window.dispatchEvent(new CustomEvent("ai-terminal:open"));
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3 print:hidden">
      {/* One-time recruiter nudge */}
      <AnimatePresence>
        {shown && nudge && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="relative max-w-[230px] rounded-xl rounded-br-sm border border-purple-500/25 px-3.5 py-2.5 pr-7"
            style={{
              background: "linear-gradient(135deg, rgba(24,18,38,0.95) 0%, rgba(14,10,22,0.95) 100%)",
              backdropFilter: "blur(12px)",
              boxShadow: "0 8px 28px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)",
            }}
          >
            <button
              type="button"
              onClick={dismissNudge}
              title="Dismiss"
              className="absolute top-1.5 right-1.5 p-0.5 rounded text-neutral-500 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
            <p className="text-[12.5px] leading-snug text-neutral-200">
              Hiring or curious? <span className="text-purple-300">Ask my AI anything</span> about my work.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Launcher button */}
      <AnimatePresence>
        {shown && (
          <motion.button
            type="button"
            onClick={open}
            initial={{ opacity: 0, scale: 0.6, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            aria-label="Ask my AI about Juan Carlo"
            className="group relative inline-flex items-center gap-2 rounded-full border border-purple-500/35 pl-3.5 pr-4 py-2.5 cursor-pointer"
            style={{
              background: "linear-gradient(135deg, rgba(124,58,237,0.22) 0%, rgba(20,14,32,0.9) 100%)",
              backdropFilter: "blur(12px)",
              boxShadow: "0 6px 24px rgba(124,58,237,0.28), inset 0 1px 0 rgba(255,255,255,0.1)",
            }}
          >
            {/* Pulsing ring to draw the eye */}
            <span className="absolute inset-0 rounded-full border border-purple-400/40 animate-ping-slow pointer-events-none" />

            <motion.span
              animate={{ rotate: [0, 12, -8, 0], scale: [1, 1.15, 1] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              className="relative text-purple-300 group-hover:text-purple-200"
            >
              <Sparkles className="w-4 h-4" />
            </motion.span>
            <span className="relative text-[13px] font-medium text-white/90 group-hover:text-white font-mono">
              Ask my AI
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
