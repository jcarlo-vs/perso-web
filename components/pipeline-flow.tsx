const LAYERS = ["CLIENT", "BACKEND", "CLOUD"];

/**
 * Three planes with a signal falling through and returning.
 *
 * Pure CSS 3D - no canvas, no JS, no dependency. One 5s clock drives
 * everything: the ball's dive, and each plane/label highlight fired at the
 * moment the ball crosses that layer (0.29s / 1.0s / 1.71s).
 *
 * Styles are co-located rather than in globals.css so the component is
 * self-contained and cannot render unstyled if the global sheet goes stale.
 */
const CSS = `
.pf-drop {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  height: 100%;
}
.pf-stage {
  position: relative;
  flex: none;
  width: 118px;
  height: 128px;
  perspective: 700px;
}
.pf-scene {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 72px;
  height: 72px;
  margin: -36px 0 0 -36px;
  transform-style: preserve-3d;
  transform: rotateX(56deg) rotateZ(-45deg);
}
.pf-plane {
  position: absolute;
  inset: 0;
  border-radius: 7px;
  border: 1px solid hsl(var(--accent) / 0.19);
  background:
    repeating-linear-gradient(0deg, hsl(var(--accent) / 0.055) 0 1px, transparent 1px 9px),
    repeating-linear-gradient(90deg, hsl(var(--accent) / 0.055) 0 1px, transparent 1px 9px),
    linear-gradient(hsl(var(--accent) / 0.045), hsl(var(--accent) / 0.012));
}
.pf-p1 { transform: translateZ(34px);  animation: pf-lit 5s linear infinite 0.29s; }
.pf-p2 { transform: translateZ(0);     animation: pf-lit 5s linear infinite 1s; }
.pf-p3 { transform: translateZ(-34px); animation: pf-lit 5s linear infinite 1.71s; }
@keyframes pf-lit {
  0% {
    border-color: hsl(var(--accent) / 0.72);
    box-shadow: 0 0 18px hsl(var(--accent) / 0.18);
  }
  15%, 100% {
    border-color: hsl(var(--accent) / 0.19);
    box-shadow: 0 0 0 hsl(var(--accent) / 0);
  }
}
.pf-pulse {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 16px;
  height: 16px;
  margin: -8px 0 0 -8px;
  border-radius: 50%;
  /* One continuous falloff from an off-centre hot core out to nothing. The
     offset centre is what gives it a lighting direction, and running the stops
     end to end avoids the dead band that made the last version read as a dot
     sitting inside a separate ring. */
  background: radial-gradient(circle at 41% 36%,
    #ffffff 0 13%,
    hsl(var(--accent) / 0.95) 28%,
    hsl(var(--accent) / 0.55) 46%,
    hsl(var(--accent) / 0.24) 64%,
    hsl(var(--accent) / 0.07) 83%,
    hsl(var(--accent) / 0) 100%);
  box-shadow: 0 0 20px 5px hsl(var(--accent) / 0.32);
  animation: pf-dive 5s ease-in-out infinite;
}
/* A faint arc on the lit side only - reads as the curve of a sphere without
   closing into a ring the way a full border would. */
.pf-pulse::before {
  content: "";
  position: absolute;
  inset: 1px;
  border-radius: 50%;
  background: radial-gradient(circle at 37% 31%,
    rgba(255, 255, 255, 0) 0 54%,
    rgba(255, 255, 255, 0.26) 74%,
    rgba(255, 255, 255, 0) 92%);
}
/* Tight specular sitting on the surface, well inside the limb. */
.pf-pulse::after {
  content: "";
  position: absolute;
  left: 28%;
  top: 21%;
  width: 4px;
  height: 3.2px;
  border-radius: 50%;
  transform: rotate(-20deg);
  background: radial-gradient(circle,
    rgba(255, 255, 255, 0.95) 0 40%, rgba(255, 255, 255, 0) 100%);
}
@keyframes pf-dive {
  0%        { transform: translateZ(48px); }
  40%, 50%  { transform: translateZ(-48px); }
  90%, 100% { transform: translateZ(48px); }
}
.pf-keys { display: flex; flex-direction: column; gap: 15px; flex: none; }
.pf-key {
  display: flex;
  align-items: center;
  gap: 9px;
  color: hsl(var(--accent) / 0.85);
}
.pf-lead {
  width: 16px;
  height: 1px;
  background: currentColor;
  opacity: 0.32;
  flex: none;
}
.pf-name {
  font-family: var(--font-jetbrains-mono), ui-monospace, monospace;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: inherit;
}
.pf-k1 { animation: pf-keylit 5s linear infinite 0.29s; }
.pf-k2 { animation: pf-keylit 5s linear infinite 1s; }
.pf-k3 { animation: pf-keylit 5s linear infinite 1.71s; }
@keyframes pf-keylit {
  0% {
    color: hsl(var(--accent));
    text-shadow: 0 0 12px hsl(var(--accent) / 0.7);
  }
  15%, 100% {
    color: hsl(var(--accent) / 0.85);
    text-shadow: 0 0 0 hsl(var(--accent) / 0);
  }
}
@media (prefers-reduced-motion: reduce) {
  .pf-plane, .pf-pulse, .pf-key { animation: none; }
}
`;

export function PipelineFlow() {
  return (
    <div className="relative mb-8 h-[152px] w-full">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="pf-drop" aria-hidden="true">
        <div className="pf-stage">
          <div className="pf-scene">
            <div className="pf-plane pf-p1" />
            <div className="pf-plane pf-p2" />
            <div className="pf-plane pf-p3" />
            <div className="pf-pulse" />
          </div>
        </div>

        <div className="pf-keys">
          {LAYERS.map((name, i) => (
            <div key={name} className={`pf-key pf-k${i + 1}`}>
              <span className="pf-lead" />
              <span className="pf-name">{name}</span>
            </div>
          ))}
        </div>
      </div>

      <span className="sr-only">
        A looping diagram: a signal descends through the client, backend and
        cloud layers, then returns carrying the response.
      </span>
    </div>
  );
}
