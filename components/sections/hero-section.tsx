"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { TypingEffect } from "@/components/ui/typing-effect";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { personalInfo } from "@/lib/portfolio-data";
import { FaGithub, FaLinkedinIn } from "react-icons/fa6";

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -80]);

  const scrollToAbout = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Subtle ambient glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Content */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 max-w-7xl w-full mx-auto px-6 md:px-12"
      >
        {/* Role tag */}
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xs tracking-[0.3em] text-purple-400/80 font-mono mb-6 uppercase"
        >
          Full Stack Developer
        </motion.p>

        {/* Name — massive, left-aligned */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-[clamp(3rem,10vw,8rem)] font-bold leading-[0.95] tracking-tighter mb-8"
        >
          <span className="text-white block">Juan Carlo</span>
          <span className="text-purple-400 block">Senin</span>
        </motion.h1>

        {/* Tagline */}
        <div className="mb-6 max-w-xl">
          <TypingEffect
            text={personalInfo.tagline}
            className="text-base md:text-lg text-slate-500 font-mono"
            delay={1200}
            speed={40}
          />
        </div>

        {/* Bottom row: subtitle + social */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2.2 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-8 mt-12"
        >
          <p className="text-sm text-slate-600 max-w-sm leading-relaxed">
            {personalInfo.subtitle}
          </p>

          <div className="flex items-center gap-3">
            {[
              { href: personalInfo.social.github, icon: FaGithub, label: "GitHub" },
              { href: personalInfo.social.linkedin, icon: FaLinkedinIn, label: "LinkedIn" },
            ].map((social) => (
              <MagneticButton key={social.label} strength={0.4}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 text-slate-500 hover:text-white hover:border-purple-400/30 transition-all duration-300"
                  aria-label={social.label}
                  data-cursor-hover
                >
                  <social.icon className="w-4 h-4" />
                </a>
              </MagneticButton>
            ))}

            <MagneticButton>
              <button
                type="button"
                onClick={scrollToAbout}
                className="ml-2 px-5 py-2.5 rounded-full border border-white/10 text-sm text-slate-400 hover:text-white hover:border-purple-400/30 transition-all duration-300 font-mono tracking-wide"
                data-cursor-hover
              >
                Scroll ↓
              </button>
            </MagneticButton>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
