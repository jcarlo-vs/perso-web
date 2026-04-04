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
    <section id="skills" className="relative py-32 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Label */}
        <Reveal variant="fade-up">
          <p className="text-xs tracking-[0.3em] text-purple-400/80 font-mono mb-6 uppercase">
            Tech Stack
          </p>
        </Reveal>

        <Reveal variant="fade-up" delay={0.1}>
          <h2 className="text-3xl md:text-5xl font-bold mb-16">
            <span className="text-purple-400">Technologies</span>
            <span className="text-white/90"> I work with</span>
          </h2>
        </Reveal>

        {/* Categories as rows */}
        <div className="space-y-16">
          {categories.map((category, catIndex) => (
            <div key={category.label}>
              <Reveal variant="fade-up" delay={catIndex * 0.1}>
                <h3 className="text-xs tracking-[0.2em] font-mono text-slate-600 mb-6 pb-3 border-b border-white/6">
                  {category.label}
                </h3>
              </Reveal>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {category.items.map((skill, index) => (
                  <Reveal
                    key={skill.name}
                    variant="fade-up"
                    delay={catIndex * 0.05 + index * 0.03}
                  >
                    <div className="group flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.03] transition-all duration-300">
                      <SkillIcon
                        name={skill.name}
                        className="relative w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity duration-300"
                      />
                      <span className="text-sm text-slate-500 group-hover:text-white transition-colors duration-300">
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
