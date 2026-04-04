"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Reveal } from "@/components/ui/reveal";
import { experience } from "@/lib/portfolio-data";
import { MapPin, Briefcase, GraduationCap } from "lucide-react";

export function ResumeSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const lineHeight = useTransform(scrollYProgress, [0.05, 0.85], ["0%", "100%"]);

  return (
    <section ref={sectionRef} id="resume" className="relative py-32 px-6 md:px-12">
      <div className="max-w-5xl mx-auto">
        {/* Label */}
        <Reveal variant="fade-up">
          <p className="text-xs tracking-[0.3em] text-purple-400/80 font-mono mb-6 uppercase text-center">
            Experience
          </p>
        </Reveal>

        <Reveal variant="fade-up" delay={0.1}>
          <h2 className="text-3xl md:text-5xl font-bold mb-20 text-center">
            <span className="text-white/90">Where I&apos;ve </span>
            <span className="text-purple-400">worked</span>
          </h2>
        </Reveal>

        {/* Timeline — center line, alternating sides */}
        <div className="relative">
          {/* Center track line */}
          <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-px bg-white/6">
            <motion.div
              className="w-full bg-gradient-to-b from-purple-500 via-purple-400 to-purple-500/0 origin-top"
              style={{ height: lineHeight }}
            />
            {/* Glow dot at tip */}
            <motion.div
              className="absolute left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-purple-400 shadow-[0_0_14px_rgba(168,85,247,0.7)]"
              style={{ top: lineHeight }}
            />
          </div>

          {/* Items */}
          <div className="space-y-12 md:space-y-16">
            {experience.map((item, index) => {
              const isEducation =
                item.title.includes("Bachelor") ||
                item.title.includes("Master") ||
                item.title.includes("Degree");
              const Icon = isEducation ? GraduationCap : Briefcase;
              const isLeft = index % 2 === 0;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50, x: isLeft ? -30 : 30 }}
                  whileInView={{ opacity: 1, y: 0, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                  className={`relative flex items-start gap-0 ${
                    isLeft ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Center dot */}
                  <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 z-10">
                    <div className="flex items-center justify-center w-9 h-9 rounded-full bg-[#0a0a0a] border-2 border-purple-500/40 shadow-[0_0_10px_rgba(168,85,247,0.15)]">
                      <Icon className="w-3.5 h-3.5 text-purple-400" />
                    </div>
                  </div>

                  {/* Content card */}
                  <div
                    className={`ml-14 md:ml-0 md:w-[calc(50%-2.5rem)] ${
                      isLeft ? "md:pr-0 md:mr-auto" : "md:pl-0 md:ml-auto"
                    }`}
                  >
                    <div className={`group p-5 rounded-2xl border border-white/6 bg-white/[0.02] hover:border-purple-500/20 hover:bg-white/[0.04] transition-all duration-300 relative`}>
                      {/* Arrow pointing to center line */}
                      <div
                        className={`hidden md:block absolute top-4 w-3 h-3 rotate-45 border-white/6 bg-white/[0.02] group-hover:border-purple-500/20 group-hover:bg-white/[0.04] transition-all duration-300 ${
                          isLeft
                            ? "right-[-7px] border-r border-t"
                            : "left-[-7px] border-l border-b"
                        }`}
                      />

                      {/* Period + Location */}
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="text-xs font-mono text-purple-400/70 tracking-wide">
                          {item.period}
                        </span>
                        {item.location && (
                          <span className="inline-flex items-center gap-1 text-xs text-slate-600">
                            <MapPin className="w-3 h-3" />
                            {item.location}
                          </span>
                        )}
                      </div>

                      {/* Title + Company */}
                      <h3 className="text-base md:text-lg font-semibold text-white mb-1 group-hover:text-purple-300 transition-colors duration-300">
                        {item.title}
                      </h3>
                      <p className="text-sm text-slate-500 mb-3">
                        {item.company}
                      </p>

                      {/* Description */}
                      {item.description.length > 0 && (
                        <ul className="space-y-1.5">
                          {item.description.map((bullet, i) => (
                            <li key={i} className="text-xs text-slate-400 leading-relaxed flex gap-2">
                              <span className="text-purple-500/30 mt-1 shrink-0">–</span>
                              {bullet}
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* Tech */}
                      {item.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-white/6">
                          {item.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="px-2 py-0.5 rounded-md bg-purple-500/8 text-[10px] text-purple-300/60 font-mono"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
