/**
 * Single source of truth for the accent color in JS / <canvas> contexts.
 *
 * The whole site's accent is defined ONCE as the `--accent` CSS variable in
 * app/globals.css. CSS and Tailwind read that variable directly; <canvas>
 * games can't use CSS variables, so they call `accent()` which reads the very
 * same variable at runtime. Change `--accent` in globals.css and everything -
 * the UI and the arcade games - recolors together. One knob.
 */
const ACCENT_FALLBACK = "0 0% 54%"; // mirrors --accent default (steel grey #8a8a8a)

let cached: string | null = null;

/**
 * Returns the theme accent as a CSS color string.
 * @param alpha 0-1 opacity (default 1 = fully opaque)
 */
export function accent(alpha = 1): string {
  if (cached === null && typeof window !== "undefined") {
    const v = getComputedStyle(document.documentElement)
      .getPropertyValue("--accent")
      .trim();
    cached = v || ACCENT_FALLBACK;
  }
  const triplet = cached ?? ACCENT_FALLBACK;
  return alpha >= 1 ? `hsl(${triplet})` : `hsl(${triplet} / ${alpha})`;
}
