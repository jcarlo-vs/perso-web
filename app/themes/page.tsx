import type { Metadata } from "next";
import {
  Fraunces,
  Archivo_Black,
  Space_Mono,
  IBM_Plex_Sans,
  IBM_Plex_Mono,
  Orbitron,
} from "next/font/google";

export const metadata: Metadata = {
  title: "Theme Samples | Juan Carlo Senin",
  robots: { index: false },
};

const fraunces = Fraunces({ subsets: ["latin"], weight: ["400", "600", "900"], style: ["normal", "italic"] });
const archivo = Archivo_Black({ subsets: ["latin"], weight: "400" });
const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"] });
const plexSans = IBM_Plex_Sans({ subsets: ["latin"], weight: ["300", "400", "600"] });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"] });
const orbitron = Orbitron({ subsets: ["latin"], weight: ["500", "700", "900"] });

function PanelLabel({ n, name, blurb, colors, dark = true }: { n: string; name: string; blurb: string; colors: string[]; dark?: boolean }) {
  return (
    <div className="max-w-sm">
      <p className={`font-mono text-xs tracking-[0.3em] mb-3 ${dark ? "text-white/40" : "text-black/40"}`}>THEME {n} / 10</p>
      <h2 className={`text-4xl font-bold mb-3 ${dark ? "text-white" : "text-black"}`}>{name}</h2>
      <p className={`text-sm leading-relaxed mb-4 ${dark ? "text-white/60" : "text-black/60"}`}>{blurb}</p>
      <div className="flex gap-2">
        {colors.map((c) => (
          <span key={c} className={`w-7 h-7 rounded-full border ${dark ? "border-white/20" : "border-black/15"}`} style={{ background: c }} />
        ))}
      </div>
    </div>
  );
}

