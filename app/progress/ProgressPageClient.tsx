"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Download,
  Flame,
  Globe2,
  Languages,
  Layers,
  MessagesSquare,
  Star,
  Trophy,
  Upload,
} from "lucide-react";
import { Section, Container } from "@/components/ui/Primitives";
import { Card, CardGlow } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useProgress } from "@/hooks/useProgress";
import { useTranslationHistory } from "@/hooks/useTranslationHistory";
import { useToast } from "@/hooks/useToast";
import { getLanguageByCode } from "@/lib/languages";
import { downloadJsonFile } from "@/lib/utils";
import { exportAllData, importAllData } from "@/lib/storage";

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <CardGlow className="p-6">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-300">
        {icon}
      </div>
      <p className="mt-5 font-display text-3xl font-medium text-mist-100">{value}</p>
      <p className="mt-1 text-sm text-mist-500">{label}</p>
    </CardGlow>
  );
}

export function ProgressPageClient() {
  const { stats, streak, isHydrated } = useProgress();
  const { favorites } = useTranslationHistory();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dueCount, setDueCount] = useState(0);

  useEffect(() => {
    const now = Date.now();
    setDueCount(favorites.filter((f) => !f.srsDueAt || f.srsDueAt <= now).length);
  }, [favorites]);

  function handleExport() {
    const bundle = exportAllData();
    downloadJsonFile(`konita-ai-backup-${new Date().toISOString().slice(0, 10)}.json`, bundle);
    showToast("Backup downloaded.", "success");
  }

  function handleImportClick() {
    fileInputRef.current?.click();
  }

  async function handleFileSelected(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      importAllData(parsed);
      showToast("Backup restored. Reloading...", "success");
      window.setTimeout(() => window.location.reload(), 900);
    } catch {
      showToast("That file couldn't be imported. Make sure it's a Konita AI backup.", "error");
    }
  }

  return (
    <Section
      eyebrow="Your progress"
      title="How far you've come"
      description="A quick look at your learning activity — all of it stored only on this device."
      className="pt-20 sm:pt-28"
    >
      <Container className="!px-0">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          <StatCard icon={<Flame className="h-5 w-5" aria-hidden="true" />} label="Current streak (days)" value={isHydrated ? streak : "\u2014"} />
          <StatCard icon={<Trophy className="h-5 w-5" aria-hidden="true" />} label="Longest streak (days)" value={isHydrated ? stats.longestStreak : "\u2014"} />
          <StatCard icon={<Languages className="h-5 w-5" aria-hidden="true" />} label="Translations made" value={isHydrated ? stats.totalTranslations : "\u2014"} />
          <StatCard icon={<MessagesSquare className="h-5 w-5" aria-hidden="true" />} label="Conversation replies" value={isHydrated ? stats.totalConversationMessages : "\u2014"} />
          <StatCard icon={<Star className="h-5 w-5" aria-hidden="true" />} label="Favorite words saved" value={favorites.length} />
          <StatCard icon={<Globe2 className="h-5 w-5" aria-hidden="true" />} label="Languages practiced" value={isHydrated ? stats.languagesPracticed.length : "\u2014"} />
        </div>

        {isHydrated && stats.languagesPracticed.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {stats.languagesPracticed.map((code) => {
              const lang = getLanguageByCode(code);
              return (
                <span
                  key={code}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.02] px-3 py-1.5 text-xs text-mist-400"
                >
                  <span aria-hidden="true">{lang.flag}</span>
                  {lang.name}
                </span>
              );
            })}
          </div>
        )}

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card className="flex flex-col justify-between p-6">
            <div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-300">
                <Layers className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="mt-4 font-display text-lg font-medium text-mist-100">Flashcard review</h3>
              <p className="mt-2 text-sm leading-relaxed text-mist-500">
                {favorites.length === 0
                  ? "Save some favorite words from the AI Tutor to start building a review deck."
                  : dueCount > 0
                    ? `${dueCount} word${dueCount === 1 ? "" : "s"} ready for review today.`
                    : "You're all caught up — nothing is due right now."}
              </p>
            </div>
            <Link href="/flashcards" className="mt-5">
              <Button disabled={favorites.length === 0} className="w-full sm:w-auto">
                Review flashcards
              </Button>
            </Link>
          </Card>

          <Card className="flex flex-col justify-between p-6">
            <div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-300">
                <Download className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="mt-4 font-display text-lg font-medium text-mist-100">Back up your data</h3>
              <p className="mt-2 text-sm leading-relaxed text-mist-500">
                Everything lives in this browser only. Export a backup to move it to another device, or
                import a previous backup to restore it.
              </p>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button variant="secondary" onClick={handleExport}>
                <Download className="h-4 w-4" aria-hidden="true" />
                Export backup
              </Button>
              <Button variant="secondary" onClick={handleImportClick}>
                <Upload className="h-4 w-4" aria-hidden="true" />
                Import backup
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/json"
                onChange={handleFileSelected}
                className="hidden"
                aria-hidden="true"
              />
            </div>
          </Card>
        </div>
      </Container>
    </Section>
  );
}
