import { personalInfo, experience, projects } from "@/lib/portfolio-data";
import { HeaderAnimations } from "@/components/header-animations";
import { ProjectCard } from "@/components/project-card";
import { ProfileCard } from "@/components/profile-card";
import { CodeBlock } from "@/components/code-block";
import { AboutReveal, FadeIn } from "@/components/about-reveal";
import { TechImports } from "@/components/tech-imports";
import { StatusBar } from "@/components/status-bar";
import { PageShell } from "@/components/page-shell";

export default function Home() {
  return (
    <div className="relative bg-black min-h-screen">
      <main className="max-w-[1000px] mx-auto px-6 py-16 md:py-24">
        {/* Status bar + Command Palette */}
        <StatusBar />
        <PageShell />

        {/* ── Header ── */}
        <header className="flex flex-col sm:flex-row items-start gap-6 mb-16">
          {/* Profile Image */}
          <ProfileCard src={personalInfo.profileImage} alt={personalInfo.name} />

          <div className="flex-1">
            <HeaderAnimations
              name={personalInfo.name}
              title={personalInfo.title}
              email={personalInfo.email}
              linkedin={personalInfo.social.linkedin}
              github={personalInfo.social.github}
            />
          </div>
        </header>

        {/* ── About ── */}
        <section id="about" className="mb-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left — label + text */}
            <AboutReveal>
              <div>
                <h2 className="text-xs font-mono tracking-[0.2em] text-purple-400/80 uppercase mb-3">
                  About
                </h2>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  I write code that ships. Frontends that feel right,
                  backends that don&apos;t break at 3am, and infrastructure
                  that scales when it needs to.
                </p>
                <p className="mt-8 text-xl font-bold font-mono tracking-tight">
                  <span className="text-white/80">Ship fast.</span>{" "}
                  <span className="text-purple-400/80">Real results.</span>{" "}
                  <span className="text-white/80">Sleep well.</span>
                </p>
              </div>
            </AboutReveal>

            {/* Right — terminal block */}
            <CodeBlock />
          </div>
        </section>

        {/* ── Two Column: Tech Stack + Experience ── */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Tech Stack */}
          <section id="tech-stack">
            <h2 className="text-xs font-mono tracking-[0.2em] text-purple-400/80 uppercase mb-6">
              Tech Stack
            </h2>
            <TechImports />
          </section>

          {/* Experience */}
          <FadeIn>
          <section id="experience">
            <h2 className="text-xs font-mono tracking-[0.2em] text-purple-400/80 uppercase mb-6">
              Experience
            </h2>

            <div className="relative space-y-4">
              {/* Vertical line */}
              <div className="absolute left-[3px] top-2 bottom-2 w-px bg-white/6" />

              {experience.map((item, i) => (
                <div
                  key={i}
                  className="relative flex items-start justify-between gap-4 group"
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <span className="relative z-10 mt-1.5 w-1.5 h-1.5 rounded-full bg-purple-500/50 group-hover:bg-purple-400 shrink-0 transition-colors" />
                    <div>
                    <p className="text-sm font-medium text-white/90 group-hover:text-purple-300 transition-colors">
                      {item.title}
                    </p>
                    <p className="text-xs text-neutral-600">{item.company}</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-neutral-600 whitespace-nowrap shrink-0 pt-0.5">
                    {item.period}
                  </span>
                </div>
              ))}
            </div>
          </section>
          </FadeIn>
        </div>

        {/* ── Divider ── */}
        <div className="border-t border-dashed border-purple-500/10 mb-16" />

        {/* ── Projects ── */}
        <FadeIn>
        <section id="projects" className="mb-16">
          <h2 className="text-xs font-mono tracking-[0.2em] text-purple-400/80 uppercase mb-6">
            Projects
          </h2>

          {/* Horizontal scrollable row */}
          <div className="flex gap-4 overflow-x-auto overflow-y-hidden pb-4 pt-2 -mx-2 px-2 snap-x snap-mandatory scrollbar-thin">
            {projects.map((project) => (
              <ProjectCard key={project.title} project={project} />
            ))}
          </div>
        </section>
        </FadeIn>

        {/* ── Footer ── */}
        <footer className="pt-8 border-t border-purple-500/10">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px] text-neutral-700">
            <p>{personalInfo.copyright}</p>
            <p className="font-mono flex items-center gap-1.5">
              Press <kbd className="px-1 py-0.5 rounded border border-white/10 text-[10px]">⌘K</kbd> to navigate
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
