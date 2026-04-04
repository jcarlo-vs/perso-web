"use client";

import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  User,
  Code2,
  Briefcase,
  FolderOpen,
  Mail,
  ExternalLink,
  Download,
  Github,
  Linkedin,
  Command,
} from "lucide-react";

interface CommandItem {
  id: string;
  label: string;
  category: string;
  icon: React.ReactNode;
  action: () => void;
  keywords?: string[];
}

interface CommandPaletteProps {
  onSendEmail: () => void;
}

export function CommandPalette({ onSendEmail }: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setOpen(false);
  }, []);

  const items: CommandItem[] = useMemo(
    () => [
      // Navigation
      { id: "nav-about", label: "Go to About", category: "Navigation", icon: <User className="w-4 h-4" />, action: () => scrollTo("about"), keywords: ["about", "bio", "me"] },
      { id: "nav-tech", label: "Go to Tech Stack", category: "Navigation", icon: <Code2 className="w-4 h-4" />, action: () => scrollTo("tech-stack"), keywords: ["skills", "tech", "stack", "frontend", "backend"] },
      { id: "nav-exp", label: "Go to Experience", category: "Navigation", icon: <Briefcase className="w-4 h-4" />, action: () => scrollTo("experience"), keywords: ["experience", "work", "resume", "career"] },
      { id: "nav-projects", label: "Go to Projects", category: "Navigation", icon: <FolderOpen className="w-4 h-4" />, action: () => scrollTo("projects"), keywords: ["projects", "portfolio", "work"] },

      // Actions
      { id: "act-email", label: "Send Email", category: "Actions", icon: <Mail className="w-4 h-4" />, action: () => { setOpen(false); setTimeout(onSendEmail, 200); }, keywords: ["email", "contact", "message", "hire"] },
      { id: "act-cv", label: "Download CV", category: "Actions", icon: <Download className="w-4 h-4" />, action: () => { setOpen(false); window.open("/resume.pdf", "_blank"); }, keywords: ["cv", "resume", "download", "pdf"] },

      // Links
      { id: "link-github", label: "Open GitHub", category: "Links", icon: <Github className="w-4 h-4" />, action: () => { setOpen(false); window.open("https://github.com/jcarlo-vs", "_blank"); }, keywords: ["github", "code", "repo"] },
      { id: "link-linkedin", label: "Open LinkedIn", category: "Links", icon: <Linkedin className="w-4 h-4" />, action: () => { setOpen(false); window.open("https://www.linkedin.com/in/jcarlo-senin/", "_blank"); }, keywords: ["linkedin", "social", "connect"] },

      // Projects
      { id: "proj-notelify", label: "View Notelify App", category: "Projects", icon: <ExternalLink className="w-4 h-4" />, action: () => { setOpen(false); window.open("https://notelify-app.vercel.app/landing", "_blank"); }, keywords: ["notelify", "notes", "app"] },
      { id: "proj-crypto", label: "View Crypto Meter", category: "Projects", icon: <ExternalLink className="w-4 h-4" />, action: () => { setOpen(false); window.open("https://crypto-meter.vercel.app/", "_blank"); }, keywords: ["crypto", "meter", "exchange"] },
      { id: "proj-picabook", label: "View Picabook", category: "Projects", icon: <ExternalLink className="w-4 h-4" />, action: () => { setOpen(false); window.open("https://picabook-app.vercel.app/login", "_blank"); }, keywords: ["picabook", "social", "photos"] },
    ],
    [scrollTo, onSendEmail]
  );

  const filtered = useMemo(() => {
    if (!query) return items;
    const q = query.toLowerCase();
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.keywords?.some((k) => k.includes(q))
    );
  }, [query, items]);

  // Group by category
  const grouped = useMemo(() => {
    const map = new Map<string, CommandItem[]>();
    for (const item of filtered) {
      const group = map.get(item.category) || [];
      group.push(item);
      map.set(item.category, group);
    }
    return map;
  }, [filtered]);

  // Keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Reset on open
  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Arrow navigation
  useEffect(() => {
    if (!open) return;
    const handleNav = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % filtered.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => (i - 1 + filtered.length) % filtered.length);
      } else if (e.key === "Enter" && filtered[activeIndex]) {
        e.preventDefault();
        filtered[activeIndex].action();
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handleNav);
    return () => window.removeEventListener("keydown", handleNav);
  }, [open, filtered, activeIndex]);

  // Reset active index when query changes
  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  // Scroll active item into view
  useEffect(() => {
    if (!listRef.current) return;
    const activeEl = listRef.current.querySelector(`[data-index="${activeIndex}"]`);
    activeEl?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  let flatIndex = -1;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed left-1/2 top-[20%] -translate-x-1/2 z-[60] w-[90%] max-w-lg"
          >
            <div className="bg-neutral-950 border border-white/10 rounded-2xl shadow-2xl shadow-purple-500/5 overflow-hidden">
              {/* Search input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-white/6">
                <Search className="w-4 h-4 text-purple-400 shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Type a command or search..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-white placeholder:text-neutral-600 outline-none"
                />
                <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded border border-white/10 text-[10px] text-neutral-600 font-mono">
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <div ref={listRef} className="max-h-[320px] overflow-y-auto py-2">
                {filtered.length === 0 ? (
                  <p className="text-sm text-neutral-600 text-center py-8">
                    No results found.
                  </p>
                ) : (
                  Array.from(grouped.entries()).map(([category, categoryItems]) => (
                    <div key={category}>
                      <p className="px-4 py-1.5 text-[10px] font-mono tracking-wider text-purple-400/60 uppercase">
                        {category}
                      </p>
                      {categoryItems.map((item) => {
                        flatIndex++;
                        const idx = flatIndex;
                        const isActive = activeIndex === idx;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            data-index={idx}
                            onClick={item.action}
                            onMouseEnter={() => setActiveIndex(idx)}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors cursor-pointer ${
                              isActive
                                ? "bg-purple-500/10 text-white"
                                : "text-neutral-400 hover:text-white"
                            }`}
                          >
                            <span className={isActive ? "text-purple-400" : "text-neutral-600"}>
                              {item.icon}
                            </span>
                            <span className="text-sm">{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  ))
                )}
              </div>

              {/* Footer hint */}
              <div className="flex items-center justify-between px-4 py-2 border-t border-white/6 text-[10px] text-neutral-600">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1 py-0.5 rounded border border-white/10 font-mono">↑↓</kbd>
                    navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1 py-0.5 rounded border border-white/10 font-mono">↵</kbd>
                    select
                  </span>
                </div>
                <span className="flex items-center gap-1">
                  <Command className="w-3 h-3" />K to toggle
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
