import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GradientTextProps {
  children: ReactNode;
  className?: string;
  from?: string;
  to?: string;
}

export function GradientText({
  children,
  className,
  from = "#00dbde",
  to = "#fc00ff",
}: GradientTextProps) {
  return (
    <span
      className={cn("bg-clip-text text-transparent", className)}
      style={{
        background: `linear-gradient(90deg, ${from}, ${to})`,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
    >
      {children}
    </span>
  );
}


