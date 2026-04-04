"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { FaGithub, FaLinkedinIn } from "react-icons/fa6";
import { HiOutlineEnvelope } from "react-icons/hi2";
import { EmailModal } from "@/components/email-modal";

interface HeaderAnimationsProps {
  name: string;
  title: string;
  email: string;
  linkedin: string;
  github: string;
}

export function HeaderAnimations({ name, title, email, linkedin, github }: HeaderAnimationsProps) {
  const letters = name.split("");
  const [typedTitle, setTypedTitle] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const startDelay = setTimeout(() => {
      let i = 0;
      const timer = setInterval(() => {
        if (i < title.length) {
          setTypedTitle(title.slice(0, i + 1));
          i++;
        } else {
          clearInterval(timer);
          setTimeout(() => setShowCursor(false), 2000);
        }
      }, 60);
      return () => clearInterval(timer);
    }, 900);

    return () => clearTimeout(startDelay);
  }, [title]);

  const closeModal = useCallback(() => setModalOpen(false), []);

  return (
    <>
      {/* Name — letter by letter reveal */}
      <h1 className="text-2xl font-bold tracking-tight">
        {letters.map((letter, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              delay: i * 0.04,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className="inline-block text-white"
            style={{ whiteSpace: letter === " " ? "pre" : "normal" }}
          >
            {letter}
          </motion.span>
        ))}
      </h1>

      {/* Title — typing effect */}
      <p className="text-sm text-purple-400 mt-1 font-mono h-5 flex items-center">
        <span>{typedTitle}</span>
        {showCursor && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
            className="inline-block w-[2px] h-[14px] bg-purple-400 ml-0.5"
          />
        )}
      </p>

      {/* Social + CTA */}
      <div className="flex flex-wrap items-center gap-3 mt-4">
        {/* Available badge */}
        <span className="inline-flex items-center gap-1.5 text-[10px] text-emerald-400">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          Open to work
        </span>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/15 border border-purple-500/30 text-xs text-purple-300 hover:text-white hover:bg-purple-500/25 hover:border-purple-400/50 transition-colors cursor-pointer"
        >
          <HiOutlineEnvelope className="w-3 h-3" />
          Send Email
        </button>
        <Link
          href={linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-xs text-neutral-400 hover:text-white hover:border-purple-500/30 transition-colors"
        >
          <FaLinkedinIn className="w-3 h-3" />
          LinkedIn
        </Link>
        <Link
          href={github}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-xs text-neutral-400 hover:text-white hover:border-purple-500/30 transition-colors"
        >
          <FaGithub className="w-3 h-3" />
          GitHub
        </Link>
      </div>

      {/* Email Modal */}
      <EmailModal isOpen={modalOpen} onClose={closeModal} />
    </>
  );
}
