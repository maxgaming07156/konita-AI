"use client";

import { motion } from "framer-motion";
import { BookMarked, Languages, MessageSquareText, Mic, SpellCheck2, GraduationCap } from "lucide-react";
import { Section } from "@/components/ui/Primitives";
import { CardGlow } from "@/components/ui/Card";

const FEATURES = [
  {
    icon: Languages,
    title: "AI Translation",
    description: "Accurate, natural translations across dozens of languages, powered by Gemini.",
  },
  {
    icon: Mic,
    title: "Voice Recognition",
    description: "Speak naturally and watch your words appear instantly, ready to translate.",
  },
  {
    icon: GraduationCap,
    title: "AI Tutor",
    description: "Every translation comes with grammar notes, pronunciation, and learning tips.",
  },
  {
    icon: SpellCheck2,
    title: "Grammar Assistant",
    description: "Understand exactly why a sentence is built the way it is, in plain language.",
  },
  {
    icon: BookMarked,
    title: "Vocabulary Builder",
    description: "Save favorite words and phrases automatically for quick review later.",
  },
  {
    icon: MessageSquareText,
    title: "Conversation Practice",
    description: "Chat with an AI partner that corrects you gently and keeps the conversation going.",
  },
];

export function FeatureGrid() {
  return (
    <Section
      eyebrow="Everything in one place"
      title="A tutor that lives inside every translation"
      description="Konita AI doesn't just tell you what something means — it teaches you why."
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: (index % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            <CardGlow>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-300 transition-colors duration-300 group-hover:bg-emerald-500/15">
                <feature.icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="mt-5 font-display text-lg font-medium text-mist-100">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-mist-500">{feature.description}</p>
            </CardGlow>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
