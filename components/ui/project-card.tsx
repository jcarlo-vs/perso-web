"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "./badge";
import { cn } from "@/lib/utils";
import { ExternalLink, Github } from "lucide-react";

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  technologies: string[];
  demoLink: string;
  githubLink: string;
  index: number;
}

export function ProjectCard({
  title,
  description,
  image,
  technologies,
  demoLink,
  githubLink,
  index,
}: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setRotateX((y - centerY) / 20);
    setRotateY((centerX - x) / 20);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const reverse = index % 2 !== 0;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay: index * 0.15 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1000 }}
      className="w-full group"
      data-cursor-hover
    >
      <motion.div
        animate={{ rotateX, rotateY }}
        transition={{ type: "spring", stiffness: 200, damping: 30 }}
        className={cn(
          "relative overflow-hidden rounded-2xl",
          "border border-white/[0.06] bg-white/[0.02]",
          "hover:border-purple-500/20",
          "transition-colors duration-300"
        )}
      >
        <div
          className={cn(
            "flex flex-col lg:flex-row gap-0",
            reverse && "lg:flex-row-reverse"
          )}
        >
          {/* Image Section */}
          <div className="relative w-full lg:w-1/2 h-64 lg:h-auto min-h-[280px] bg-gradient-to-br from-purple-950/10 to-black/40 flex items-center justify-center overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/3 rounded-full blur-3xl" />

            <div className="relative w-[80%] h-[80%] group-hover:scale-105 transition-transform duration-500">
              <Image
                src={image}
                alt={title}
                fill
                className="object-contain drop-shadow-2xl"
              />
            </div>
          </div>

          {/* Content Section */}
          <div className="w-full lg:w-1/2 p-8 lg:p-10 flex flex-col justify-center">
            <h3 className="text-xl lg:text-2xl font-bold mb-3 text-white group-hover:text-purple-300 transition-colors duration-300">
              {title}
            </h3>

            <p className="text-slate-400 mb-6 leading-relaxed text-sm">
              {description}
            </p>

            {/* Technologies */}
            <div className="flex flex-wrap gap-2 mb-8">
              {technologies.map((tech, i) => (
                <Badge
                  key={i}
                  variant="outline"
                  className="border-purple-500/20 text-purple-300/80 bg-purple-500/5 text-xs"
                >
                  {tech}
                </Badge>
              ))}
            </div>

            {/* Links */}
            <div className="flex flex-wrap gap-3">
              <Link
                href={demoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition-colors duration-200"
                data-cursor-hover
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Live Demo
              </Link>
              <Link
                href={githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 hover:border-purple-500/30 text-slate-300 hover:text-white text-sm font-medium transition-all duration-200"
                data-cursor-hover
              >
                <Github className="w-3.5 h-3.5" />
                GitHub
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
