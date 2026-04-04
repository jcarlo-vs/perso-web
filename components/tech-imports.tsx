"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const command = "pip install -r requirements.txt";

const output = [
  "",
  "Collecting frontend...",
  "  Installing: JavaScript, TypeScript, React, Next.js, Vue, Angular, Tailwind, Framer Motion",
  "",
  "Collecting backend...",
  "  Installing: Node.js, Express, NestJS, PHP (Laravel), Python (FastAPI), MongoDB, PostgreSQL, MySQL, Redis, Firebase",
  "",
  "Collecting devops...",
  "  Installing: Git, Docker, CI/CD, Cloudflare",
  "",
  "Collecting aws...",
  "  Installing: Fargate, RDS, ElastiCache, SQS, SNS, Lambda, S3, CloudWatch",
  "",
  "✓ Successfully installed 27 packages",
];

export function TechImports() {
  const [signalReceived, setSignalReceived] = useState(false);
  const [started, setStarted] = useState(false);
  const [typedCmd, setTypedCmd] = useState("");
  const [showOutput, setShowOutput] = useState(false);
  const [visibleLines, setVisibleLines] = useState(0);

  // Listen for the signal from the about terminal (also check if already fired)
  useEffect(() => {
    if ((window as any).__skillsReady) {
      setSignalReceived(true);
      return;
    }
    const handler = () => setSignalReceived(true);
    window.addEventListener("terminal:skills-ready", handler);
    return () => window.removeEventListener("terminal:skills-ready", handler);
  }, []);

  // Start only when signal received (no fallback — waits for cd command to finish)
  useEffect(() => {
    if (signalReceived) {
      setStarted(true);
    }
  }, [signalReceived]);

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
    }, 30);
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
    <div>
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
            ) : line.startsWith("Collecting") ? (
              <span className="text-amber-300/80">{line}</span>
            ) : line.startsWith("  Installing:") ? (
              <>
                <span className="text-neutral-600">{"  Installing: "}</span>
                <span className="text-neutral-300">{line.slice(14)}</span>
              </>
            ) : (
              <span className="text-neutral-400">{line}</span>
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

