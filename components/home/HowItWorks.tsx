"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/ui/Primitives";

const STEPS = [
  {
    number: "01",
    title: "Speak or type",
    description: "Enter text or tap the microphone and speak naturally in any language.",
  },
  {
    number: "02",
    title: "Get an instant translation",
    description: "Konita AI translates your words accurately and reads them aloud on request.",
  },
  {
    number: "03",
    title: "Learn from the breakdown",
    description: "Review grammar notes, vocabulary, pronunciation, and example sentences.",
  },
  {
    number: "04",
    title: "Practice in conversation",
    description: "Put it to use in AI Tutor's conversation mode, with gentle corrections as you go.",
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
            className="relative rounded-4xl border border-white/[0.06] bg-white/[0.02] p-6"
          >
            <span className="font-display text-4xl font-medium text-emerald-500/25">{step.number}</span>
            <h3 className="mt-4 font-display text-lg font-medium text-mist-100">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-mist-500">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
