import { Navigation } from "@/components/layout/navigation";
import { HeroSection } from "@/components/sections/hero-section";
import { AboutSection } from "@/components/sections/about-section";
import { ResumeSection } from "@/components/sections/resume-section";
import { SkillsSection } from "@/components/sections/skills-section";
import { PortfolioSection } from "@/components/sections/portfolio-section";
import { ContactSection } from "@/components/sections/contact-section";

export default function Home() {
  return (
    <div className="relative bg-black overflow-x-hidden">
      {/* Navigation - Floating pill */}
      <Navigation />

      {/* Sections - Full width immersive layout */}
      <main>
        <HeroSection />
        <AboutSection />
        <ResumeSection />
        <SkillsSection />
        <PortfolioSection />
        <ContactSection />
      </main>
    </div>
  );
}
