"use client";

import { motion } from "framer-motion";
import { Mic, BookOpen } from "lucide-react";
import { Section } from "@/components/ui/Primitives";
import { SoundWave } from "@/components/ui/SoundWave";

const STEPS = [
  {
    number: "01",
    title: "Speak or type",
    description: "Enter text or tap the microphone and speak naturally in any language.",
    Visual: () => (
      <div className="flex h-16 w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 shadow-inner">
        <Mic className="h-5 w-5 text-mist-400" />
        <div className="h-2 flex-1 rounded-full bg-white/10" />
        <div className="h-6 w-12 rounded-full bg-emerald-500/20" />
      </div>
    ),
  },
  {
    number: "02",
    title: "Instant translation",
    description: "Konita translates your words accurately and reads them aloud.",
    Visual: () => (
      <div className="flex h-16 w-full items-center justify-between rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-4 shadow-inner">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-[10px]">🇪🇸</span>
          <div className="h-2 w-16 rounded-full bg-emerald-500/40" />
        </div>
        <SoundWave active barCount={3} className="h-4 text-emerald-400" />
      </div>
    ),
  },
  {
    number: "03",
    title: "Learn the rules",
    description: "Review grammar notes, vocabulary, and pronunciation instantly.",
    Visual: () => (
      <div className="flex h-16 w-full items-center gap-2 rounded-2xl border border-blue-500/20 bg-blue-500/5 px-4 shadow-inner">
        <div className="flex items-center gap-1.5 rounded-md bg-blue-500/10 px-2 py-1">
          <BookOpen className="h-3 w-3 text-blue-400" />
          <div className="h-1.5 w-8 rounded-full bg-blue-400/50" />
        </div>
        <div className="flex items-center gap-1.5 rounded-md bg-amber-500/10 px-2 py-1">
          <div className="h-1.5 w-10 rounded-full bg-amber-400/50" />
        </div>
      </div>
    ),
  },
  {
    number: "04",
    title: "Practice in context",
    description: "Chat with AI Tutor, get gentle corrections, and build confidence.",
    Visual: () => (
      <div className="flex h-16 w-full flex-col justify-center gap-2 rounded-2xl border border-purple-500/20 bg-purple-500/5 px-4 shadow-inner">
        <div className="h-4 w-2/3 rounded-t-lg rounded-br-lg bg-white/10" />
        <div className="ml-auto h-4 w-1/2 rounded-t-lg rounded-bl-lg bg-purple-500/30" />
      </div>
    ),
  },
];

export function HowItWorks() {
  return (
    <Section
      eyebrow="How it works"
      title="From a single sentence to real fluency"
      description="Each translation moves you one step closer to actually knowing the language."
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step, index) => (
          <motion.div
            key={step.number}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="group relative flex flex-col justify-between overflow-hidden rounded-4xl border border-white/[0.06] bg-white/[0.02] p-6 hover:bg-white/[0.04] transition-colors"
          >
            <div>
              <span className="font-display text-4xl font-medium text-emerald-500/25 transition-colors group-hover:text-emerald-500/40">{step.number}</span>
              <h3 className="mt-4 font-display text-lg font-medium text-mist-100">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-mist-500">{step.description}</p>
            </div>
            <div className="mt-8">
              <step.Visual />
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
