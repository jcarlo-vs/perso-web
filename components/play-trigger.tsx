"use client";

import { Gamepad2 } from "lucide-react";

/** Small "play" chip - opens the typing game via custom event. */
export function PlayTrigger() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent("typing-game:open"))}
      className="group inline-flex items-center gap-1.5 px-2 py-1 rounded-md border border-purple-500/25 text-[10px] font-mono text-purple-400/80 hover:text-purple-200 hover:border-purple-400/50 hover:bg-purple-500/10 transition-colors cursor-pointer"
      title="Play the typing game"
    >
      <Gamepad2 className="w-3 h-3 group-hover:scale-110 transition-transform" />
      play
    </button>
  );
}
