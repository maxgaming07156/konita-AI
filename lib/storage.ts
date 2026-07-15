import type { FavoriteWord, Stats, TranslationRecord, UserPreferences } from "@/types";
import { getTodayKey } from "@/lib/utils";

const KEYS = {
  recent: "konita:recent-translations",
  favorites: "konita:favorite-words",
  preferences: "konita:preferences",
  stats: "konita:stats",
  activity: "konita:activity-log",
} as const;

const MAX_RECENT = 30;

export const ACTIVITY_UPDATED_EVENT = "konita:activity-updated";

export const DEFAULT_PREFERENCES: UserPreferences = {
  defaultSourceLang: "auto",
  defaultTargetLang: "es",
  autoSpeak: false,
  voiceRate: 1,
};

export const DEFAULT_STATS: Stats = {
  totalTranslations: 0,
  totalConversationMessages: 0,
  languagesPracticed: [],
  longestStreak: 0,
};

// A word moves through these boxes as it's reviewed correctly; the number
// is the number of days until it's next due for review.
export const SRS_INTERVALS_DAYS = [0, 1, 3, 7, 14, 30, 60];

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function getRecentTranslations(): TranslationRecord[] {
  if (!isBrowser()) return [];
  return safeParse<TranslationRecord[]>(localStorage.getItem(KEYS.recent), []);
}

export function saveRecentTranslation(record: TranslationRecord): TranslationRecord[] {
  const current = getRecentTranslations();
  const updated = [record, ...current].slice(0, MAX_RECENT);
  if (isBrowser()) {
    localStorage.setItem(KEYS.recent, JSON.stringify(updated));
  }
  return updated;
}

export function clearRecentTranslations(): void {
  if (isBrowser()) localStorage.removeItem(KEYS.recent);
}

export function removeRecentTranslation(id: string): TranslationRecord[] {
  const updated = getRecentTranslations().filter((r) => r.id !== id);
  if (isBrowser()) localStorage.setItem(KEYS.recent, JSON.stringify(updated));
  return updated;
}

export function getFavoriteWords(): FavoriteWord[] {
  if (!isBrowser()) return [];
  return safeParse<FavoriteWord[]>(localStorage.getItem(KEYS.favorites), []);
}

export function addFavoriteWord(word: FavoriteWord): FavoriteWord[] {
  const current = getFavoriteWords();
  const exists = current.some(
    (f) => f.word.toLowerCase() === word.word.toLowerCase() && f.targetLang === word.targetLang
  );
  const withSrs: FavoriteWord = { srsBox: 0, srsDueAt: Date.now(), ...word };
  const updated = exists ? current : [withSrs, ...current];
  if (isBrowser()) localStorage.setItem(KEYS.favorites, JSON.stringify(updated));
  return updated;
}

export function removeFavoriteWord(id: string): FavoriteWord[] {
  const updated = getFavoriteWords().filter((f) => f.id !== id);
  if (isBrowser()) localStorage.setItem(KEYS.favorites, JSON.stringify(updated));
  return updated;
}

export function isWordFavorited(word: string, targetLang: string): boolean {
  return getFavoriteWords().some(
    (f) => f.word.toLowerCase() === word.toLowerCase() && f.targetLang === targetLang
  );
}

export function updateFavoriteSrs(id: string, box: number, dueAt: number): FavoriteWord[] {
  const updated = getFavoriteWords().map((f) => (f.id === id ? { ...f, srsBox: box, srsDueAt: dueAt } : f));
  if (isBrowser()) localStorage.setItem(KEYS.favorites, JSON.stringify(updated));
  return updated;
}

export function getPreferences(): UserPreferences {
  if (!isBrowser()) return DEFAULT_PREFERENCES;
  return safeParse<UserPreferences>(localStorage.getItem(KEYS.preferences), DEFAULT_PREFERENCES);
}

export function savePreferences(prefs: UserPreferences): void {
  if (isBrowser()) localStorage.setItem(KEYS.preferences, JSON.stringify(prefs));
}

export function getStats(): Stats {
  if (!isBrowser()) return DEFAULT_STATS;
  return safeParse<Stats>(localStorage.getItem(KEYS.stats), DEFAULT_STATS);
}

function saveStats(stats: Stats): void {
  if (isBrowser()) localStorage.setItem(KEYS.stats, JSON.stringify(stats));
}

export function getActivityDates(): string[] {
  if (!isBrowser()) return [];
  return safeParse<string[]>(localStorage.getItem(KEYS.activity), []);
}

/**
 * Computes the current streak. Gives a grace period for "today" — if the
 * most recent activity was yesterday, the streak is still shown as active
 * (it only breaks once a full day is missed).
 */
export function computeStreak(dates: string[]): number {
  const set = new Set(dates);
  let streak = 0;
  const cursor = new Date();

  if (!set.has(getTodayKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
    if (!set.has(getTodayKey(cursor))) return 0;
  }

  while (set.has(getTodayKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

function recordActivity(): void {
  if (!isBrowser()) return;
  const dates = getActivityDates();
  const today = getTodayKey();
  if (!dates.includes(today)) {
    const updated = [...dates, today].sort();
    localStorage.setItem(KEYS.activity, JSON.stringify(updated));
  }
  const streak = computeStreak(getActivityDates());
  const stats = getStats();
  if (streak > stats.longestStreak) {
    saveStats({ ...stats, longestStreak: streak });
  }
  window.dispatchEvent(new Event(ACTIVITY_UPDATED_EVENT));
}

export function recordTranslationStat(targetLang: string): Stats {
  const stats = getStats();
  const languagesPracticed = stats.languagesPracticed.includes(targetLang)
    ? stats.languagesPracticed
    : [...stats.languagesPracticed, targetLang];
  const updated: Stats = { ...stats, totalTranslations: stats.totalTranslations + 1, languagesPracticed };
  saveStats(updated);
  recordActivity();
  return updated;
}

export function recordConversationStat(): Stats {
  const stats = getStats();
  const updated: Stats = { ...stats, totalConversationMessages: stats.totalConversationMessages + 1 };
  saveStats(updated);
  recordActivity();
  return updated;
}

export interface ExportBundle {
  version: 1;
  exportedAt: number;
  recent: TranslationRecord[];
  favorites: FavoriteWord[];
  preferences: UserPreferences;
  stats: Stats;
  activity: string[];
}

export function exportAllData(): ExportBundle {
  return {
    version: 1,
    exportedAt: Date.now(),
    recent: getRecentTranslations(),
    favorites: getFavoriteWords(),
    preferences: getPreferences(),
    stats: getStats(),
    activity: getActivityDates(),
  };
}

export function importAllData(bundle: unknown): void {
  if (!isBrowser()) return;

  if (typeof bundle !== "object" || bundle === null) {
    throw new Error("That file doesn't look like a Konita AI backup.");
  }

  const data = bundle as Partial<ExportBundle>;

  if (!Array.isArray(data.recent) || !Array.isArray(data.favorites) || !data.preferences) {
    throw new Error("That file doesn't look like a Konita AI backup.");
  }

  localStorage.setItem(KEYS.recent, JSON.stringify(data.recent));
  localStorage.setItem(KEYS.favorites, JSON.stringify(data.favorites));
  localStorage.setItem(KEYS.preferences, JSON.stringify(data.preferences));
  if (data.stats) localStorage.setItem(KEYS.stats, JSON.stringify(data.stats));
  if (Array.isArray(data.activity)) localStorage.setItem(KEYS.activity, JSON.stringify(data.activity));

  window.dispatchEvent(new Event(ACTIVITY_UPDATED_EVENT));
}
