"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Home, User, FileText, Code2, Briefcase, Mail } from "lucide-react";

const navItems = [
  { id: "home", label: "Home", icon: Home },
  { id: "about", label: "About", icon: User },
  { id: "resume", label: "Resume", icon: FileText },
  { id: "skills", label: "Tech", icon: Code2 },
  { id: "projects", label: "Projects", icon: Briefcase },
  { id: "contact", label: "Contact", icon: Mail },
];

export function Navigation() {
  const [activeSection, setActiveSection] = useState("home");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          // Show solid background with border when scrolled down a bit
          setIsScrolled(scrollY > 50);

          // Find elements once per tick
          const sectionElements = navItems.map((item) => ({
            id: item.id,
            element: document.getElementById(item.id),
          }));

          const scrollPosition = scrollY + window.innerHeight / 2.5;

          for (let i = sectionElements.length - 1; i >= 0; i--) {
            const { id, element } = sectionElements[i];
            if (element && element.offsetTop <= scrollPosition) {
              setActiveSection((prev) => (prev !== id ? id : prev));
              break;
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-300 w-[95%] sm:w-auto"
      style={{
        top: isScrolled ? "1rem" : "1.5rem",
      }}
    >
      <div
        className={cn(
          "mx-auto flex items-center justify-between sm:justify-center gap-1 sm:gap-2 px-3 py-2 sm:px-6 sm:py-3 rounded-full transition-all duration-500",
          isScrolled
            ? "bg-black/40 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
            : "bg-transparent border-transparent"
        )}
      >
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => scrollToSection(item.id)}
              className={cn(
                "relative px-4 py-2 sm:px-5 sm:py-2 rounded-full text-[10px] sm:text-xs font-semibold tracking-widest uppercase transition-colors duration-300 cursor-pointer flex-1 sm:flex-none text-center overflow-hidden group flex items-center justify-center",
                isActive ? "text-white" : "text-white/50 hover:text-white/90"
              )}
              title={item.label}
              data-cursor-hover
            >
              {isActive && (
                <motion.div
                  layoutId="nav-bg"
                  className="absolute inset-0 rounded-full bg-white/10"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 w-full flex items-center justify-center group-hover:-translate-y-[1px] transition-transform duration-200">
                <span className="hidden sm:inline">{item.label}</span>
                <span className="sm:hidden flex items-center justify-center w-full">
                  <Icon className="w-4 h-4" strokeWidth={2.5} />
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </motion.nav>
  );
}
