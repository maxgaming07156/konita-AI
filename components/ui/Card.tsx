import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-4xl border border-white/[0.07] bg-white/[0.03] shadow-panel backdrop-blur-2xl",
        className
      )}
      {...props}
    />
  );
}

export function CardGlow({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-4xl border border-white/[0.07] bg-white/[0.03] p-6 shadow-panel backdrop-blur-2xl transition-all duration-300 hover:border-emerald-400/30 hover:bg-white/[0.05]",
        className
      )}
      {...props}
    />
  );
}
