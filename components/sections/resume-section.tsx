"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Reveal } from "@/components/ui/reveal";
import { experience } from "@/lib/portfolio-data";
import { Briefcase, GraduationCap } from "lucide-react";

export function ResumeSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const lineHeight = useTransform(scrollYProgress, [0.1, 0.8], ["0%", "100%"]);

  return (
    <section ref={sectionRef} id="resume" className="relative py-24 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Section Label */}
        <Reveal variant="fade-up">
          <p className="text-xs tracking-[0.3em] text-neutral-500 font-mono mb-4 uppercase">
            Experience
          </p>
        </Reveal>

        <Reveal variant="fade-up" delay={0.1}>
          <h2 className="text-3xl md:text-4xl font-bold mb-12">
            <span className="text-white/90">Education & </span>
            <span className="text-neutral-400">Experience</span>
          </h2>
        </Reveal>

        {/* Compact Timeline */}
        <div className="relative">
          {/* Animated vertical line */}
          <div className="absolute left-[15px] top-0 bottom-0 w-px bg-white/6">
            <motion.div
              className="w-full bg-linear-to-b from-neutral-500 via-neutral-500/50 to-transparent origin-top"
              style={{ height: lineHeight }}
            />
          </div>

          <div className="space-y-6">
            {experience.map((item, index) => {
              const isEducation = item.title.includes("BS") || item.title.includes("Bachelor") || item.title.includes("Master");
              const Icon = isEducation ? GraduationCap : Briefcase;

              return (
                <Reveal key={index} variant="fade-up" delay={index * 0.1}>
                  <div className="relative flex items-center gap-4 pl-10">
                    {/* Timeline dot */}
                    <div className="absolute left-0 z-10">
                      <div className="flex items-center justify-center w-[30px] h-[30px] rounded-full bg-black border border-neutral-700">
                        <Icon className="w-3 h-3 text-neutral-400" />
                      </div>
                    </div>

                    {/* Content - single line */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 py-2">
                      <span className="text-[11px] font-mono text-neutral-600 whitespace-nowrap">
                        {item.period}
                      </span>
                      <span className="hidden sm:block text-neutral-700">—</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white/90">
                          {item.title}
                        </span>
                        <span className="text-xs text-neutral-600">
                          {item.company}
                        </span>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
