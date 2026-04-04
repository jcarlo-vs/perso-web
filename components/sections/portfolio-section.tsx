"use client";

import { Reveal } from "@/components/ui/reveal";
import { ProjectCard } from "@/components/ui/project-card";
import { projects } from "@/lib/portfolio-data";

export function PortfolioSection() {
  return (
    <section id="projects" className="relative py-32 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section Label */}
        <Reveal variant="fade-up">
          <p className="text-xs tracking-[0.3em] text-purple-400/80 font-mono mb-4 uppercase">
            Portfolio
          </p>
        </Reveal>

        <Reveal variant="fade-up" delay={0.1}>
          <h2 className="text-3xl md:text-5xl font-bold mb-16">
            <span className="text-white/90">Featured </span>
            <span className="text-purple-400">
              Projects
            </span>
          </h2>
        </Reveal>

        {/* Projects */}
        <div className="space-y-12">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.title}
              title={project.title}
              description={project.description}
              image={project.image}
              technologies={project.technologies}
              demoLink={project.demoLink}
              githubLink={project.githubLink}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
