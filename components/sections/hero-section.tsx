"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ParticleBackground } from "@/components/ui/particle-background";
import { LetterReveal } from "@/components/ui/text-reveal";
import { TypingEffect } from "@/components/ui/typing-effect";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { personalInfo } from "@/lib/portfolio-data";
import { FaGithub, FaLinkedinIn } from "react-icons/fa6";
import { HiArrowDown } from "react-icons/hi";

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const textY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const orb1Y = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const orb2Y = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const orb3Y = useTransform(scrollYProgress, [0, 1], [0, -300]);

  const scrollToAbout = () => {
    const aboutSection = document.getElementById("about");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Particle Background */}
      <div className="absolute inset-0 z-0">
        <ParticleBackground />
      </div>

      {/* Gradient Orbs - Parallax Layers */}
      <motion.div
        className="absolute top-1/4 -left-32 w-125 h-125 rounded-full opacity-20 blur-[100px] pointer-events-none"
        style={{ y: orb1Y, background: "radial-gradient(circle, #7e22ce 0%, transparent 70%)" }}
      />
      <motion.div
        className="absolute bottom-1/4 -right-32 w-100 h-100 rounded-full opacity-15 blur-[100px] pointer-events-none"
        style={{ y: orb2Y, background: "radial-gradient(circle, #9333ea 0%, transparent 70%)" }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 w-75 h-75 rounded-full opacity-10 blur-[80px] pointer-events-none"
        style={{ y: orb3Y, background: "radial-gradient(circle, #9333ea 0%, transparent 70%)" }}
      />

      {/* Content */}
      <motion.div
        style={{ y: textY, opacity }}
        className="relative z-10 max-w-5xl mx-auto px-6 text-center"
      >
        {/* Greeting */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-sm md:text-base tracking-[0.3em] text-purple-400/80 font-mono mb-6 uppercase"
        >
          Full Stack Developer
        </motion.p>

        {/* Name - Letter by letter reveal */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold mb-6 tracking-tight">
          <LetterReveal
            text="Hi, I'm"
            className="text-white/90 font-extralight"
            delay={0.3}
          />
          <br />
          <LetterReveal
            text="Juan Carlo"
            className="bg-linear-to-r from-white via-purple-200 to-white bg-clip-text text-transparent"
            delay={0.6}
          />
        </h1>

        {/* Tagline - Typing effect */}
        <div className="h-8 md:h-10 mb-8">
          <TypingEffect
            text={personalInfo.tagline}
            className="text-lg md:text-xl lg:text-2xl text-slate-400 font-mono"
            delay={1400}
            speed={40}
          />
        </div>

        {/* Focus Statement */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 2.5 }}
          className="text-base md:text-lg text-slate-500 max-w-2xl mx-auto mb-12"
        >
          {personalInfo.subtitle}
        </motion.p>

        {/* CTA + Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          {/* CTA Button */}
          <MagneticButton>
            <button
              type="button"
              onClick={scrollToAbout}
              className="group relative px-8 py-4 rounded-full font-medium text-sm tracking-wide overflow-hidden"
              data-cursor-hover
            >
              {/* Animated gradient border */}
              <span className="absolute inset-0 rounded-full p-[1px] bg-gradient-to-r from-purple-500/40 via-purple-400/20 to-purple-500/40">
                <span className="absolute inset-[1px] rounded-full bg-black" />
              </span>
              <span className="relative z-10 flex items-center gap-2 text-white/80 group-hover:text-white transition-colors">
                View My Work
                <HiArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              </span>
            </button>
          </MagneticButton>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {[
              { href: personalInfo.social.github, icon: FaGithub, label: "GitHub" },
              { href: personalInfo.social.linkedin, icon: FaLinkedinIn, label: "LinkedIn" },
            ].map((social) => (
              <MagneticButton key={social.label} strength={0.4}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 text-slate-400 hover:text-white hover:border-purple-400/40 hover:bg-purple-500/10 transition-all duration-300"
                  aria-label={social.label}
                  data-cursor-hover
                >
                  <social.icon className="w-4 h-4" />
                </a>
              </MagneticButton>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 3.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-3 cursor-pointer"
          onClick={scrollToAbout}
        >
          <span className="text-[10px] text-slate-600 tracking-[0.3em] font-mono">
            SCROLL
          </span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-purple-400/40 to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  );
}
