"use client";

import { useEffect, useRef } from "react";

/**
 * Tactile grid - cells near the cursor rise like keyboard keycaps.
 * Canvas-based so hundreds of cells animate at 60fps with zero DOM cost.
 */
function TactileGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(pointer: coarse)").matches) return; // touch devices: static grid only
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const CELL = 56;
    const RADIUS = 170;
    let w = 0, h = 0, cols = 0, rows = 0;
    let elevations = new Float32Array(0);
    const mouse = { x: -9999, y: -9999 };
    let raf = 0;
    let running = false;

    const roundRect = (x: number, y: number, s: number, r: number) => {
      ctx.beginPath();
      ctx.roundRect(x, y, s, s, r);
    };

    const drawGridLines = () => {
      ctx.strokeStyle = "rgba(255,255,255,0.022)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let c = 0; c <= cols; c++) {
        ctx.moveTo(c * CELL + 0.5, 0);
        ctx.lineTo(c * CELL + 0.5, h);
      }
      for (let r = 0; r <= rows; r++) {
        ctx.moveTo(0, r * CELL + 0.5);
        ctx.lineTo(w, r * CELL + 0.5);
      }
      ctx.stroke();
    };

    const drawFrame = () => {
      ctx.clearRect(0, 0, w, h);
      drawGridLines();

      let anyActive = false;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c;
          const cx = c * CELL + CELL / 2;
          const cy = r * CELL + CELL / 2;
          const dist = Math.hypot(cx - mouse.x, cy - mouse.y);
          // steep pyramid falloff - the cell under the cursor spikes, neighbors barely ripple
          const target = dist < RADIUS ? Math.pow(1 - dist / RADIUS, 3.2) : 0;
          elevations[i] += (target - elevations[i]) * 0.18;
          const f = elevations[i];
          if (f < 0.015) {
            elevations[i] = target === 0 ? 0 : elevations[i];
            continue;
          }
          anyActive = true;

          const lift = f * 16;
          // the face tapers as it rises - reads as a pyramid tip / scale
          const shrink = f * 4;
          const pad = 2.5 + shrink / 2;
          const x = c * CELL + pad;
          const yRest = r * CELL + pad;
          const y = yRest - lift;
          const s = CELL - pad * 2;

          // shadow beneath the raised key - deepens and drops with height
          ctx.fillStyle = `rgba(0, 0, 0, ${0.55 * f})`;
          roundRect(x, yRest + 2 + f * 2, s, 7);
          ctx.fill();

          // keycap face - lighter at the top like catching light
          const grad = ctx.createLinearGradient(0, y, 0, y + s);
          grad.addColorStop(0, `rgba(192, 140, 255, ${0.2 * f})`);
          grad.addColorStop(1, `rgba(110, 55, 210, ${0.06 * f})`);
          ctx.fillStyle = grad;
          roundRect(x, y, s, 7);
          ctx.fill();

          // keycap edge
          ctx.strokeStyle = `rgba(192, 132, 252, ${0.28 * f})`;
          ctx.lineWidth = 1;
          ctx.stroke();

          // top highlight - the "catch light" on the keycap's upper edge
          ctx.beginPath();
          ctx.moveTo(x + 6, y + 1.5);
          ctx.lineTo(x + s - 6, y + 1.5);
          ctx.strokeStyle = `rgba(233, 213, 255, ${0.45 * f})`;
          ctx.stroke();
        }
      }

      if (anyActive) {
        raf = requestAnimationFrame(drawFrame);
      } else {
        running = false;
      }
    };

    const wake = () => {
      if (!running) {
        running = true;
        raf = requestAnimationFrame(drawFrame);
      }
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / CELL) + 1;
      rows = Math.ceil(h / CELL) + 1;
      elevations = new Float32Array(cols * rows);
      ctx.clearRect(0, 0, w, h);
      drawGridLines();
    };

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (!reducedMotion) wake();
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
      if (!reducedMotion) wake(); // let the keys settle back down
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove);
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0"
      style={{
        maskImage: "radial-gradient(ellipse 95% 85% at 50% 35%, black 45%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(ellipse 95% 85% at 50% 35%, black 45%, transparent 100%)",
      }}
    />
  );
}

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
      {/* Tactile grid - keycaps rise near the cursor */}
      <TactileGrid />

      {/* Drifting aurora blobs */}
      <div className="aurora-blob aurora-blob-1" />
      <div className="aurora-blob aurora-blob-2" />
      <div className="aurora-blob aurora-blob-3" />

      {/* Cursor spotlight */}
      <div ref={spotRef} className="absolute inset-0" />
    </div>
  );
}
