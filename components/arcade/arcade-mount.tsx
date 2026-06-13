"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// The arcade (and all game code) only downloads when a visitor first opens it.
const Arcade = dynamic(() => import("./arcade").then((m) => m.Arcade), { ssr: false });

export function ArcadeMount() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("typing-game:open", handler);
    return () => window.removeEventListener("typing-game:open", handler);
  }, []);

  if (!open) return null;
  return <Arcade onClose={() => setOpen(false)} />;
}
