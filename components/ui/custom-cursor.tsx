"use client";

import { useEffect } from "react";

// White pointer arrow cursor (SVG)
const pointerSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="19" viewBox="0 0 24 28" fill="none">
  <path d="M2 2L2 22L7.5 16.5L12.5 26L16 24.5L11 15H19L2 2Z" fill="white" stroke="rgba(0,0,0,0.5)" stroke-width="1.5" stroke-linejoin="round"/>
</svg>`;

const toDataURL = (svg: string) =>
  `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;

export function CustomCursor() {
  useEffect(() => {
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouch) return;

    const style = document.createElement("style");
    style.textContent = `
      * { cursor: ${toDataURL(pointerSVG)} 2 2, auto !important; }
      a, button, [data-cursor-hover],
      a *, button *, [data-cursor-hover] *,
      input, textarea, select,
      [role="button"] { cursor: pointer !important; }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return null;
}
