"use client";

import { useState, useCallback } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  const toggle = useCallback(() => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.remove("light-mode");
    } else {
      document.documentElement.classList.add("light-mode");
    }
  }, [isDark]);

  return (
    <button
      type="button"
      onClick={toggle}
      className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-white/8 text-neutral-500 hover:text-purple-400 hover:border-purple-500/30 transition-colors cursor-pointer"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
    </button>
  );
}
