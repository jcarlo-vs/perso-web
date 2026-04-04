"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface TechIconProps {
  name: string;
  icon: string;
  className?: string;
}

export function TechIcon({ name, icon, className }: TechIconProps) {
  return (
    <div
      className={cn(
        "group flex flex-col items-center justify-center",
        "w-24 h-24 p-3 rounded-xl",
        "border border-slate-700/40 bg-slate-900/30",
        "hover:border-neutral-500/40 hover:bg-slate-800/40",
        "transition-all duration-200 cursor-default",
        className
      )}
    >
      {/* Icon */}
      <div className="relative w-10 h-10 mb-2">
        <Image
          src={icon}
          alt={name}
          fill
          className="object-contain opacity-60 group-hover:opacity-100 transition-opacity duration-200"
        />
      </div>

      {/* Name */}
      <p className="text-[9px] font-medium text-center tracking-wider text-slate-500 group-hover:text-slate-300 transition-colors duration-200 leading-tight">
        {name}
      </p>
    </div>
  );
}
