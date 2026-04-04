"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { motion } from "framer-motion";

interface SectionProps {
  id: string;
  children: ReactNode;
  className?: string;
  containerClassName?: string;
}

export function Section({
  id,
  children,
  className,
  containerClassName,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "min-h-screen flex items-center py-20 scroll-mt-0",
        // On XL screens, add padding for sidebars (profile card ~320px left, nav ~80px right)
        "xl:pl-[340px] xl:pr-[100px]",
        // Center content on smaller screens
        "justify-center",
        // Snap scrolling
        "snap-start snap-always",
        containerClassName
      )}
    >
      <div className={cn("w-full max-w-3xl px-6 md:px-8", className)}>
        {children}
      </div>
    </section>
  );
}

interface SectionHeaderProps {
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  className?: string;
}

export function SectionHeader({
  icon,
  title,
  subtitle,
  className,
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn("mb-12", className)}
    >
      {icon && <div className="mb-4 text-purple-500">{icon}</div>}
      <h2 className="text-4xl md:text-5xl font-bold mb-4">{title}</h2>
      {subtitle && (
        <p className="text-lg text-muted-foreground">{subtitle}</p>
      )}
    </motion.div>
  );
}
