"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Volume2 } from "lucide-react";
import { Container, Skeleton } from "@/components/ui/Primitives";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Primitives";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import { getPreferences } from "@/lib/storage";
import { getLanguageByCode, toSpeechLocale } from "@/lib/languages";
import { getTodayKey } from "@/lib/utils";

interface WordOfDayData {
  phrase: string;
  translation: string;
  pronunciation: string;
  usageNote: string;
}

interface CachedWordOfDay {
  date: string;
  targetLang: string;
  data: WordOfDayData;
}

const CACHE_KEY = "konita:word-of-day";

export function WordOfTheDay() {
  const [data, setData] = useState<WordOfDayData | null>(null);
  const [targetLang, setTargetLang] = useState("es");
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const { isSupported: speechSupported, speak } = useSpeechSynthesis();

  useEffect(() => {
    const preferences = getPreferences();
    const lang = preferences.defaultTargetLang === "auto" ? "es" : preferences.defaultTargetLang;
    setTargetLang(lang);

    const today = getTodayKey();
    const cachedRaw = typeof window !== "undefined" ? localStorage.getItem(CACHE_KEY) : null;

    if (cachedRaw) {
      try {
        const cached = JSON.parse(cachedRaw) as CachedWordOfDay;
        if (cached.date === today && cached.targetLang === lang) {
          setData(cached.data);
          setStatus("ready");
          return;
        }
      } catch {
        // fall through to fetch a fresh phrase
      }
    }

    let cancelled = false;

    async function loadPhrase() {
      try {
        const response = await fetch("/api/word-of-day", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ targetLang: lang }),
        });
        const payload = (await response.json()) as { data?: WordOfDayData; error?: string };
        if (!response.ok || !payload.data) throw new Error(payload.error ?? "Failed to load");
        if (cancelled) return;

        setData(payload.data);
        setStatus("ready");
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ date: today, targetLang: lang, data: payload.data } satisfies CachedWordOfDay)
        );
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    void loadPhrase();
    return () => {
      cancelled = true;
    };
  }, []);

  if (status === "error") return null;

  return (
    <section className="pb-4">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <Card className="mx-auto flex max-w-2xl flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
            {status === "loading" || !data ? (
              <div className="flex w-full flex-col gap-3">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-7 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ) : (
              <>
                <div className="min-w-0">
                  <Badge>Phrase of the day &middot; {getLanguageByCode(targetLang).name}</Badge>
                  <p className="mt-3 font-display text-xl text-mist-100">{data.translation}</p>
                  <p className="mt-1 text-sm text-mist-500">
                    {data.phrase} &middot; <span className="font-mono text-emerald-300/80">{data.pronunciation}</span>
                  </p>
                  <p className="mt-2 text-sm text-mist-500">{data.usageNote}</p>
                </div>
                <button
                  type="button"
                  onClick={() => speak(data.translation, toSpeechLocale(targetLang))}
                  disabled={!speechSupported}
                  aria-label="Speak this phrase"
                  className="flex h-11 w-11 shrink-0 items-center justify-center self-start rounded-2xl border border-white/10 bg-base-800/60 text-emerald-300 transition hover:border-emerald-400/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 disabled:opacity-40 sm:self-center"
                >
                  <Volume2 className="h-4 w-4" aria-hidden="true" />
                </button>
              </>
            )}
          </Card>
        </motion.div>
      </Container>
    </section>
  );
}