export default function ThemesPage() {
  return (
    <main className="bg-black">
      {/* ───────────────────────── 01 AURORA NOIR ───────────────────────── */}
      <section className="relative min-h-screen overflow-hidden flex items-center" style={{ background: "#050507" }}>
        <div className="absolute inset-0" style={{ background: "radial-gradient(900px 500px at 80% 10%, rgba(124,58,237,0.25), transparent 65%), radial-gradient(700px 500px at 10% 90%, rgba(99,102,241,0.18), transparent 65%), radial-gradient(500px 400px at 50% 50%, rgba(217,70,239,0.08), transparent 65%)" }} />
        <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)", backgroundSize: "52px 52px" }} />
        <div className="relative w-full max-w-6xl mx-auto px-8 py-24 grid md:grid-cols-2 gap-16 items-center">
          <PanelLabel n="01" name="Aurora Noir" blurb="Your current direction, sharpened. Deep space black, drifting violet aurora, terminal typography. Quiet, technical, confident - the site equivalent of a clean tmux setup." colors={["#050507", "#7c3aed", "#a855f7", "#e9e9f0"]} />
          <div className="rounded-2xl border border-white/10 p-8" style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(10px)" }}>
            <p className="font-mono text-[11px] text-purple-400 mb-4">❯ whoami</p>
            <h3 className="text-3xl font-bold text-white">Juan Carlo <span className="text-purple-400">Senin</span></h3>
            <p className="font-mono text-xs text-neutral-400 mt-2 mb-6">Full Stack Developer | AI &amp; Automation</p>
            <div className="flex gap-3 mb-6">
              <span className="px-4 py-2 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-mono">Send Email</span>
              <span className="px-4 py-2 rounded-lg border border-white/10 text-neutral-400 text-xs font-mono">GitHub</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {["NEXT JS", "AWS", "N8N", "CLAUDE"].map((t) => (
                <span key={t} className="text-[10px] font-mono text-purple-300/70 px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────── 02 EDITORIAL IVORY ───────────────────────── */}
      <section className={`relative min-h-screen overflow-hidden flex items-center ${fraunces.className}`} style={{ background: "#f5efe3" }}>
        <div className="absolute inset-0 opacity-60" style={{ backgroundImage: "repeating-radial-gradient(circle at 75% 20%, transparent 0px, transparent 60px, rgba(120,90,50,0.07) 61px, transparent 62px)" }} />
        <div className="absolute left-0 top-0 bottom-0 w-2" style={{ background: "#b3322b" }} />
        <div className="absolute top-10 right-10 text-[11px] tracking-[0.35em]" style={{ color: "rgba(0,0,0,0.35)" }}>EST. 2022 — PORTFOLIO</div>
        <div className="relative w-full max-w-6xl mx-auto px-8 py-24 grid md:grid-cols-2 gap-16 items-center">
          <PanelLabel n="02" name="Editorial Ivory" blurb="A light theme that reads like a magazine profile. Warm paper, ink-black serif, one crimson accent. Feels senior, literary, and very un-template. Rare among dev portfolios." colors={["#f5efe3", "#161412", "#b3322b", "#8a7a5c"]} dark={false} />
          <div className="border p-10" style={{ borderColor: "rgba(0,0,0,0.25)", background: "#faf6ec", boxShadow: "10px 10px 0 rgba(22,20,18,0.9)" }}>
            <p className="text-[11px] tracking-[0.3em] mb-4" style={{ color: "#b3322b" }}>FULL STACK DEVELOPER</p>
            <h3 className="text-4xl font-semibold leading-tight" style={{ color: "#161412" }}>
              Juan Carlo <em className="italic" style={{ color: "#b3322b" }}>Senin</em>
            </h3>
            <p className="text-sm mt-3 mb-7 leading-relaxed" style={{ color: "rgba(22,20,18,0.65)" }}>
              I write code that ships — and prose-clean interfaces that read like this one.
            </p>
            <div className="flex gap-3 mb-7">
              <span className="px-5 py-2 text-xs tracking-wider text-white" style={{ background: "#161412" }}>SEND EMAIL</span>
              <span className="px-5 py-2 text-xs tracking-wider border" style={{ borderColor: "#161412", color: "#161412" }}>GITHUB</span>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] italic" style={{ color: "rgba(22,20,18,0.5)" }}>
              <span>Next.js</span><span>AWS</span><span>n8n</span><span>Claude</span>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────── 03 CONCRETE SIGNAL ───────────────────────── */}
      <section className={`relative min-h-screen overflow-hidden flex items-center ${spaceMono.className}`} style={{ background: "#111110" }}>
        <div className="absolute top-0 left-0 right-0 h-4" style={{ background: "repeating-linear-gradient(45deg, #ffd400 0 18px, #111110 18px 36px)" }} />
        <div className="absolute bottom-0 left-0 right-0 h-4" style={{ background: "repeating-linear-gradient(45deg, #ffd400 0 18px, #111110 18px 36px)" }} />
        <div className={`absolute -right-8 top-1/2 -translate-y-1/2 text-[180px] leading-none select-none ${archivo.className}`} style={{ color: "transparent", WebkitTextStroke: "1px rgba(255,212,0,0.15)" }}>DEV</div>
        <div className="relative w-full max-w-6xl mx-auto px-8 py-24 grid md:grid-cols-2 gap-16 items-center">
          <PanelLabel n="03" name="Concrete Signal" blurb="Brutalist and loud. Hazard yellow on raw asphalt, massive grotesque type, hard edges, zero blur. Unmissable and aggressive - for standing out in a stack of pastel portfolios." colors={["#111110", "#ffd400", "#f5f5f0", "#2a2a28"]} />
          <div className="border-2 p-8" style={{ borderColor: "#ffd400", background: "#161614", boxShadow: "8px 8px 0 #ffd400" }}>
            <p className="text-[10px] tracking-[0.3em] mb-3" style={{ color: "#ffd400" }}>// FULL STACK DEVELOPER</p>
            <h3 className={`text-4xl uppercase leading-none ${archivo.className}`} style={{ color: "#f5f5f0" }}>
              Juan Carlo<br /><span style={{ color: "#ffd400" }}>Senin</span>
            </h3>
            <p className="text-xs mt-4 mb-6" style={{ color: "rgba(245,245,240,0.55)" }}>SHIP FAST. REAL RESULTS. SLEEP WELL.</p>
            <div className="flex gap-3 mb-6">
              <span className="px-4 py-2 text-xs font-bold" style={{ background: "#ffd400", color: "#111110" }}>SEND EMAIL</span>
              <span className="px-4 py-2 text-xs border-2" style={{ borderColor: "#f5f5f0", color: "#f5f5f0" }}>GITHUB</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {["NEXT.JS", "AWS", "N8N", "CLAUDE"].map((t) => (
                <span key={t} className="text-[10px] px-2 py-0.5 border" style={{ borderColor: "rgba(255,212,0,0.4)", color: "#ffd400" }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────── 04 GLACIER LINE ───────────────────────── */}
      <section className={`relative min-h-screen overflow-hidden flex items-center ${plexSans.className}`} style={{ background: "linear-gradient(180deg, #04070d 0%, #07131f 38%, #0b2433 55%, #16475c 68%, #0b2433 72%, #04070d 100%)" }}>
        {/* horizon glow - the panoramic seascape */}
        <div className="absolute left-0 right-0" style={{ top: "66%", height: "2px", background: "linear-gradient(90deg, transparent, rgba(125,211,252,0.7), transparent)" }} />
        <div className="absolute left-0 right-0" style={{ top: "58%", height: "16%", background: "radial-gradient(60% 100% at 50% 100%, rgba(56,189,248,0.18), transparent 70%)" }} />
        <div className="absolute inset-0" style={{ backgroundImage: "repeating-linear-gradient(180deg, transparent 0 90px, rgba(125,211,252,0.03) 90px 91px)" }} />
        <div className="relative w-full max-w-6xl mx-auto px-8 py-24 grid md:grid-cols-2 gap-16 items-center">
          <PanelLabel n="04" name="Glacier Line" blurb="Engineering calm. A panoramic arctic horizon - navy depths to a thin line of cyan light - with IBM Plex type. Precision over decoration. Reads as infrastructure-grade reliability." colors={["#04070d", "#0b2433", "#38bdf8", "#dbeefb"]} />
          <div className="rounded-xl border p-8" style={{ borderColor: "rgba(125,211,252,0.25)", background: "rgba(4,13,21,0.65)", backdropFilter: "blur(12px)" }}>
            <p className={`text-[11px] mb-4 ${plexMono.className}`} style={{ color: "#38bdf8" }}>$ uptime — 4+ yrs, zero drama</p>
            <h3 className="text-3xl font-semibold" style={{ color: "#dbeefb" }}>Juan Carlo <span style={{ color: "#38bdf8" }}>Senin</span></h3>
            <p className={`text-xs mt-2 mb-6 ${plexMono.className}`} style={{ color: "rgba(219,238,251,0.55)" }}>Full Stack Developer | AI &amp; Automation</p>
            <div className="flex gap-3 mb-6">
              <span className="px-4 py-2 rounded text-xs" style={{ background: "rgba(56,189,248,0.15), ", border: "1px solid rgba(56,189,248,0.4)", color: "#7dd3fc" }}>Send Email</span>
              <span className="px-4 py-2 rounded text-xs border" style={{ borderColor: "rgba(219,238,251,0.2)", color: "rgba(219,238,251,0.7)" }}>GitHub</span>
            </div>
            <div className={`flex flex-wrap gap-1.5 ${plexMono.className}`}>
              {["next.js", "aws", "n8n", "claude"].map((t) => (
                <span key={t} className="text-[10px] px-2 py-0.5 rounded" style={{ background: "rgba(56,189,248,0.08)", border: "1px solid rgba(56,189,248,0.25)", color: "#7dd3fc" }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────── 05 NEON HORIZON ───────────────────────── */}
      <section className="relative min-h-screen overflow-hidden flex items-center" style={{ background: "linear-gradient(180deg, #0d021f 0%, #2a0a4a 40%, #7a1e5c 62%, #0d021f 62.2%, #0d021f 100%)" }}>
        {/* sun */}
        <div className="absolute left-1/2 -translate-x-1/2" style={{ top: "34%", width: "300px", height: "300px", borderRadius: "50%", background: "linear-gradient(180deg, #ffd166 0%, #ff5e8a 60%, #c026d3 100%)", maskImage: "repeating-linear-gradient(180deg, black 0 22px, transparent 22px 30px), linear-gradient(180deg, black 55%, transparent 55%)", WebkitMaskImage: "repeating-linear-gradient(180deg, black 0 22px, transparent 22px 30px)", filter: "drop-shadow(0 0 40px rgba(255,94,138,0.45))" }} />
        {/* perspective grid floor */}
        <div className="absolute left-0 right-0 bottom-0" style={{ height: "38%", perspective: "300px", overflow: "hidden" }}>
          <div className="absolute inset-[-100%_-50%_0_-50%]" style={{ transform: "rotateX(62deg)", backgroundImage: "linear-gradient(rgba(217,70,239,0.5) 2px, transparent 2px), linear-gradient(90deg, rgba(217,70,239,0.5) 2px, transparent 2px)", backgroundSize: "80px 80px", maskImage: "linear-gradient(180deg, transparent, black 30%)", WebkitMaskImage: "linear-gradient(180deg, transparent, black 30%)" }} />
        </div>
        <div className="relative w-full max-w-6xl mx-auto px-8 py-24 grid md:grid-cols-2 gap-16 items-center">
          <PanelLabel n="05" name="Neon Horizon" blurb="Full retro-futurism: a synthwave sunset panorama with a perspective grid floor. Maximum memorability - recruiters WILL remember 'the synthwave guy'. Bold choice, big personality." colors={["#0d021f", "#ff5e8a", "#ffd166", "#d946ef"]} />
          <div className="rounded-xl p-8" style={{ background: "rgba(13,2,31,0.7)", border: "1px solid rgba(255,94,138,0.35)", boxShadow: "0 0 30px rgba(217,70,239,0.25)", backdropFilter: "blur(10px)" }}>
            <p className={`text-[11px] tracking-[0.25em] mb-4 ${orbitron.className}`} style={{ color: "#ffd166" }}>PLAYER 1 — READY</p>
            <h3 className={`text-3xl leading-tight ${orbitron.className}`} style={{ color: "#fff", textShadow: "0 0 18px rgba(255,94,138,0.6)" }}>
              JUAN CARLO<br /><span style={{ color: "#ff5e8a" }}>SENIN</span>
            </h3>
            <p className="font-mono text-xs mt-3 mb-6" style={{ color: "rgba(255,255,255,0.55)" }}>Full Stack Developer | AI &amp; Automation</p>
            <div className="flex gap-3 mb-6">
              <span className="px-4 py-2 rounded text-xs font-mono" style={{ background: "linear-gradient(90deg, #ff5e8a, #d946ef)", color: "#fff" }}>SEND EMAIL</span>
              <span className="px-4 py-2 rounded text-xs font-mono border" style={{ borderColor: "rgba(255,209,102,0.5)", color: "#ffd166" }}>GITHUB</span>
            </div>
            <div className="flex flex-wrap gap-1.5 font-mono">
              {["NEXT.JS", "AWS", "N8N", "CLAUDE"].map((t) => (
                <span key={t} className="text-[10px] px-2 py-0.5 rounded" style={{ background: "rgba(217,70,239,0.12)", border: "1px solid rgba(217,70,239,0.4)", color: "#e879f9" }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────── 06 SUMMIT LINE (photo) ───────────────────────── */}
      <section className={`relative min-h-screen overflow-hidden flex items-center ${plexSans.className}`}>
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=2400&auto=format&fit=crop)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(7,10,15,0.5) 0%, rgba(7,10,15,0.72) 100%)" }} />
        <div className="relative w-full max-w-6xl mx-auto px-8 py-24 grid md:grid-cols-2 gap-16 items-center">
          <PanelLabel n="06" name="Summit Line" blurb="Photographic minimalism. A real Himalayan panorama in near-monochrome, thin typography, acres of negative space. The photo does the talking; the type stays out of its way. Quiet luxury." colors={["#0e131b", "#8fa3b8", "#e8edf3", "#3b4d63"]} />
          <div className="rounded-xl border p-8" style={{ borderColor: "rgba(232,237,243,0.25)", background: "rgba(10,14,20,0.55)", backdropFilter: "blur(14px)" }}>
            <p className="text-[11px] tracking-[0.35em] mb-4" style={{ color: "#8fa3b8" }}>FULL STACK DEVELOPER</p>
            <h3 className="text-3xl font-light" style={{ color: "#e8edf3" }}>Juan Carlo <span className="font-semibold">Senin</span></h3>
            <p className="text-xs mt-2 mb-6 font-light" style={{ color: "rgba(232,237,243,0.6)" }}>Frontends that feel right. Backends that don&apos;t break at 3am.</p>
            <div className="flex gap-3 mb-6">
              <span className="px-4 py-2 rounded text-xs" style={{ background: "rgba(232,237,243,0.92)", color: "#0e131b" }}>Send Email</span>
              <span className="px-4 py-2 rounded text-xs border" style={{ borderColor: "rgba(232,237,243,0.3)", color: "#e8edf3" }}>GitHub</span>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px]" style={{ color: "rgba(232,237,243,0.5)" }}>
              <span>Next.js</span><span>AWS</span><span>n8n</span><span>Claude</span>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────── 07 MIDNIGHT METROPOLIS (photo) ───────────────────────── */}
      <section className={`relative min-h-screen overflow-hidden flex items-center ${spaceMono.className}`}>
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1536599018102-9f803c140fc1?q=80&w=2400&auto=format&fit=crop)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(10,8,25,0.55) 0%, rgba(10,8,25,0.8) 100%)" }} />
        <div className="relative w-full max-w-6xl mx-auto px-8 py-24 grid md:grid-cols-2 gap-16 items-center">
          <PanelLabel n="07" name="Midnight Metropolis" blurb="A real Hong Kong dusk panorama under cyan and pink neon accents. Cyberpunk energy grounded in actual photography - feels like building software in a city that never sleeps." colors={["#0a0819", "#22d3ee", "#f472b6", "#e2e8f0"]} />
          <div className="rounded-xl p-8" style={{ background: "rgba(10,8,25,0.7)", border: "1px solid rgba(34,211,238,0.35)", boxShadow: "0 0 30px rgba(34,211,238,0.15)", backdropFilter: "blur(12px)" }}>
            <p className="text-[11px] mb-4" style={{ color: "#22d3ee" }}>[city@night ~]$ whoami</p>
            <h3 className="text-3xl font-bold" style={{ color: "#e2e8f0" }}>Juan Carlo <span style={{ color: "#f472b6" }}>Senin</span></h3>
            <p className="text-xs mt-2 mb-6" style={{ color: "rgba(226,232,240,0.55)" }}>Full Stack Developer | AI &amp; Automation</p>
            <div className="flex gap-3 mb-6">
              <span className="px-4 py-2 rounded text-xs" style={{ background: "rgba(34,211,238,0.15)", border: "1px solid rgba(34,211,238,0.5)", color: "#67e8f9" }}>Send Email</span>
              <span className="px-4 py-2 rounded text-xs" style={{ border: "1px solid rgba(244,114,182,0.5)", color: "#f9a8d4" }}>GitHub</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {["NEXT.JS", "AWS", "N8N", "CLAUDE"].map((t) => (
                <span key={t} className="text-[10px] px-2 py-0.5 rounded" style={{ background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.3)", color: "#67e8f9" }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────── 08 VIOLET COSMOS (photo) ───────────────────────── */}
      <section className="relative min-h-screen overflow-hidden flex items-center">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=2400&auto=format&fit=crop)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(12,6,24,0.35) 0%, rgba(12,6,24,0.75) 100%)" }} />
        <div className="relative w-full max-w-6xl mx-auto px-8 py-24 grid md:grid-cols-2 gap-16 items-center">
          <PanelLabel n="08" name="Violet Cosmos" blurb="A real milky-way panorama that happens to match your existing purple brand perfectly. Keeps your current identity but swaps CSS gradients for genuine astrophotography. Minimal migration, maximum upgrade." colors={["#0c0618", "#a855f7", "#fbbf24", "#ece9f6"]} />
          <div className="rounded-2xl border border-white/15 p-8" style={{ background: "rgba(12,6,24,0.6)", backdropFilter: "blur(12px)" }}>
            <p className="font-mono text-[11px] text-purple-300 mb-4">❯ stargazing --mode=shipping</p>
            <h3 className="text-3xl font-bold text-white">Juan Carlo <span className="text-purple-400">Senin</span></h3>
            <p className="font-mono text-xs mt-2 mb-6 text-white/55">Full Stack Developer | AI &amp; Automation</p>
            <div className="flex gap-3 mb-6">
              <span className="px-4 py-2 rounded-lg text-xs font-mono" style={{ background: "rgba(168,85,247,0.2)", border: "1px solid rgba(168,85,247,0.45)", color: "#d8b4fe" }}>Send Email</span>
              <span className="px-4 py-2 rounded-lg text-xs font-mono border border-white/20 text-white/70">GitHub</span>
            </div>
            <div className="flex flex-wrap gap-1.5 font-mono">
              {["NEXT JS", "AWS", "N8N", "CLAUDE"].map((t) => (
                <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/25 text-purple-200/80">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────── 09 CANYON GOLD (photo) ───────────────────────── */}
      <section className={`relative min-h-screen overflow-hidden flex items-center ${fraunces.className}`}>
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1509316785289-025f5b846b35?q=80&w=2400&auto=format&fit=crop)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(28,14,6,0.45) 0%, rgba(28,14,6,0.78) 100%)" }} />
        <div className="relative w-full max-w-6xl mx-auto px-8 py-24 grid md:grid-cols-2 gap-16 items-center">
          <PanelLabel n="09" name="Canyon Gold" blurb="Warm earth and monument-valley scale. Amber light, cream serif type, desert horizon. Feels grounded and timeless - the opposite of every cold blue tech site out there." colors={["#1c0e06", "#f59e0b", "#f3e9d4", "#7c4a21"]} />
          <div className="rounded-xl p-9" style={{ background: "rgba(28,14,6,0.65)", border: "1px solid rgba(245,158,11,0.35)", backdropFilter: "blur(10px)" }}>
            <p className="text-[11px] tracking-[0.3em] mb-4" style={{ color: "#f59e0b" }}>FULL STACK DEVELOPER</p>
            <h3 className="text-4xl font-semibold leading-tight" style={{ color: "#f3e9d4" }}>
              Juan Carlo <em className="italic" style={{ color: "#f59e0b" }}>Senin</em>
            </h3>
            <p className="text-sm mt-3 mb-7" style={{ color: "rgba(243,233,212,0.65)" }}>Building software that stands the test of time.</p>
            <div className="flex gap-3 mb-7">
              <span className="px-5 py-2 text-xs tracking-wider rounded" style={{ background: "#f59e0b", color: "#1c0e06" }}>SEND EMAIL</span>
              <span className="px-5 py-2 text-xs tracking-wider rounded border" style={{ borderColor: "rgba(243,233,212,0.4)", color: "#f3e9d4" }}>GITHUB</span>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[12px] italic" style={{ color: "rgba(243,233,212,0.55)" }}>
              <span>Next.js</span><span>AWS</span><span>n8n</span><span>Claude</span>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────── 10 DEEP FOREST (photo) ───────────────────────── */}
      <section className={`relative min-h-screen overflow-hidden flex items-center ${plexSans.className}`}>
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2400&auto=format&fit=crop)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(6,16,10,0.5) 0%, rgba(6,16,10,0.8) 100%)" }} />
        <div className="relative w-full max-w-6xl mx-auto px-8 py-24 grid md:grid-cols-2 gap-16 items-center">
          <PanelLabel n="10" name="Deep Forest" blurb="Sunlight through real woodland. Moss green and ivory with emerald accents - calm, organic, healthy. Communicates sustainability of the work: code that grows well and lasts." colors={["#06100a", "#34d399", "#f0f4ee", "#1f3d2c"]} />
          <div className="rounded-xl p-8" style={{ background: "rgba(6,16,10,0.65)", border: "1px solid rgba(52,211,153,0.3)", backdropFilter: "blur(12px)" }}>
            <p className={`text-[11px] mb-4 ${plexMono.className}`} style={{ color: "#34d399" }}>~/forest $ git log --author=&quot;jcvs&quot;</p>
            <h3 className="text-3xl font-semibold" style={{ color: "#f0f4ee" }}>Juan Carlo <span style={{ color: "#34d399" }}>Senin</span></h3>
            <p className="text-xs mt-2 mb-6" style={{ color: "rgba(240,244,238,0.6)" }}>Full Stack Developer | AI &amp; Automation</p>
            <div className="flex gap-3 mb-6">
              <span className="px-4 py-2 rounded text-xs" style={{ background: "rgba(52,211,153,0.18)", border: "1px solid rgba(52,211,153,0.45)", color: "#6ee7b7" }}>Send Email</span>
              <span className="px-4 py-2 rounded text-xs border" style={{ borderColor: "rgba(240,244,238,0.25)", color: "rgba(240,244,238,0.75)" }}>GitHub</span>
            </div>
            <div className={`flex flex-wrap gap-1.5 ${plexMono.className}`}>
              {["next.js", "aws", "n8n", "claude"].map((t) => (
                <span key={t} className="text-[10px] px-2 py-0.5 rounded" style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.25)", color: "#6ee7b7" }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────── FOOTER ───────────────────────── */}
      <footer className="py-16 text-center bg-black border-t border-white/10">
        <p className="font-mono text-sm text-neutral-400">
          Pick a number <span className="text-purple-400">01–10</span> and the whole site gets restyled in that direction.
        </p>
        <p className="font-mono text-[11px] text-neutral-600 mt-2">This page is unlisted and not indexed by search engines.</p>
      </footer>
    </main>
  );
}
