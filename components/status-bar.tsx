"use client";

import { useState, useEffect } from "react";
import { Command, Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export function StatusBar() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Asia/Manila",
          hour12: true,
        })
      );
    };
    update();
    const interval = setInterval(update, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-start justify-end text-[11px] text-neutral-600 mb-4">
      <div className="flex items-start gap-3">
        <div className="flex items-center gap-3 pt-1">
          {time && (
            <span className="font-mono">{time} PHT</span>
          )}
          <button
            type="button"
            onClick={() => {
              window.dispatchEvent(new CustomEvent("ai-terminal:open"));
            }}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-purple-500/25 text-purple-400/80 hover:text-purple-300 hover:border-purple-400/40 hover:bg-purple-500/10 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3 h-3" />
            <span className="font-mono">ASK AI</span>
          </button>
          <button
            type="button"
            onClick={() => {
              window.dispatchEvent(
                new KeyboardEvent("keydown", { key: "k", metaKey: true })
              );
            }}
            className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-md border border-white/8 text-neutral-600 hover:text-neutral-400 hover:border-white/15 transition-colors cursor-pointer"
          >
            <Command className="w-3 h-3" />
            <span className="font-mono">K</span>
          </button>
        </div>
        <ThemeToggle />
      </div>
    </div>
  );
}
