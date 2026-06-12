"use client";

import { useEffect, useRef } from "react";

export function AuroraBackground() {
  const spotRef = useRef<HTMLDivElement>(null);

  // Cursor spotlight - a soft purple glow that follows the pointer
  useEffect(() => {
    const el = spotRef.current;
    if (!el) return;
    if (window.matchMedia("(pointer: coarse)").matches) return; // skip on touch devices
    let raf = 0;
    const move = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.background = `radial-gradient(600px circle at ${e.clientX}px ${e.clientY}px, rgba(168,85,247,0.06), transparent 70%)`;
      });
    };
    window.addEventListener("pointermove", move);
    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Faint grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse 90% 80% at 50% 30%, black 40%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 90% 80% at 50% 30%, black 40%, transparent 100%)",
        }}
      />

      {/* Drifting aurora blobs */}
      <div className="aurora-blob aurora-blob-1" />
      <div className="aurora-blob aurora-blob-2" />
      <div className="aurora-blob aurora-blob-3" />

      {/* Cursor spotlight */}
      <div ref={spotRef} className="absolute inset-0" />
    </div>
  );
}
