"use client";

import { useCallback, useEffect, useState } from "react";
import type { FavoriteWord, TranslationRecord } from "@/types";
import {
  addFavoriteWord,
  clearRecentTranslations,
  getFavoriteWords,
  getRecentTranslations,
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
  const [recent, setRecent] = useState<TranslationRecord[]>([]);
  const [favorites, setFavorites] = useState<FavoriteWord[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setRecent(getRecentTranslations());
    setFavorites(getFavoriteWords());
    setIsHydrated(true);
  }, []);

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
