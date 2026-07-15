"use client";

import { useCallback, useEffect, useState } from "react";
import { ACTIVITY_UPDATED_EVENT, DEFAULT_STATS, computeStreak, getActivityDates, getStats } from "@/lib/storage";
import type { Stats } from "@/types";

interface UseProgressReturn {
  stats: Stats;
  streak: number;
  isHydrated: boolean;
  refresh: () => void;
}

export function useProgress(): UseProgressReturn {
  const [stats, setStats] = useState<Stats>(DEFAULT_STATS);
  const [streak, setStreak] = useState(0);
  const [isHydrated, setIsHydrated] = useState(false);

  const refresh = useCallback(() => {
    setStats(getStats());
    setStreak(computeStreak(getActivityDates()));
  }, []);

  useEffect(() => {
    refresh();
    setIsHydrated(true);
    window.addEventListener(ACTIVITY_UPDATED_EVENT, refresh);
    return () => window.removeEventListener(ACTIVITY_UPDATED_EVENT, refresh);
  }, [refresh]);

  return { stats, streak, isHydrated, refresh };
}
