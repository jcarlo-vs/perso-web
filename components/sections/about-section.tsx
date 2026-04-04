"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Reveal } from "@/components/ui/reveal";
import { aboutContent, stats } from "@/lib/portfolio-data";

function CountUp({ end, suffix = "", duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, end, duration]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

export function AboutSection() {
  return (
    <section id="about" className="relative py-32 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section Label */}
        <Reveal variant="fade-up">
          <p className="text-xs tracking-[0.3em] text-purple-400/80 font-mono mb-4 uppercase">
            About Me
          </p>
        </Reveal>

        {/* Heading */}
        <Reveal variant="fade-up" delay={0.1}>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            <span className="text-white/90">{aboutContent.heading}</span>
            <br />
            <span className="text-purple-400">
              {aboutContent.highlight}
            </span>
          </h2>
        </Reveal>

        {/* Two Column Layout */}
        <div className="grid md:grid-cols-2 gap-12 mt-12">
          {/* Left - Text */}
          <div className="space-y-6">
            {aboutContent.paragraphs.map((paragraph, index) => (
              <Reveal key={index} variant="fade-up" delay={0.2 + index * 0.1}>
                <p className="text-base md:text-lg text-slate-400 leading-relaxed">
                  {paragraph}
                </p>
              </Reveal>
            ))}

            {/* Approach */}
            <Reveal variant="fade-up" delay={0.4}>
              <div className="mt-8 p-6 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                <h3 className="text-lg font-semibold text-white mb-3 font-mono">
                  {aboutContent.technicalVision.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {aboutContent.technicalVision.description}
                </p>
              </div>
            </Reveal>
          </div>

          {/* Right - Code Editor + Stats */}
          <div className="space-y-8">
            {/* Code Editor Mockup */}
            <Reveal variant="fade-left" delay={0.3}>
              <div className="rounded-xl border border-white/[0.08] bg-[#1e1e1e] overflow-hidden">
                {/* Title bar */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-[#252526]">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                  <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                  <span className="ml-2 text-xs text-[#969696] font-mono">developer.tsx</span>
                </div>
                {/* Code - VS Code Dark+ theme colors */}
                <div className="p-4 font-mono text-xs md:text-sm leading-relaxed">
                  <div>
                    <span className="text-[#569cd6]">const</span>{" "}
                    <span className="text-[#4fc1ff]">developer</span>{" "}
                    <span className="text-[#d4d4d4]">=</span>{" "}
                    <span className="text-[#da70d6]">{"{"}</span>
                  </div>
                  <div className="pl-4">
                    <span className="text-[#9cdcfe]">name</span>
                    <span className="text-[#d4d4d4]">:</span>{" "}
                    <span className="text-[#ce9178]">&quot;Juan Carlo&quot;</span>
                    <span className="text-[#d4d4d4]">,</span>
                  </div>
                  <div className="pl-4">
                    <span className="text-[#9cdcfe]">role</span>
                    <span className="text-[#d4d4d4]">:</span>{" "}
                    <span className="text-[#ce9178]">&quot;Full Stack Developer&quot;</span>
                    <span className="text-[#d4d4d4]">,</span>
                  </div>
                  <div className="pl-4">
                    <span className="text-[#9cdcfe]">passion</span>
                    <span className="text-[#d4d4d4]">:</span>{" "}
                    <span className="text-[#ce9178]">&quot;Building products&quot;</span>
                    <span className="text-[#d4d4d4]">,</span>
                  </div>
                  <div className="pl-4">
                    <span className="text-[#9cdcfe]">motto</span>
                    <span className="text-[#d4d4d4]">:</span>{" "}
                    <span className="text-[#ce9178]">&quot;Ship. Iterate. Dominate.&quot;</span>
                    <span className="text-[#d4d4d4]">,</span>
                  </div>
                  <div>
                    <span className="text-[#da70d6]">{"}"}</span>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Stats */}
            <Reveal variant="fade-up" delay={0.5}>
              <div className="grid grid-cols-3 gap-4">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="text-center p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]"
                  >
                    <div className="text-2xl md:text-3xl font-bold text-white">
                      <CountUp end={stat.value} suffix={stat.suffix} />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Motto */}
            <Reveal variant="fade-up" delay={0.6}>
              <div className="flex flex-wrap gap-4 items-center justify-center">
                {aboutContent.motto.map((word, index) => (
                  <span
                    key={index}
                    className={`text-2xl md:text-3xl font-bold font-mono ${
                      index % 2 === 0
                        ? "text-white/80"
                        : "text-white/50"
                    }`}
                  >
                    {word}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
