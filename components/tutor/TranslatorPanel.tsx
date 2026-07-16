"use client";

import { useEffect, useMemo, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeftRight,
  BookOpen,
  Copy,
  Download,
  Mic,
  Share2,
  Sparkles,
  Star,
  Volume2,
  X,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { LanguageSelect } from "@/components/ui/LanguageSelect";
import { AutoResizeTextarea } from "@/components/ui/AutoResizeTextarea";
import { SoundWave } from "@/components/ui/SoundWave";
import { EmptyState, ErrorState, Skeleton } from "@/components/ui/Primitives";
import { TutorBreakdownView } from "./TutorBreakdownView";
import { useTranslate } from "@/hooks/useTranslate";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import { useToast } from "@/hooks/useToast";
import { getLanguageByCode, toSpeechLocale } from "@/lib/languages";
import { cn, downloadTextFile, generateId } from "@/lib/utils";
import { recordTranslationStat } from "@/lib/storage";
import type { FavoriteWord, TranslationRecord } from "@/types";

const MAX_CHARACTERS = 3000;

interface TranslatorPanelProps {
  sourceLang: string;
  targetLang: string;
  onSourceLangChange: (code: string) => void;
  onTargetLangChange: (code: string) => void;
  onTranslated: (record: TranslationRecord) => void;
  onFavorite: (word: FavoriteWord) => void;
  isWordFavorited: (word: string, targetLang: string) => boolean;
  selectedRecord: TranslationRecord | null;
  autoStartVoice?: boolean;
  voiceRate: number;
  autoSpeak: boolean;
  quickMode?: boolean;
  onModeChange?: (mode: "quick" | "full") => void;
  initialQuery?: string;
}

export function TranslatorPanel({
  sourceLang,
  targetLang,
  onSourceLangChange,
  onTargetLangChange,
  onTranslated,
  onFavorite,
  isWordFavorited,
  selectedRecord,
  autoStartVoice = false,
  voiceRate,
  autoSpeak,
  quickMode = false,
  onModeChange,
  initialQuery,
}: TranslatorPanelProps) {
  const [quickResult, setQuickResult] = useState<string | null>(null);
  const [text, setText] = useState(initialQuery ?? "");
  const { showToast } = useToast();
  const { state, result, error, translate, reset } = useTranslate();
  const { isSupported: speechSupported, isSpeaking, speak, cancel } = useSpeechSynthesis();

  const recognitionLang = toSpeechLocale(sourceLang === "auto" ? "en" : sourceLang);
  const {
    isSupported: micSupported,
    isListening,
    interimTranscript,
    error: micError,
    start: startListening,
    stop: stopListening,
  } = useSpeechRecognition({
    lang: recognitionLang,
    onFinalResult: (transcript) => {
      setText((prev) => (prev ? `${prev} ${transcript}` : transcript));
    },
  });

  useEffect(() => {
    if (micError) showToast(micError, "error");
  }, [micError, showToast]);

  useEffect(() => {
    if (autoStartVoice && micSupported) {
      startListening();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStartVoice, micSupported]);

  useEffect(() => {
    if (selectedRecord) {
      setText(selectedRecord.sourceText);
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRecord]);

  // Auto-translate on mount if initialQuery is provided
  useEffect(() => {
    if (initialQuery && initialQuery.trim().length > 0) {
      // Need a small timeout to let state settle
      const timer = setTimeout(() => {
        void handleTranslate();
      }, 100);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  const characterCount = text.length;
  const isOverLimit = characterCount > MAX_CHARACTERS;
  const displayedText = isListening && interimTranscript ? `${text} ${interimTranscript}`.trim() : text;

  const canTranslate = text.trim().length > 0 && !isOverLimit && state !== "loading";

  async function handleTranslate() {
    if (!canTranslate) return;
    const trimmed = text.trim();

    if (quickMode) {
      // Fast path: translation only
      setQuickResult(null);
      try {
        const res = await fetch("/api/quick-translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: trimmed, sourceLang, targetLang }),
        });
        const payload = await res.json() as { data?: { translation: string }; error?: string };
        if (!res.ok || !payload.data) throw new Error(payload.error ?? "Translation failed.");
        const translation = payload.data.translation;
        setQuickResult(translation);
        const record: TranslationRecord = {
          id: generateId(),
          sourceText: trimmed,
          translatedText: translation,
          sourceLang,
          targetLang,
          timestamp: Date.now(),
        };
        onTranslated(record);
        recordTranslationStat(targetLang);
        if (autoSpeak) speak(translation, toSpeechLocale(targetLang), voiceRate);
      } catch (err) {
        showToast(err instanceof Error ? err.message : "Translation failed.", "error");
      }
      return;
    }

    // Full lesson path
    setQuickResult(null);
    const breakdown = await translate(trimmed, sourceLang, targetLang);
    if (breakdown) {
      const record: TranslationRecord = {
        id: generateId(),
        sourceText: trimmed,
        translatedText: breakdown.translation,
        sourceLang,
        targetLang,
        timestamp: Date.now(),
        tutor: breakdown,
      };
      onTranslated(record);
      recordTranslationStat(targetLang);
      if (autoSpeak) {
        speak(breakdown.translation, toSpeechLocale(targetLang), voiceRate);
      }
    } else if (error) {
      showToast(error, "error");
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      event.preventDefault();
      void handleTranslate();
    }
  }

  function handleClear() {
    setText("");
    reset();
    setQuickResult(null);
  }

  function handleSwap() {
    if (sourceLang === "auto") {
      showToast("Set a specific source language to swap.", "info");
      return;
    }
    onSourceLangChange(targetLang);
    onTargetLangChange(sourceLang);
    if (result) {
      setText(result.translation);
      reset();
    }
  }

  async function handleCopy() {
    if (!result) return;
    await navigator.clipboard.writeText(result.translation);
    showToast("Translation copied to clipboard.", "success");
  }

  function handleSpeak() {
    if (!result) return;
    if (isSpeaking) {
      cancel();
      return;
    }
    speak(result.translation, toSpeechLocale(targetLang), voiceRate);
  }

  function handleFavorite() {
    if (!result) return;
    onFavorite({
      id: generateId(),
      word: text.trim(),
      translation: result.translation,
      sourceLang,
      targetLang,
      meaning: result.vocabulary[0]?.meaning,
      timestamp: Date.now(),
    });
    showToast("Saved to favorite words.", "success");
  }

  function handleDownload() {
    if (!result) return;
    const target = getLanguageByCode(targetLang);
    const content = [
      `Konita AI — Translation`,
      `Source: ${text.trim()}`,
      `Translation (${target.name}): ${result.translation}`,
      ``,
      `Grammar explanation:`,
      result.grammarExplanation,
      ``,
      `Vocabulary:`,
      ...result.vocabulary.map((v) => `- ${v.word} (${v.partOfSpeech}): ${v.meaning}`),
      ``,
      `Pronunciation guide: ${result.pronunciationGuide}`,
      ``,
      `Example: ${result.exampleSentence}`,
      `Example translation: ${result.exampleSentenceTranslation}`,
      ``,
      `Common mistakes:`,
      ...result.commonMistakes.map((m) => `- ${m}`),
      ``,
      `Learning tips:`,
      ...result.learningTips.map((t) => `- ${t}`),
    ].join("\n");
    downloadTextFile("konita-ai-translation.txt", content);
    showToast("Downloaded as TXT.", "success");
  }

  async function handleShare() {
    if (!result) return;
    const shareData = { title: "Konita AI Translation", text: `${text.trim()} \u2192 ${result.translation}` };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // user cancelled — no action needed
      }
    } else {
      await navigator.clipboard.writeText(shareData.text);
      showToast("Sharing isn't supported here, so we copied it instead.", "info");
    }
  }

  const isFavorited = useMemo(
    () => (result ? isWordFavorited(text.trim(), targetLang) : false),
    [result, text, targetLang, isWordFavorited]
  );

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card className="flex flex-col p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <LanguageSelect
            value={sourceLang}
            onChange={onSourceLangChange}
            label="Source language"
            className="flex-1"
          />
          <button
            type="button"
            onClick={handleSwap}
            aria-label="Swap languages"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-base-800/60 text-mist-300 transition hover:border-emerald-400/40 hover:text-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
          >
            <ArrowLeftRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="relative mt-5 flex-1 rounded-3xl border border-white/[0.06] bg-base-900/40 p-4">
          <AutoResizeTextarea
            value={displayedText}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type, paste, or tap the microphone to speak..."
            aria-label="Text to translate"
            minHeight={180}
          />

          {isListening && (
            <div className="pointer-events-none absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1.5">
              <SoundWave active barCount={4} className="h-4" />
              <span className="font-mono text-[11px] text-emerald-300">Listening&hellip;</span>
            </div>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className={cn("text-xs font-mono", isOverLimit ? "text-red-400" : "text-mist-600")}>
            {characterCount} / {MAX_CHARACTERS}
          </span>
          <span className="hidden text-xs text-mist-600 sm:inline">Ctrl + Enter to translate</span>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2.5">
          <Button onClick={handleTranslate} disabled={!canTranslate} isLoading={state === "loading"} size="md">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Translate
          </Button>

          <Button
            variant={isListening ? "danger" : "secondary"}
            size="icon"
            onClick={() => (isListening ? stopListening() : startListening())}
            aria-label={isListening ? "Stop voice input" : "Start voice input"}
            aria-pressed={isListening}
            disabled={!micSupported}
            title={micSupported ? undefined : "Voice input isn't supported in this browser"}
          >
            <Mic className="h-4 w-4" aria-hidden="true" />
          </Button>

          <Button variant="ghost" size="sm" onClick={handleClear} disabled={!text}>
            <X className="h-4 w-4" aria-hidden="true" />
            Clear
          </Button>

          {/* Quick / Full Lesson mode toggle — lives inside the card */}
          <div className="ml-auto flex items-center gap-0.5 rounded-xl border border-white/[0.07] bg-white/[0.02] p-0.5">
            <button
              type="button"
              aria-pressed={quickMode}
              title="Quick — translation only, instant"
              className={cn(
                "flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium transition",
                quickMode ? "bg-emerald-500/15 text-emerald-300" : "text-mist-500 hover:text-mist-200"
              )}
              onClick={() => onModeChange?.("quick")}
            >
              <Zap className="h-3 w-3" aria-hidden="true" />
              Quick
            </button>
            <button
              type="button"
              aria-pressed={!quickMode}
              title="Full Lesson — grammar, vocab, tips"
              className={cn(
                "flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium transition",
                !quickMode ? "bg-emerald-500/15 text-emerald-300" : "text-mist-500 hover:text-mist-200"
              )}
              onClick={() => onModeChange?.("full")}
            >
              <BookOpen className="h-3 w-3" aria-hidden="true" />
              Full
            </button>
          </div>
        </div>
      </Card>

      <Card className="flex min-h-[420px] flex-col p-5 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <LanguageSelect
            value={targetLang}
            onChange={onTargetLangChange}
            excludeAuto
            label="Target language"
            className="max-w-[200px] flex-1 sm:max-w-xs"
          />
          {result ? (
            <div className="flex shrink-0 items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopy}
                aria-label="Copy translation"
                title="Copy translation"
              >
                <Copy className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSpeak}
                aria-label={isSpeaking ? "Stop speaking" : "Speak translation"}
                title={speechSupported ? "Speak translation" : "Text-to-speech isn't supported here"}
                disabled={!speechSupported}
              >
                <Volume2 className={cn("h-4 w-4", isSpeaking && "text-emerald-400")} aria-hidden="true" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleFavorite}
                aria-label="Save to favorite words"
                aria-pressed={isFavorited}
                title="Save to favorite words"
              >
                <Star className={cn("h-4 w-4", isFavorited && "fill-emerald-400 text-emerald-400")} aria-hidden="true" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleDownload} aria-label="Download as text file" title="Download as .txt">
                <Download className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleShare} aria-label="Share translation" title="Share translation">
                <Share2 className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          ) : (
            <h2 className="hidden font-display text-sm font-medium text-mist-100 sm:block">Translation &amp; Tutor</h2>
          )}
        </div>

        <div className="mt-4 flex-1 overflow-y-auto pr-1">
          <AnimatePresence mode="wait">
            {state === "loading" && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-4">
                <div className="flex items-center gap-2 text-sm text-emerald-300">
                  <SoundWave active barCount={4} className="h-4" />
                  Translating and preparing your lesson&hellip;
                </div>
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </motion.div>
            )}

            {state === "error" && (
              <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <ErrorState message={error ?? "Something went wrong."} onRetry={handleTranslate} />
              </motion.div>
            )}

            {state === "idle" && (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <EmptyState
                  icon={<Sparkles className="h-5 w-5" aria-hidden="true" />}
                  title="Ready when you are"
                  description="Your translation and full AI tutor breakdown will appear here."
                />
              </motion.div>
            )}

            {quickResult && (
              <motion.div key="quick-result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="rounded-3xl border border-emerald-400/20 bg-emerald-500/[0.06] p-5">
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-emerald-300/80">
                    {getLanguageByCode(targetLang).name}
                  </p>
                  <p className="mt-2 font-display text-2xl leading-snug text-emerald-100">{quickResult}</p>
                </div>
              </motion.div>
            )}

            {state === "success" && result && !quickMode && (
              <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-4">
                <div className="rounded-3xl border border-emerald-400/20 bg-emerald-500/[0.06] p-5">
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-emerald-300/80">
                    {getLanguageByCode(targetLang).name}
                  </p>
                  <p className="mt-2 font-display text-xl leading-snug text-emerald-100">{result.translation}</p>
                </div>
                <TutorBreakdownView breakdown={result} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>
    </div>
  );
}
