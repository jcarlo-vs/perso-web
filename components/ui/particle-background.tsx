"use client";

import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { ISourceOptions } from "@tsparticles/engine";

export function ParticleBackground() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const options: ISourceOptions = useMemo(
    () => ({
      fullScreen: false,
      fpsLimit: 60,
      particles: {
        number: {
          value: 60,
          density: {
            enable: true,
          },
        },
        color: {
          value: ["#a3a3a3", "#737373", "#525252"],
        },
        links: {
          enable: true,
          color: "#404040",
          distance: 150,
          opacity: 0.15,
          width: 1,
        },
        move: {
          enable: true,
          speed: 0.8,
          direction: "none" as const,
          random: true,
          straight: false,
          outModes: {
            default: "bounce" as const,
          },
        },
        opacity: {
          value: { min: 0.1, max: 0.4 },
          animation: {
            enable: true,
            speed: 0.5,
            sync: false,
          },
        },
        size: {
          value: { min: 1, max: 3 },
        },
        shape: {
          type: "circle",
        },
      },
      interactivity: {
        events: {
          onHover: {
            enable: true,
            mode: "grab",
          },
        },
        modes: {
          grab: {
            distance: 140,
            links: {
              opacity: 0.3,
              color: "#a3a3a3",
            },
          },
        },
      },
      detectRetina: true,
    }),
    []
  );

  if (!init) return null;

  return (
    <Particles
      id="hero-particles"
      className="absolute inset-0"
      options={options}
    />
  );
}
