"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, Layers, MessagesSquare, Sparkles, Star } from "lucide-react";
import { Container } from "@/components/ui/Primitives";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { XpToast } from "@/components/ui/XpToast";
import { cn } from "@/lib/utils";
import { TranslatorPanel } from "@/components/tutor/TranslatorPanel";
import { ConversationMode } from "@/components/tutor/ConversationMode";
import { RecentTranslations } from "@/components/tutor/RecentTranslations";
import { FavoriteWords } from "@/components/tutor/FavoriteWords";
import { SettingsPopover } from "@/components/tutor/SettingsPopover";
import { AuthPromptModal } from "@/components/ui/AuthPromptModal";
import { useTranslationHistory } from "@/hooks/useTranslationHistory";
import { useProgress } from "@/hooks/useProgress";
import { DEFAULT_PREFERENCES, getPreferences, savePreferences } from "@/lib/storage";
import { useSession } from "next-auth/react";
import type { TranslationRecord, UserPreferences } from "@/types";

type Tab = "translate" | "conversation";
type TranslateMode = "quick" | "full";

export function TutorPageClient() {
  const searchParams = useSearchParams();
  const autoStartVoice = searchParams.get("voice") === "1";
  const initialQuery = searchParams.get("q") ?? "";
  const { data: session } = useSession();

  const [tab, setTab] = useState<Tab>("translate");
  const [translateMode, setTranslateMode] = useState<TranslateMode>("full");
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [selectedRecord, setSelectedRecord] = useState<TranslationRecord | null>(null);
  const [xpTrigger, setXpTrigger] = useState(0);
  const [sheetOpen, setSheetOpen] = useState<"recent" | "favorites" | null>(null);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [hasPrompted, setHasPrompted] = useState(false);

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
    
    if (!session && !hasPrompted) {
      setShowAuthPrompt(true);
      setHasPrompted(true);
    }
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
            Konita Tutor AI
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
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-400/10 dark:text-amber-300 text-amber-800">
                <Layers className="h-4 w-4" aria-hidden="true" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium dark:text-amber-200 text-amber-900">
                  {dueCount} word{dueCount === 1 ? "" : "s"} due for review today
                </p>
                <p className="text-xs dark:text-amber-200/60 text-amber-900/60">Tap to start your flashcard session →</p>
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

        {/* Main layout */}
        <div className="mx-auto max-w-4xl">
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
                onModeChange={setTranslateMode}
                initialQuery={initialQuery}
              />
            ) : (
              <ConversationMode
                targetLang={preferences.defaultTargetLang}
                onTargetLangChange={(code) => updatePreferences({ defaultTargetLang: code })}
                voiceRate={preferences.voiceRate}
              />
            )}
          </motion.div>
        </div>

        {/* Floating action buttons (History & Favorites) */}
        <div className="fixed bottom-6 right-4 z-30 flex flex-col gap-2 sm:bottom-8 sm:right-8">
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
      
      <AuthPromptModal 
        isOpen={showAuthPrompt} 
        onClose={() => setShowAuthPrompt(false)} 
        title="Sign in to save your progress"
        description="You're currently translating as a guest. Create a free account to save your vocabulary, track your streak, and access your history across all devices."
      />
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

