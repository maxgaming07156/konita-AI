"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { MessagesSquare, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Primitives";
import { cn } from "@/lib/utils";
import { TranslatorPanel } from "@/components/tutor/TranslatorPanel";
import { ConversationMode } from "@/components/tutor/ConversationMode";
import { RecentTranslations } from "@/components/tutor/RecentTranslations";
import { FavoriteWords } from "@/components/tutor/FavoriteWords";
import { SettingsPopover } from "@/components/tutor/SettingsPopover";
import { useTranslationHistory } from "@/hooks/useTranslationHistory";
import { DEFAULT_PREFERENCES, getPreferences, savePreferences } from "@/lib/storage";
import type { TranslationRecord, UserPreferences } from "@/types";

type Tab = "translate" | "conversation";

export function TutorPageClient() {
  const searchParams = useSearchParams();
  const autoStartVoice = searchParams.get("voice") === "1";

  const [tab, setTab] = useState<Tab>("translate");
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [selectedRecord, setSelectedRecord] = useState<TranslationRecord | null>(null);

  const { recent, favorites, addRecent, deleteRecent, clearRecent, addFavorite, deleteFavorite } =
    useTranslationHistory();

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
        <div className="mx-auto mb-10 max-w-2xl text-center">
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

        <div className="mx-auto mb-8 flex max-w-fit items-center gap-2">
          <div className="flex gap-1 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-1">
            <TabButton active={tab === "translate"} onClick={() => setTab("translate")} icon={<Sparkles className="h-4 w-4" aria-hidden="true" />}>
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
              />
            ) : (
              <ConversationMode
                targetLang={preferences.defaultTargetLang}
                onTargetLangChange={(code) => updatePreferences({ defaultTargetLang: code })}
                voiceRate={preferences.voiceRate}
              />
            )}
          </motion.div>

          <div className="flex flex-col gap-6">
            <RecentTranslations items={recent} onSelect={handleSelectRecent} onDelete={deleteRecent} onClear={clearRecent} />
            <FavoriteWords items={favorites} onDelete={deleteFavorite} />
          </div>
        </div>
      </Container>
    </section>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  children,
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
