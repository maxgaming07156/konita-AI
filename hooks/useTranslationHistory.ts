"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import type { FavoriteWord, TranslationRecord } from "@/types";
import {
  type ExportBundle,
  addFavoriteWord,
  clearRecentTranslations,
  exportAllData,
  getFavoriteWords,
  getRecentTranslations,
  importAllData,
  removeFavoriteWord,
  removeRecentTranslation,
  saveRecentTranslation,
} from "@/lib/storage";

interface UseTranslationHistoryReturn {
  recent: TranslationRecord[];
  favorites: FavoriteWord[];
  isHydrated: boolean;
  addRecent: (record: TranslationRecord) => void;
  deleteRecent: (id: string) => void;
  clearRecent: () => void;
  addFavorite: (word: FavoriteWord) => void;
  deleteFavorite: (id: string) => void;
}

export function useTranslationHistory(): UseTranslationHistoryReturn {
  const { data: session, status } = useSession();
  const [recent, setRecent] = useState<TranslationRecord[]>([]);
  const [favorites, setFavorites] = useState<FavoriteWord[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const syncAttempted = useRef(false);

  // Sync logic
  const syncWithCloud = useCallback(async () => {
    if (status !== "authenticated" || syncAttempted.current) return;
    
    try {
      syncAttempted.current = true;
      const localBundle = exportAllData();
      
      const res = await fetch("/api/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(localBundle),
      });
      
      if (!res.ok) throw new Error("Sync failed");
      
      const payload = await res.json() as { data: ExportBundle };
      if (payload.data) {
        importAllData(payload.data);
        setRecent(payload.data.recent || []);
        setFavorites(payload.data.favorites || []);
      }
    } catch (err) {
      console.error("Failed to sync progress with cloud:", err);
    }
  }, [status]);

  useEffect(() => {
    // Load local first
    setRecent(getRecentTranslations());
    setFavorites(getFavoriteWords());
    setIsHydrated(true);

    // If logged in, trigger a sync to merge data and update local storage
    if (status === "authenticated" && !syncAttempted.current) {
      void syncWithCloud();
    }
  }, [status, syncWithCloud]);

  // The below functions update local storage instantly for a snappy UI.
  // The storage module itself now automatically triggers a background sync to cloud if authenticated.

  const addRecent = useCallback((record: TranslationRecord) => {
    setRecent(saveRecentTranslation(record));
  }, []);

  const deleteRecent = useCallback((id: string) => {
    setRecent(removeRecentTranslation(id));
  }, []);

  const clearRecent = useCallback(() => {
    clearRecentTranslations();
    setRecent([]);
  }, []);

  const addFavorite = useCallback((word: FavoriteWord) => {
    setFavorites(addFavoriteWord(word));
  }, []);

  const deleteFavorite = useCallback((id: string) => {
    setFavorites(removeFavoriteWord(id));
  }, []);

  return { recent, favorites, isHydrated, addRecent, deleteRecent, clearRecent, addFavorite, deleteFavorite };
}
