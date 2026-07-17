"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mic, RotateCcw, Send, Sparkles, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { LanguageSelect } from "@/components/ui/LanguageSelect";
import { SoundWave } from "@/components/ui/SoundWave";
import { EmptyState } from "@/components/ui/Primitives";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import { useToast } from "@/hooks/useToast";
import { toSpeechLocale } from "@/lib/languages";
import { cn, generateId } from "@/lib/utils";
import { recordConversationStat } from "@/lib/storage";
import type { ConversationMessage } from "@/types";

interface ConversationAiResponse {
  reply: string;
  correction: { corrected: string; explanation: string } | null;
}

interface ConversationModeProps {
  targetLang: string;
  onTargetLangChange: (code: string) => void;
  voiceRate: number;
}

export function ConversationMode({ targetLang, onTargetLangChange, voiceRate }: ConversationModeProps) {
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();
  const { isSupported: speechSupported, isSpeaking, speak } = useSpeechSynthesis();

  const {
    isSupported: micSupported,
    isListening,
    start: startListening,
    stop: stopListening,
  } = useSpeechRecognition({
    lang: toSpeechLocale(targetLang),
    onFinalResult: (transcript) => setDraft((prev) => (prev ? `${prev} ${transcript}` : transcript)),
  });

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isSending]);

  async function sendMessage() {
    const trimmed = draft.trim();
    if (!trimmed || isSending) return;

    const userMessage: ConversationMessage = {
      id: generateId(),
      role: "user",
      content: trimmed,
      timestamp: Date.now(),
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setDraft("");
    setIsSending(true);

    try {
      const response = await fetch("/api/conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetLang,
          message: trimmed,
          history: nextMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const payload = (await response.json()) as { data?: ConversationAiResponse; error?: string };

      if (!response.ok || !payload.data) {
        throw new Error(payload.error ?? "The AI tutor couldn't reply. Please try again.");
      }

      const aiData = payload.data;

      setMessages((prev) => [
        ...prev.map((m) =>
          m.id === userMessage.id ? { ...m, correction: aiData.correction ?? null } : m
        ),
        {
          id: generateId(),
          role: "assistant",
          content: aiData.reply,
          timestamp: Date.now(),
        },
      ]);
      recordConversationStat();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong.";
      showToast(message, "error");
    } finally {
      setIsSending(false);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      event.preventDefault();
      void sendMessage();
    }
  }

  function handleReset() {
    setMessages([]);
    setDraft("");
  }

  return (
    <Card className="flex h-[640px] flex-col p-5 sm:p-6">
      <div className="flex flex-col gap-3 border-b border-white/[0.06] pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-300">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
          </div>
          <div>
            <h2 className="font-display text-base font-medium text-mist-100">Conversation practice</h2>
            <p className="text-xs text-mist-500">Chat naturally &mdash; Konita corrects you as you go.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSelect value={targetLang} onChange={onTargetLangChange} excludeAuto label="Practice language" className="w-44" />
          <Button variant="ghost" size="icon" onClick={handleReset} aria-label="Restart conversation" title="Restart conversation">
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>

      <div ref={scrollRef} className="mt-4 flex-1 space-y-4 overflow-y-auto pr-1">
        {messages.length === 0 ? (
          <EmptyState
            icon={<Sparkles className="h-5 w-5" aria-hidden="true" />}
            title="Say hello to get started"
            description="Type or speak a greeting in your practice language and Konita will reply."
          />
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn("flex flex-col gap-1.5", message.role === "user" ? "items-end" : "items-start")}
              >
                <div
                  className={cn(
                    "max-w-[85%] rounded-3xl px-4 py-3 text-sm leading-relaxed",
                    message.role === "user"
                      ? "bg-emerald-500/15 text-emerald-100"
                      : "border border-white/[0.06] bg-white/[0.03] text-mist-200"
                  )}
                >
                  <p>{message.content}</p>
                  {message.role === "assistant" && (
                    <button
                      type="button"
                      onClick={() => speak(message.content, toSpeechLocale(targetLang), voiceRate)}
                      disabled={!speechSupported}
                      aria-label="Speak this message"
                      className="mt-2 inline-flex items-center gap-1.5 text-xs text-emerald-400/80 transition hover:text-emerald-300 disabled:opacity-40"
                    >
                      <Volume2 className={cn("h-3.5 w-3.5", isSpeaking && "text-emerald-300")} aria-hidden="true" />
                      Listen
                    </button>
                  )}
                </div>
                {message.correction && (
                  <div className="max-w-[85%] rounded-2xl border border-amber-400/20 bg-amber-400/[0.06] px-4 py-2.5 text-xs dark:text-amber-200/90 text-amber-900/90">
                    <p className="font-medium">Suggested: {message.correction.corrected}</p>
                    <p className="mt-1 dark:text-amber-200/70 text-amber-900/70">{message.correction.explanation}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {isSending && (
          <div className="flex items-center gap-2 text-sm text-mist-500">
            <SoundWave active barCount={3} className="h-3.5" />
            Konita is typing&hellip;
          </div>
        )}
      </div>

      <div className="mt-4 flex items-end gap-2 border-t border-white/[0.06] pt-4">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder="Type your message..."
          aria-label="Conversation message"
          className="max-h-32 flex-1 resize-none rounded-2xl border border-white/10 bg-base-800/60 px-4 py-3 text-sm text-mist-100 placeholder:text-mist-500 focus:border-emerald-400/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
        />
        <Button
          variant={isListening ? "danger" : "secondary"}
          size="icon"
          onClick={() => (isListening ? stopListening() : startListening())}
          aria-label={isListening ? "Stop voice input" : "Start voice input"}
          disabled={!micSupported}
        >
          <Mic className="h-4 w-4" aria-hidden="true" />
        </Button>
        <Button onClick={sendMessage} disabled={!draft.trim() || isSending} isLoading={isSending} size="icon" aria-label="Send message">
          <Send className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </Card>
  );
}
