"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Clock, Layers, MessagesSquare, Sparkles, Star, Zap } from "lucide-react";
import { Container } from "@/components/ui/Primitives";
import { Button } from "@/components/ui/Button";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { XpToast } from "@/components/ui/XpToast";
import { cn } from "@/lib/utils";
import { TranslatorPanel } from "@/components/tutor/TranslatorPanel";
import { ConversationMode } from "@/components/tutor/ConversationMode";
import { RecentTranslations } from "@/components/tutor/RecentTranslations";
import { FavoriteWords } from "@/components/tutor/FavoriteWords";
import { SettingsPopover } from "@/components/tutor/SettingsPopover";
import { useTranslationHistory } from "@/hooks/useTranslationHistory";
import { useProgress } from "@/hooks/useProgress";
import { DEFAULT_PREFERENCES, getPreferences, savePreferences } from "@/lib/storage";
import type { TranslationRecord, UserPreferences } from "@/types";

type Tab = "translate" | "conversation";
type TranslateMode = "quick" | "full";

export function TutorPageClient() {
  const searchParams = useSearchParams();
  const autoStartVoice = searchParams.get("voice") === "1";

  const [tab, setTab] = useState<Tab>("translate");
  const [translateMode, setTranslateMode] = useState<TranslateMode>("full");
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [selectedRecord, setSelectedRecord] = useState<TranslationRecord | null>(null);
  const [xpTrigger, setXpTrigger] = useState(0);
  const [sheetOpen, setSheetOpen] = useState<"recent" | "favorites" | null>(null);

  const { recent, favorites, addRecent, deleteRecent, clearRecent, addFavorite, deleteFavorite } =
    useTranslationHistory();
  const { streak } = useProgress();

  // Count words due for SRS review
  const dueCount = favorites.filter((f) => !f.srsDueAt || f.srsDueAt <= Date.now()).length;

  useEffect(() => {
    setPreferences(getPreferences());
  }, []);

  function updatePreferences(patch: Partial<UserPreferences>) {
    setPreferences((prev) => {
      const next = { ...prev, ...patch };
      savePreferences(next);
      return next;
    });
  }

  function handleTranslated(record: TranslationRecord) {
    addRecent(record);
    setSelectedRecord(null);
    setXpTrigger((n) => n + 1);
  }

  function handleSelectRecent(record: TranslationRecord) {
    updatePreferences({ defaultSourceLang: record.sourceLang, defaultTargetLang: record.targetLang });
    setSelectedRecord(record);
  }

  function isWordFavorited(word: string, lang: string) {
    return favorites.some((f) => f.word.toLowerCase() === word.toLowerCase() && f.targetLang === lang);
  }

  return (
    <section className="pb-24 pt-16 sm:pt-20">
      <Container>
        {/* Header */}
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/5 px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.16em] text-emerald-300">
            AI Tutor
          </span>
          <h1 className="mt-5 font-display text-3xl font-medium text-mist-100 sm:text-4xl">
            Translate, then actually learn it
          </h1>
          <p className="mt-3 text-mist-400">
            Every translation comes with grammar, vocabulary, and pronunciation built in.
          </p>
        </div>

        {/* Daily review nudge */}
        {dueCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mb-6 max-w-2xl"
          >
            <Link
              href="/flashcards"
              className="flex items-center gap-4 rounded-2xl border border-amber-400/20 bg-amber-400/[0.05] px-5 py-3.5 transition-colors hover:bg-amber-400/[0.09]"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300">
                <Layers className="h-4 w-4" aria-hidden="true" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-amber-200">
                  {dueCount} word{dueCount === 1 ? "" : "s"} due for review today
                </p>
                <p className="text-xs text-amber-200/60">Tap to start your flashcard session →</p>
              </div>
            </Link>
          </motion.div>
        )}

        {/* Tab bar + settings */}
        <div className="mx-auto mb-8 flex max-w-fit items-center gap-2">
          <div className="flex gap-1 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-1">
            <TabButton
              active={tab === "translate"}
              onClick={() => setTab("translate")}
              icon={<Sparkles className="h-4 w-4" aria-hidden="true" />}
            >
              Translate
            </TabButton>
            <TabButton
              active={tab === "conversation"}
              onClick={() => setTab("conversation")}
              icon={<MessagesSquare className="h-4 w-4" aria-hidden="true" />}
            >
              Conversation
            </TabButton>
          </div>
          <SettingsPopover
            autoSpeak={preferences.autoSpeak}
            voiceRate={preferences.voiceRate}
            onAutoSpeakChange={(value) => updatePreferences({ autoSpeak: value })}
            onVoiceRateChange={(value) => updatePreferences({ voiceRate: value })}
          />
        </div>

        {/* Quick / Full toggle — only visible on translate tab */}
        {tab === "translate" && (
          <div className="mx-auto mb-6 flex max-w-fit items-center gap-1 rounded-xl border border-white/[0.07] bg-white/[0.02] p-1">
            <ModeButton
              active={translateMode === "quick"}
              onClick={() => setTranslateMode("quick")}
              icon={<Zap className="h-3.5 w-3.5" aria-hidden="true" />}
              label="Quick"
              hint="Translation only, instant"
            />
            <ModeButton
              active={translateMode === "full"}
              onClick={() => setTranslateMode("full")}
              icon={<BookOpen className="h-3.5 w-3.5" aria-hidden="true" />}
              label="Full Lesson"
              hint="Grammar, vocab, tips"
            />
          </div>
        )}

        {/* Main layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
          <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            {tab === "translate" ? (
              <TranslatorPanel
                sourceLang={preferences.defaultSourceLang}
                targetLang={preferences.defaultTargetLang}
                onSourceLangChange={(code) => updatePreferences({ defaultSourceLang: code })}
                onTargetLangChange={(code) => updatePreferences({ defaultTargetLang: code })}
                onTranslated={handleTranslated}
                onFavorite={addFavorite}
                isWordFavorited={isWordFavorited}
                selectedRecord={selectedRecord}
                autoStartVoice={autoStartVoice}
                voiceRate={preferences.voiceRate}
                autoSpeak={preferences.autoSpeak}
                quickMode={translateMode === "quick"}
              />
            ) : (
              <ConversationMode
                targetLang={preferences.defaultTargetLang}
                onTargetLangChange={(code) => updatePreferences({ defaultTargetLang: code })}
                voiceRate={preferences.voiceRate}
              />
            )}
          </motion.div>

          {/* Desktop sidebar */}
          <div className="hidden flex-col gap-6 lg:flex">
            <RecentTranslations items={recent} onSelect={handleSelectRecent} onDelete={deleteRecent} onClear={clearRecent} />
            <FavoriteWords items={favorites} onDelete={deleteFavorite} />
          </div>
        </div>

        {/* Mobile floating action buttons */}
        <div className="fixed bottom-6 right-4 z-30 flex flex-col gap-2 lg:hidden">
          <button
            type="button"
            onClick={() => setSheetOpen("favorites")}
            aria-label="Open favorite words"
            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-base-900/90 text-mist-300 shadow-lg backdrop-blur-xl transition hover:border-emerald-500/30 hover:text-emerald-300"
          >
            <Star className="h-5 w-5" aria-hidden="true" />
            {favorites.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-bold text-emerald-950">
                {favorites.length > 9 ? "9+" : favorites.length}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setSheetOpen("recent")}
            aria-label="Open recent translations"
            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-base-900/90 text-mist-300 shadow-lg backdrop-blur-xl transition hover:border-emerald-500/30 hover:text-emerald-300"
          >
            <Clock className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </Container>

      {/* Mobile bottom sheets */}
      <BottomSheet open={sheetOpen === "recent"} onClose={() => setSheetOpen(null)} title="Recent translations">
        <RecentTranslations
          items={recent}
          onSelect={(r) => { handleSelectRecent(r); setSheetOpen(null); }}
          onDelete={deleteRecent}
          onClear={clearRecent}
        />
      </BottomSheet>

      <BottomSheet open={sheetOpen === "favorites"} onClose={() => setSheetOpen(null)} title="Favorite words">
        <FavoriteWords items={favorites} onDelete={deleteFavorite} />
      </BottomSheet>

      {/* XP micro-animation */}
      <XpToast trigger={xpTrigger} streak={streak} />
    </section>
  );
}

function TabButton({
  active, onClick, icon, children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition",
        active ? "bg-emerald-500/15 text-emerald-300" : "text-mist-400 hover:text-mist-100"
      )}
    >
      {icon}
      {children}
    </button>
  );
}

function ModeButton({
  active, onClick, icon, label, hint,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  hint: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      title={hint}
      className={cn(
        "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition",
        active ? "bg-emerald-500/15 text-emerald-300" : "text-mist-500 hover:text-mist-200"
      )}
    >
      {icon}
      {label}
    </button>
  );
}
