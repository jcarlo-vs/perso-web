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

  return <span ref={ref}>{count}{suffix}</span>;
}

export function AboutSection() {
  return (
    <section id="about" className="relative py-32 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Label */}
        <Reveal variant="fade-up">
          <p className="text-xs tracking-[0.3em] text-purple-400/80 font-mono mb-6 uppercase">
            About
          </p>
        </Reveal>

        {/* Big heading — left aligned */}
        <Reveal variant="fade-up" delay={0.1}>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight max-w-3xl mb-16">
            <span className="text-white/90">{aboutContent.heading}</span>{" "}
            <span className="text-purple-400">{aboutContent.highlight}</span>
          </h2>
        </Reveal>

        {/* Two column: text left, code right */}
        <div className="grid md:grid-cols-2 gap-16">
          {/* Left */}
          <div>
            {aboutContent.paragraphs.map((paragraph, index) => (
              <Reveal key={index} variant="fade-up" delay={0.2 + index * 0.1}>
                <p className="text-base text-slate-400 leading-relaxed mb-6">
                  {paragraph}
                </p>
              </Reveal>
            ))}

            {/* Stats — inline row */}
            <Reveal variant="fade-up" delay={0.4}>
              <div className="flex gap-10 mt-8 pt-8 border-t border-white/6">
                {stats.map((stat, index) => (
                  <div key={index}>
                    <div className="text-3xl font-bold text-white">
                      <CountUp end={stat.value} suffix={stat.suffix} />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 font-mono tracking-wide">{stat.label}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Right — code editor */}
          <div>
            <Reveal variant="fade-up" delay={0.3}>
              <div className="rounded-2xl border border-white/8 bg-[#1e1e1e] overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/6 bg-[#252526]">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                  <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                  <span className="ml-2 text-xs text-[#969696] font-mono">developer.tsx</span>
                </div>
                <div className="p-5 font-mono text-sm leading-7">
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
                  <div><span className="text-[#da70d6]">{"}"}</span></div>
                </div>
              </div>
            </Reveal>

            {/* Approach */}
            <Reveal variant="fade-up" delay={0.5}>
              <div className="mt-4 p-6 rounded-2xl border border-white/6 bg-white/2">
                <h3 className="text-sm font-semibold text-white mb-2 font-mono">
                  {aboutContent.technicalVision.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {aboutContent.technicalVision.description}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
