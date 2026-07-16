"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Flame, Zap } from "lucide-react";

interface XpToastProps {
  /** Increment this to trigger a new animation */
  trigger: number;
  streak: number;
}

export function XpToast({ trigger, streak }: XpToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (trigger === 0) return;
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 2200);
    return () => clearTimeout(t);
  }, [trigger]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={trigger}
          initial={{ opacity: 0, y: 16, scale: 0.88 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.92 }}
          transition={{ type: "spring", stiffness: 400, damping: 24 }}
          className="pointer-events-none fixed bottom-8 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2.5 rounded-full border border-emerald-500/30 bg-base-950/90 px-5 py-2.5 shadow-glow backdrop-blur-xl"
          role="status"
          aria-live="polite"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300">
            <Zap className="h-3.5 w-3.5 fill-emerald-400" aria-hidden="true" />
          </span>
          <span className="font-display text-sm font-medium text-mist-100">+10 XP</span>
          {streak > 1 && (
            <>
              <span className="h-3.5 w-px bg-white/10" aria-hidden="true" />
              <span className="flex items-center gap-1 text-sm text-orange-300">
                <Flame className="h-3.5 w-3.5 fill-orange-400" aria-hidden="true" />
                {streak} day streak
              </span>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
