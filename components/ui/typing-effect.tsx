"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TypingEffectProps {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
  showCursor?: boolean;
}

export function TypingEffect({
  text,
  className,
  speed = 50,
  delay = 0,
  showCursor = true,
}: TypingEffectProps) {
  const [displayText, setDisplayText] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const delayTimer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(delayTimer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;

    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayText(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed, started]);

  return (
    <span className={cn("inline-flex items-center", className)}>
      <span>{displayText}</span>
      {showCursor && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
          className="inline-block w-[2px] h-[1em] bg-neutral-400 ml-0.5"
        />
      )}
    </span>
  );
}
