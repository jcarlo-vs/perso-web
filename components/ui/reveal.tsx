"use client";

import { motion, type TargetAndTransition } from "framer-motion";
import { cn } from "@/lib/utils";

type RevealVariant = "fade-up" | "fade-down" | "fade-left" | "fade-right" | "blur-in" | "scale-in";

interface RevealProps {
  children: React.ReactNode;
  variant?: RevealVariant;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
}

const variants: Record<RevealVariant, { initial: TargetAndTransition; animate: TargetAndTransition }> = {
  "fade-up": {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
  },
  "fade-down": {
    initial: { opacity: 0, y: -40 },
    animate: { opacity: 1, y: 0 },
  },
  "fade-left": {
    initial: { opacity: 0, x: -40 },
    animate: { opacity: 1, x: 0 },
  },
  "fade-right": {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
  },
  "blur-in": {
    initial: { opacity: 0, filter: "blur(10px)" },
    animate: { opacity: 1, filter: "blur(0px)" },
  },
  "scale-in": {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
  },
};

export function Reveal({
  children,
  variant = "fade-up",
  delay = 0,
  duration = 0.6,
  className,
  once = true,
}: RevealProps) {
  const v = variants[variant];

  return (
    <motion.div
      initial={v.initial}
      whileInView={v.animate}
      viewport={{ once, amount: 0.3 }}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
