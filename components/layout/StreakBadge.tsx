"use client";

import { Flame } from "lucide-react";
import { useProgress } from "@/hooks/useProgress";

export function StreakBadge() {
  const { streak, isHydrated } = useProgress();

  if (!isHydrated || streak === 0) return null;

  return (
    <span
      title={`${streak} day streak`}
      className="inline-flex items-center gap-1 rounded-full border border-amber-400/25 bg-amber-400/10 px-2.5 py-1 text-xs font-semibold text-amber-300"
    >
      <Flame className="h-3.5 w-3.5" aria-hidden="true" />
      {streak}
    </span>
  );
}
