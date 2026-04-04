"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { HiArrowUpRight } from "react-icons/hi2";
import { X, ExternalLink, Github } from "lucide-react";

interface Project {
  title: string;
  description: string;
  image: string;
  technologies: string[];
  demoLink: string;
  githubLink: string;
}

export function ProjectCard({ project }: { project: Project }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glareX, setGlareX] = useState(50);
  const [glareY, setGlareY] = useState(50);
  const [modalOpen, setModalOpen] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current || modalOpen) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    setRotateX((y - centerY) / 12);
    setRotateY((centerX - x) / 12);
    setGlareX((x / rect.width) * 100);
    setGlareY((y / rect.height) * 100);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const closeModal = useCallback(() => setModalOpen(false), []);

  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = "hidden";
      const handleKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") closeModal();
      };
      window.addEventListener("keydown", handleKey);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKey);
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [modalOpen, closeModal]);

  const cardId = `project-${project.title}`;

  return (
    <>
      {/* Card slot — keeps space when card floats away */}
      <div className="min-w-[280px] flex-1 snap-start h-[360px]">
        {!modalOpen ? (
          <motion.div
            ref={cardRef}
            layoutId={cardId}
            className="h-full overflow-hidden rounded-xl"
            style={{ perspective: 800 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <motion.div
              animate={{ rotateX, rotateY }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
              className="relative h-full"
            >
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="group flex flex-col h-full w-full p-4 rounded-xl border border-white/[0.12] hover:border-purple-500/40 transition-all duration-300 relative overflow-hidden text-left cursor-pointer"
                style={{
                  background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.01) 100%)",
                  backdropFilter: "blur(12px) saturate(1.4)",
                  WebkitBackdropFilter: "blur(12px) saturate(1.4)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(255,255,255,0.02)",
                }}
              >
                {/* Glare */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10"
                  style={{
                    background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(168,85,247,0.08) 0%, transparent 60%)`,
                  }}
                />

                {/* Thumbnail */}
                <div className="relative w-full h-[160px] rounded-lg overflow-hidden bg-neutral-900 mb-3 group-hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] transition-shadow duration-300">
                  <Image src={project.image} alt={project.title} fill className="object-contain p-2 group-hover:scale-105 transition-transform duration-500" />
                </div>

                {/* Title + description */}
                <div className="flex items-start justify-between gap-2 flex-1 min-h-0">
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-white/90 group-hover:text-purple-300 transition-colors duration-200 truncate">{project.title}</h3>
                    <p className="text-[11px] text-neutral-600 mt-1 line-clamp-3 leading-relaxed">{project.description}</p>
                  </div>
                  <HiArrowUpRight className="w-3.5 h-3.5 text-neutral-700 group-hover:text-purple-400 shrink-0 mt-0.5 transition-all duration-200" />
                </div>

                {/* Tech tags */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {project.technologies.map((tech) => (
                    <span key={tech} className="text-[10px] text-neutral-600 group-hover:text-purple-300/80 px-1.5 py-0.5 rounded bg-white/[0.03] border border-white/6 group-hover:border-purple-500/30 group-hover:bg-purple-500/10 transition-colors duration-200">
                      {tech}
                    </span>
                  ))}
                </div>
              </button>
            </motion.div>
          </motion.div>
        ) : (
          // Empty ghost slot — dashed border where the card was
          <div className="h-full rounded-xl border border-dashed border-purple-500/15 bg-purple-500/[0.02]" />
        )}
      </div>

      {/* Floating modal */}
      <AnimatePresence>
        {modalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/40"
              onClick={closeModal}
            />

            {/* Floating card → modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6 pointer-events-none">
              <motion.div
                layoutId={cardId}
                className="w-full max-w-lg pointer-events-auto"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div
                  className="rounded-2xl overflow-hidden border border-white/[0.15]"
                  style={{
                    background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
                    backdropFilter: "blur(20px) saturate(1.8)",
                    WebkitBackdropFilter: "blur(20px) saturate(1.8)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.37), inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(255,255,255,0.04)",
                  }}
                >
                  {/* Image */}
                  <div className="relative w-full h-56 bg-white/[0.03] border-b border-white/[0.08]">
                    <Image src={project.image} alt={project.title} fill className="object-contain p-6" />
                    <button
                      type="button"
                      onClick={closeModal}
                      title="Close"
                      className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/50 backdrop-blur-sm text-neutral-400 hover:text-white border border-white/10 hover:border-white/20 transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Details */}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-white mb-2">{project.title}</h3>
                    <p className="text-sm text-neutral-400 leading-relaxed mb-4">{project.description}</p>

                    {/* Tech */}
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {project.technologies.map((tech) => (
                        <span key={tech} className="text-[11px] text-purple-300/80 px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20">
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <Link href={project.demoLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-purple-500/15 border border-purple-500/25 text-sm text-purple-300 hover:text-white hover:bg-purple-500/25 hover:border-purple-400/40 transition-colors">
                        <ExternalLink className="w-3.5 h-3.5" />
                        Live Demo
                      </Link>
                      <Link href={project.githubLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-white/10 text-sm text-neutral-400 hover:text-white hover:border-white/20 transition-colors">
                        <Github className="w-3.5 h-3.5" />
                        Source Code
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
