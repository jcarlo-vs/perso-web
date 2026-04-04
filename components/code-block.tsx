"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

interface TermLine {
  text: string;
  prefix: string;
  prefixColor: string;
  color: string;
}

const lines: TermLine[] = [
  { text: "running jcsenin@latest...", prefix: ">", prefixColor: "#c084fc", color: "#a3a3a3" },
  { text: "", prefix: "", prefixColor: "", color: "transparent" },
  { text: "4+ years building for the web", prefix: "✓", prefixColor: "#4ade80", color: "#e4e4e7" },
  { text: "20+ projects shipped to production", prefix: "✓", prefixColor: "#4ade80", color: "#e4e4e7" },
  { text: "15+ technologies in the toolbox", prefix: "✓", prefixColor: "#4ade80", color: "#e4e4e7" },
  { text: "Turned independent — never looked back", prefix: "✓", prefixColor: "#4ade80", color: "#e4e4e7" },
  { text: "", prefix: "", prefixColor: "", color: "transparent" },
  { text: 'focus: "ship fast, iterate faster"', prefix: "⚡", prefixColor: "#facc15", color: "#a3a3a3" },
  { text: "", prefix: "", prefixColor: "", color: "transparent" },
  { text: "Ready. Listening on port 3000...", prefix: "", prefixColor: "", color: "#4ade80" },
];

const cdCommand = "cd ../jcvs/tech-stack";

export function CodeBlock() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });
  const [visibleLines, setVisibleLines] = useState(0);
  const [typedCmd, setTypedCmd] = useState("");
  const [showCd, setShowCd] = useState(false);
  const [cdDone, setCdDone] = useState(false);

  // Reveal output lines one by one
  useEffect(() => {
    if (!isInView) return;
    let i = 0;
    const timer = setInterval(() => {
      if (i < lines.length) {
        setVisibleLines(i + 1);
        i++;
      } else {
        clearInterval(timer);
        // Pause, then start typing cd command
        setTimeout(() => setShowCd(true), 800);
      }
    }, 100);
    return () => clearInterval(timer);
  }, [isInView]);

  // Type the cd command
  useEffect(() => {
    if (!showCd) return;
    let i = 0;
    const timer = setInterval(() => {
      if (i < cdCommand.length) {
        setTypedCmd(cdCommand.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
        // "Execute" the command
        setTimeout(() => {
          setCdDone(true);
          // Signal the tech terminal to start
          window.dispatchEvent(new CustomEvent("terminal:skills-ready"));
        }, 400);
      }
    }, 50);
    return () => clearInterval(timer);
  }, [showCd]);

  return (
    <div ref={ref} className="rounded-xl border border-white/8 bg-[#0d0d0d] overflow-hidden">
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/6 bg-[#111]">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]/80" />
        </div>
        <span className="ml-2 text-[11px] text-neutral-600 font-mono">terminal</span>
      </div>

      {/* Terminal output */}
      <div className="p-4 font-mono text-[12px] leading-[1.8]">
        {lines.slice(0, visibleLines).map((line, i) => (
          <div key={i}>
            {line.prefix && (
              <span style={{ color: line.prefixColor }} className="mr-2">
                {line.prefix}
              </span>
            )}
            <span style={{ color: line.color }}>{line.text}</span>
          </div>
        ))}

        {/* cd command — types after output finishes */}
        {showCd && (
          <div className="mt-1">
            <span className="text-purple-400">❯ </span>
            <span className="text-neutral-300">{typedCmd}</span>
            {!cdDone && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
                className="inline-block w-[7px] h-[14px] bg-purple-400/70 ml-0.5 align-middle"
              />
            )}
          </div>
        )}

        {/* Idle cursor before cd starts */}
        {visibleLines >= lines.length && !showCd && (
          <div className="mt-1">
            <span className="text-purple-400">❯ </span>
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
              className="inline-block w-[7px] h-[14px] bg-purple-400/70 align-middle"
            />
          </div>
        )}
      </div>
    </div>
  );
}
