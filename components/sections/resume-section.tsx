"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Reveal } from "@/components/ui/reveal";
import { experience } from "@/lib/portfolio-data";
import { Briefcase, GraduationCap, MapPin } from "lucide-react";

export function ResumeSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const lineHeight = useTransform(scrollYProgress, [0.1, 0.8], ["0%", "100%"]);

  return (
    <section ref={sectionRef} id="resume" className="relative py-32 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Section Label */}
        <Reveal variant="fade-up">
          <p className="text-xs tracking-[0.3em] text-purple-400/80 font-mono mb-4 uppercase">
            Experience
          </p>
        </Reveal>

        <Reveal variant="fade-up" delay={0.1}>
          <h2 className="text-3xl md:text-5xl font-bold mb-16">
            <span className="text-white/90">Education & </span>
            <span className="text-purple-400">
              Experience
            </span>
          </h2>
        </Reveal>

        {/* Timeline */}
        <div className="relative">
          {/* Animated vertical line */}
          <div className="absolute left-[19px] md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-px bg-white/6">
            <motion.div
              className="w-full bg-gradient-to-b from-purple-500 via-purple-500/50 to-transparent origin-top"
              style={{ height: lineHeight }}
            />
          </div>

          <div className="space-y-12">
            {experience.map((item, index) => {
              const isEducation =
                item.title.includes("Bachelor") ||
                item.title.includes("Master") ||
                item.title.includes("Degree");
              const Icon = isEducation ? GraduationCap : Briefcase;
              const isLeft = index % 2 === 0;

              return (
                <Reveal
                  key={index}
                  variant={isLeft ? "fade-right" : "fade-left"}
                  delay={index * 0.15}
                >
                  <div
                    className={`relative flex items-start gap-6 md:gap-0 ${
                      isLeft ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    {/* Timeline dot */}
                    <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 z-10">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-black border-2 border-purple-500/50">
                        <Icon className="w-4 h-4 text-purple-400" />
                      </div>
                    </div>

                    {/* Content */}
                    <div
                      className={`ml-16 md:ml-0 md:w-[calc(50%-2rem)] ${
                        isLeft ? "md:pr-4" : "md:pl-4 md:ml-auto"
                      }`}
                    >
                      <div className="p-5 rounded-xl border border-white/6 bg-white/2 hover:border-purple-500/20 hover:bg-white/4 transition-all duration-300">
                        {/* Period + Location */}
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span className="inline-block px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-[10px] font-medium text-purple-400 tracking-wide">
                            {item.period}
                          </span>
                          {item.location && (
                            <span className="inline-flex items-center gap-1 text-[10px] text-slate-500">
                              <MapPin className="w-3 h-3" />
                              {item.location}
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-semibold text-white mb-1">
                          {item.title}
                        </h3>

                        {/* Company */}
                        <p className="text-sm text-slate-500 flex items-center gap-2 mb-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-500/40" />
                          {item.company}
                        </p>

                        {/* Description bullets */}
                        {item.description.length > 0 && (
                          <ul className="space-y-1.5 mb-3">
                            {item.description.map((bullet, i) => (
                              <li
                                key={i}
                                className="text-xs text-slate-400 leading-relaxed flex gap-2"
                              >
                                <span className="text-purple-500/50 mt-1 shrink-0">—</span>
                                {bullet}
                              </li>
                            ))}
                          </ul>
                        )}

                        {/* Tech badges */}
                        {item.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-white/6">
                            {item.technologies.map((tech) => (
                              <span
                                key={tech}
                                className="px-2 py-0.5 rounded-full bg-purple-500/8 border border-purple-500/15 text-[10px] text-purple-300/70"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
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
