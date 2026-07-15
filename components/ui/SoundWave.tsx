"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SoundWaveProps {
  active?: boolean;
  className?: string;
  barCount?: number;
}

/**
 * The "language bridge" signature motif: a small set of bars that behave
 * like a live waveform. Used for the mic-listening state, the translate
 * loading state, and decoratively between language cards.
 */
export function SoundWave({ active = false, className, barCount = 5 }: SoundWaveProps) {
  const bars = Array.from({ length: barCount });

  return (
    <div className={cn("flex items-center justify-center gap-[3px]", className)} aria-hidden="true">
      {bars.map((_, index) => (
        <motion.span
          key={index}
          className="w-[3px] rounded-full bg-emerald-400"
          animate={
            active
              ? { height: ["30%", "100%", "45%", "80%", "30%"] }
              : { height: "30%" }
          }
          transition={{
            duration: 1.1,
            repeat: active ? Infinity : 0,
            delay: index * 0.09,
            ease: "easeInOut",
          }}
          style={{ height: "30%" }}
        />
      ))}
    </div>
  );
}
