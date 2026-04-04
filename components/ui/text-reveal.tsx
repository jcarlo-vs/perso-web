"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  once?: boolean;
  as?: "h1" | "h2" | "h3" | "p" | "span";
}

export function TextReveal({ text, className, delay = 0, once = true, as: Tag = "span" }: TextRevealProps) {
  const words = text.split(" ");

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: delay },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
    },
  };

  return (
    <motion.span
      className={cn("inline-flex flex-wrap", className)}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.5 }}
    >
      {words.map((word, index) => (
        <motion.span
          variants={child}
          key={index}
          className="mr-[0.25em] inline-block"
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}

interface LetterRevealProps {
  text: string;
  className?: string;
  delay?: number;
  once?: boolean;
}

export function LetterReveal({ text, className, delay = 0, once = true }: LetterRevealProps) {
  const letters = text.split("");

  return (
    <motion.span
      className={cn("inline-flex", className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.5 }}
    >
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.4,
                delay: delay + index * 0.03,
                ease: [0.25, 0.1, 0.25, 1],
              },
            },
          }}
          className="inline-block"
          style={{ whiteSpace: letter === " " ? "pre" : "normal" }}
        >
          {letter}
        </motion.span>
      ))}
    </motion.span>
  );
}
