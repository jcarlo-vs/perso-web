"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const command = "print(skills)";

const output = [
  "",
  "→ frontend:  JavaScript · TypeScript · React · Next.js · Vue · Angular · Tailwind · Framer Motion",
  "",
  "→ backend:   Node.js · Express · NestJS · Laravel · MongoDB · PostgreSQL · MySQL · Redis · Firebase",
  "",
  "→ cloud:     Git · AWS · Docker · Cloudflare",
  "",
  "✓ 19 technologies loaded.",
];

export function TechImports() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [signalReceived, setSignalReceived] = useState(false);
  const [started, setStarted] = useState(false);
  const [typedCmd, setTypedCmd] = useState("");
  const [showOutput, setShowOutput] = useState(false);
  const [visibleLines, setVisibleLines] = useState(0);

  // Listen for the signal from the about terminal
  useEffect(() => {
    const handler = () => setSignalReceived(true);
    window.addEventListener("terminal:skills-ready", handler);
    return () => window.removeEventListener("terminal:skills-ready", handler);
  }, []);

  // Start only when BOTH in view and signal received
  useEffect(() => {
    if (signalReceived && isInView && !started) {
      setStarted(true);
    }
  }, [signalReceived, isInView, started]);

  // Type the command
  useEffect(() => {
    if (!started) return;
    let i = 0;
    const timer = setInterval(() => {
      if (i < command.length) {
        setTypedCmd(command.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
        setTimeout(() => setShowOutput(true), 300);
      }
    }, 50);
    return () => clearInterval(timer);
  }, [started]);

  // Reveal output lines one by one
  useEffect(() => {
    if (!showOutput) return;
    let i = 0;
    const timer = setInterval(() => {
      if (i < output.length) {
        setVisibleLines(i + 1);
        i++;
      } else {
        clearInterval(timer);
      }
    }, 120);
    return () => clearInterval(timer);
  }, [showOutput]);

  return (
    <div ref={ref}>
      <div className="font-mono text-[12px] leading-[1.8]">
        {/* Waiting state — blinking cursor */}
        {!started && (
          <div>
            <span className="text-purple-400">❯ </span>
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
              className="inline-block w-[7px] h-[14px] bg-purple-400/70 align-middle"
            />
          </div>
        )}

        {/* Command line */}
        {started && (
          <div>
            <span className="text-purple-400">❯ </span>
            <span className="text-neutral-300">{typedCmd}</span>
            {!showOutput && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
                className="inline-block w-[7px] h-[14px] bg-purple-400/70 ml-0.5 align-middle"
              />
            )}
          </div>
        )}

        {/* Output */}
        {output.slice(0, visibleLines).map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
          >
            {line === "" ? (
              <br />
            ) : line.startsWith("✓") ? (
              <span className="text-[#4ade80]">{line}</span>
            ) : (
              <>
                <span className="text-purple-400/60">{line.slice(0, 2)}</span>
                <span className="text-amber-300/80">{line.slice(2, line.indexOf(":") + 1)}</span>
                <span className="text-neutral-400">{line.slice(line.indexOf(":") + 1)}</span>
              </>
            )}
          </motion.div>
        ))}

        {/* Final cursor */}
        {visibleLines >= output.length && started && (
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

