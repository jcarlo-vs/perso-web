"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

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
  { text: "Thrives in teams, delivers solo", prefix: "✓", prefixColor: "#4ade80", color: "#e4e4e7" },
  { text: "", prefix: "", prefixColor: "", color: "transparent" },
  { text: "mode: building something new", prefix: "⚡", prefixColor: "#facc15", color: "#a3a3a3" },
  { text: "", prefix: "", prefixColor: "", color: "transparent" },
  { text: "Ready. Listening on port 3000...", prefix: "", prefixColor: "", color: "#4ade80" },
];

const cdCommand = "cd ../jcvs/tech-stack";

export function CodeBlock() {
  const [started, setStarted] = useState(false);

  // Reveal output lines
  const [visibleLines, setVisibleLines] = useState(0);
  const [outputDone, setOutputDone] = useState(false);

  // Phase 3: type the cd command
  const [typedCd, setTypedCd] = useState("");
  const [showCd, setShowCd] = useState(false);
  const [cdDone, setCdDone] = useState(false);

  // Wait for title typing to finish, then start
  useEffect(() => {
    if ((window as any).__titleDone) {
      setStarted(true);
      return;
    }
    const handler = () => setStarted(true);
    window.addEventListener("terminal:title-done", handler);
    const fallback = setTimeout(() => setStarted(true), 4000);
    return () => {
      window.removeEventListener("terminal:title-done", handler);
      clearTimeout(fallback);
    };
  }, []);

  // Reveal output lines
  useEffect(() => {
    if (!started) return;
    let i = 0;
    const timer = setInterval(() => {
      if (i < lines.length) {
        setVisibleLines(i + 1);
        i++;
      } else {
        clearInterval(timer);
        setOutputDone(true);
        setTimeout(() => setShowCd(true), 800);
      }
    }, 100);
    return () => clearInterval(timer);
  }, [started]);

  // Phase 3: type cd command
  useEffect(() => {
    if (!showCd) return;
    let i = 0;
    const timer = setInterval(() => {
      if (i < cdCommand.length) {
        setTypedCd(cdCommand.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
        setTimeout(() => {
          setCdDone(true);
          (window as any).__skillsReady = true;
          window.dispatchEvent(new CustomEvent("terminal:skills-ready"));
        }, 400);
      }
    }, 30);
    return () => clearInterval(timer);
  }, [showCd]);

  return (
    <div className="rounded-xl border border-white/8 bg-[#0d0d0d] overflow-hidden">
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
        {/* Output lines */}
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
            <span className="text-neutral-300">{typedCd}</span>
            {!cdDone && (
              <span className="inline-block w-[7px] h-[14px] bg-purple-400/70 ml-0.5 align-middle" />
            )}
          </div>
        )}

        {/* Idle cursor between output done and cd start */}
        {outputDone && !showCd && (
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
