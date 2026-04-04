"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface ProfileCardProps {
  src: string;
  alt: string;
}

export function ProfileCard({ src, alt }: ProfileCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glareX, setGlareX] = useState(50);
  const [glareY, setGlareY] = useState(50);
  const [hovering, setHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    setRotateX((y - centerY) / 8);
    setRotateY((centerX - x) / 8);
    setGlareX((x / rect.width) * 100);
    setGlareY((y / rect.height) * 100);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setHovering(false);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 600 }}
      className="shrink-0"
    >
      <motion.div
        animate={{ rotateX, rotateY }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        className="relative w-28 h-28 rounded-2xl border border-purple-500/30 bg-neutral-900/50 backdrop-blur-sm cursor-pointer p-2"
      >
        <div className="relative w-full h-full rounded-xl overflow-hidden">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover object-top"
          priority
        />
        </div>

        {/* Glare */}
        <div
          className="absolute inset-0 transition-opacity duration-300 pointer-events-none"
          style={{
            opacity: hovering ? 1 : 0,
            background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(168,85,247,0.25) 0%, transparent 60%)`,
          }}
        />

        {/* Border glow on hover */}
        <div
          className="absolute inset-0 rounded-2xl transition-opacity duration-300 pointer-events-none"
          style={{
            opacity: hovering ? 1 : 0,
            boxShadow: "0 0 20px 2px rgba(168,85,247,0.2), inset 0 0 20px 2px rgba(168,85,247,0.05)",
          }}
        />
      </motion.div>
    </motion.div>
  );
}
