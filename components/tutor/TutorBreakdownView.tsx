"use client";

import { motion } from "framer-motion";
import {
  AlertCircle,
  BookOpenText,
  Lightbulb,
  MessageCircleQuestion,
  MicVocal,
  SpellCheck2,
} from "lucide-react";
import type { TutorBreakdown } from "@/types";
import { Badge } from "@/components/ui/Primitives";

interface TutorBreakdownViewProps {
  breakdown: TutorBreakdown;
}

function BreakdownBlock({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-white/[0.06] bg-white/[0.02] p-5">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-300">
          {icon}
        </div>
        <h3 className="font-display text-base font-medium text-mist-100">{title}</h3>
      </div>
      <div className="mt-3 text-sm leading-relaxed text-mist-400">{children}</div>
    </div>
  );
}

export function TutorBreakdownView({ breakdown }: TutorBreakdownViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col gap-4"
    >
      {breakdown.detectedSourceLanguage && (
        <div>
          <Badge>Detected: {breakdown.detectedSourceLanguage}</Badge>
        </div>
      )}

      <BreakdownBlock icon={<SpellCheck2 className="h-4 w-4" aria-hidden="true" />} title="Grammar explanation">
        <p>{breakdown.grammarExplanation}</p>
      </BreakdownBlock>

      <BreakdownBlock icon={<BookOpenText className="h-4 w-4" aria-hidden="true" />} title="Vocabulary breakdown">
        <ul className="flex flex-col gap-2">
          {breakdown.vocabulary.map((item) => (
            <li key={item.word} className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <span className="font-semibold text-emerald-300">{item.word}</span>
              <span className="text-xs uppercase tracking-wide text-mist-600">{item.partOfSpeech}</span>
              <span className="text-mist-400">&mdash; {item.meaning}</span>
            </li>
          ))}
        </ul>
      </BreakdownBlock>

      <BreakdownBlock icon={<MicVocal className="h-4 w-4" aria-hidden="true" />} title="Pronunciation guide">
        <p className="font-mono text-emerald-200">{breakdown.pronunciationGuide}</p>
      </BreakdownBlock>

      <BreakdownBlock icon={<MessageCircleQuestion className="h-4 w-4" aria-hidden="true" />} title="Example sentence">
        <p className="text-mist-200">{breakdown.exampleSentence}</p>
        <p className="mt-1 text-mist-500">{breakdown.exampleSentenceTranslation}</p>
      </BreakdownBlock>

      <BreakdownBlock icon={<AlertCircle className="h-4 w-4" aria-hidden="true" />} title="Common mistakes">
        <ul className="flex flex-col gap-1.5">
          {breakdown.commonMistakes.map((mistake) => (
            <li key={mistake} className="flex gap-2">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-mist-600" aria-hidden="true" />
              <span>{mistake}</span>
            </li>
          ))}
        </ul>
      </BreakdownBlock>

      <BreakdownBlock icon={<Lightbulb className="h-4 w-4" aria-hidden="true" />} title="Learning tips">
        <ul className="flex flex-col gap-1.5">
          {breakdown.learningTips.map((tip) => (
            <li key={tip} className="flex gap-2">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-emerald-500" aria-hidden="true" />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </BreakdownBlock>
    </motion.div>
  );
}
