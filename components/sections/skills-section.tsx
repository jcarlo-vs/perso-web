"use client";

import { Reveal } from "@/components/ui/reveal";
import { SkillIcon } from "@/components/ui/skill-icon";
import { skills } from "@/lib/portfolio-data";

interface SkillCategory {
  label: string;
  items: { name: string }[];
}

const categories: SkillCategory[] = [
  { label: "FRONT-END", items: skills.frontend },
  { label: "BACK-END", items: skills.backend },
  { label: "TOOLS & INFRA", items: skills.tools },
];

export function SkillsSection() {
  return (
    <section id="skills" className="relative py-32 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section Label */}
        <Reveal variant="fade-up">
          <p className="text-xs tracking-[0.3em] text-neutral-500 font-mono mb-4 uppercase">
            Tech Stack
          </p>
        </Reveal>

        <Reveal variant="fade-up" delay={0.1}>
          <h2 className="text-3xl md:text-4xl font-bold mb-16">
            <span className="text-neutral-400">
              Tech Stack
            </span>
          </h2>
        </Reveal>

        {/* Skill Categories */}
        <div className="space-y-16">
          {categories.map((category, catIndex) => (
            <div key={category.label}>
              <Reveal variant="fade-up" delay={catIndex * 0.1}>
                <h3 className="text-sm tracking-[0.2em] font-semibold mb-8 text-neutral-400/70">
                  {category.label}
                </h3>
              </Reveal>

              <div className="flex flex-wrap gap-3">
                {category.items.map((skill, index) => (
                  <Reveal
                    key={skill.name}
                    variant="scale-in"
                    delay={catIndex * 0.1 + index * 0.02}
                  >
                    <div className="group flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:border-neutral-500/25 hover:bg-white/10 transition-all duration-300">
                      <SkillIcon
                        name={skill.name}
                        className="relative w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                      />
                      <span className="text-sm text-slate-300 group-hover:text-white font-medium tracking-wide transition-colors duration-300">
                        {skill.name}
                      </span>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
