"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle2, PartyPopper, RotateCcw, Volume2 } from "lucide-react";
import { Section, Container, EmptyState } from "@/components/ui/Primitives";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import { getFavoriteWords, updateFavoriteSrs, SRS_INTERVALS_DAYS } from "@/lib/storage";
import { getLanguageByCode, toSpeechLocale } from "@/lib/languages";
import { cn } from "@/lib/utils";
import type { FavoriteWord } from "@/types";

const DAY_MS = 24 * 60 * 60 * 1000;

function nextDueAt(box: number): number {
  const clampedBox = Math.min(box, SRS_INTERVALS_DAYS.length - 1);
  const days = SRS_INTERVALS_DAYS[clampedBox] ?? 0;
  return Date.now() + days * DAY_MS;
}

export function FlashcardsClient() {
  const [allFavorites, setAllFavorites] = useState<FavoriteWord[]>([]);
  const [queue, setQueue] = useState<FavoriteWord[]>([]);
  const [reviewAll, setReviewAll] = useState(false);
  const [index, setIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [isHydrated, setIsHydrated] = useState(false);
  const { isSupported: speechSupported, speak } = useSpeechSynthesis();

  useEffect(() => {
    const favorites = getFavoriteWords();
    setAllFavorites(favorites);
    const due = favorites.filter((f) => !f.srsDueAt || f.srsDueAt <= Date.now());
    setQueue(due);
    setIsHydrated(true);
  }, []);

  function startReviewAll() {
    setReviewAll(true);
    setQueue(allFavorites);
    setIndex(0);
    setIsFlipped(false);
    setReviewedCount(0);
  }

  const current = queue[index];
  const isComplete = isHydrated && queue.length > 0 && index >= queue.length;
  const progressLabel = queue.length > 0 ? `${Math.min(index + 1, queue.length)} / ${queue.length}` : "0 / 0";

  function handleAnswer(gotIt: boolean) {
    if (!current) return;
    const currentBox = current.srsBox ?? 0;
    const nextBox = gotIt ? currentBox + 1 : 0;
    const dueAt = gotIt ? nextDueAt(nextBox) : Date.now() + DAY_MS;
    updateFavoriteSrs(current.id, nextBox, dueAt);
    setReviewedCount((c) => c + 1);
    setIsFlipped(false);
    setIndex((i) => i + 1);
  }

  function handleRestart() {
    const favorites = getFavoriteWords();
    setAllFavorites(favorites);
    const due = favorites.filter((f) => !f.srsDueAt || f.srsDueAt <= Date.now());
    setQueue(reviewAll ? favorites : due);
    setIndex(0);
    setIsFlipped(false);
    setReviewedCount(0);
  }

  const targetLocale = useMemo(() => (current ? toSpeechLocale(current.targetLang) : "en-US"), [current]);

  return (
    <Section eyebrow="Study" title="Flashcard review" className="pt-20 sm:pt-28">
      <Container className="!px-0">
        <div className="mx-auto max-w-xl">
          <Link href="/progress" className="mb-6 inline-flex items-center gap-1.5 text-sm text-mist-500 transition hover:text-emerald-300">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to progress
          </Link>

          {!isHydrated ? null : allFavorites.length === 0 ? (
            <Card className="p-8">
              <EmptyState
                title="No favorite words yet"
                description="Save words from the AI Tutor's translation results, then come back here to review them."
              />
            </Card>
          ) : queue.length === 0 && !isComplete ? (
            <Card className="flex flex-col items-center gap-4 p-10 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-300">
                <PartyPopper className="h-6 w-6" aria-hidden="true" />
              </div>
              <h2 className="font-display text-xl font-medium text-mist-100">You&apos;re all caught up</h2>
              <p className="max-w-sm text-sm text-mist-500">
                Nothing is due for review right now. Come back later, or review everything anyway for extra
                practice.
              </p>
              <Button variant="secondary" onClick={startReviewAll}>
                Review all {allFavorites.length} words
              </Button>
            </Card>
          ) : isComplete ? (
            <Card className="flex flex-col items-center gap-4 p-10 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-300">
                <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
              </div>
              <h2 className="font-display text-xl font-medium text-mist-100">Session complete</h2>
              <p className="text-sm text-mist-500">You reviewed {reviewedCount} word{reviewedCount === 1 ? "" : "s"}.</p>
              <div className="mt-2 flex gap-3">
                <Button variant="secondary" onClick={handleRestart}>
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  Review again
                </Button>
                <Link href="/progress">
                  <Button>Back to progress</Button>
                </Link>
              </div>
            </Card>
          ) : current ? (
            <div>
              <div className="mb-4 flex items-center justify-between text-xs text-mist-500">
                <span>{progressLabel}</span>
                <span>{getLanguageByCode(current.targetLang).name}</span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  <button
                    type="button"
                    onClick={() => setIsFlipped((f) => !f)}
                    className="flex min-h-[280px] w-full flex-col items-center justify-center gap-4 rounded-4xl border border-white/[0.07] bg-white/[0.03] p-10 text-center shadow-panel backdrop-blur-2xl transition hover:border-emerald-400/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
                    aria-label={isFlipped ? "Show word" : "Reveal translation"}
                  >
                    {!isFlipped ? (
                      <>
                        <span className="text-xs font-medium uppercase tracking-[0.14em] text-emerald-300/80">
                          {getLanguageByCode(current.targetLang).name}
                        </span>
                        <p className="font-display text-3xl text-mist-100">{current.translation}</p>
                        <p className="mt-2 text-xs text-mist-600">Tap to reveal</p>
                      </>
                    ) : (
                      <>
                        <span className="text-xs font-medium uppercase tracking-[0.14em] text-mist-500">Meaning</span>
                        <p className="font-display text-2xl text-emerald-300">{current.word}</p>
                        {current.meaning && <p className="text-sm text-mist-500">{current.meaning}</p>}
                      </>
                    )}
                  </button>
                </motion.div>
              </AnimatePresence>

              <div className="mt-5 flex items-center justify-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => speak(current.translation, targetLocale)}
                  disabled={!speechSupported}
                  aria-label="Speak this word"
                >
                  <Volume2 className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>

              {isFlipped && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 flex justify-center gap-3"
                >
                  <Button variant="secondary" onClick={() => handleAnswer(false)} className={cn("min-w-[140px]")}>
                    Still learning
                  </Button>
                  <Button onClick={() => handleAnswer(true)} className="min-w-[140px]">
                    Got it
                  </Button>
                </motion.div>
              )}
            </div>
          ) : null}
        </div>
      </Container>
    </Section>
  );
}
