"use client";

import { motion } from "framer-motion";
import { BookOpen, Brain, Languages, MessageSquareText, Sparkles } from "lucide-react";
import { Section } from "@/components/ui/Primitives";
import { cn } from "@/lib/utils";

const JOURNEY_STEPS = [
  {
    icon: Languages,
    title: "Translate",
    description: "Start with what you want to say.",
    colorClass: "bg-emerald-500/10 text-emerald-400"
  },
  {
    icon: BookOpen,
    title: "Understand",
    description: "Learn why it's said that way with instant grammar notes.",
    colorClass: "bg-blue-500/10 text-blue-400"
  },
  {
    icon: MessageSquareText,
    title: "Practice",
    description: "Use it in a real conversation with your AI tutor.",
    colorClass: "bg-purple-500/10 text-purple-400"
  },
  {
    icon: Brain,
    title: "Remember",
    description: "Review automatically with spaced repetition flashcards.",
    colorClass: "bg-amber-500/10 text-amber-400"
  },
  {
    icon: Sparkles,
    title: "Speak Confidently",
    description: "Own the language naturally, one phrase at a time.",
    colorClass: "bg-rose-500/10 text-rose-400"
  }
];

export function LearningJourney() {
  return (
    <Section
      eyebrow="The Learning Journey"
      title="How you'll actually become fluent"
      description="A proven educational methodology built right into the tools you already use every day."
    >
      <div className="relative mx-auto mt-12 max-w-4xl">
        {/* Connection Line */}
        <div className="absolute left-8 top-8 h-full w-0.5 bg-white/[0.04] md:left-1/2 md:-translate-x-1/2" />

        <div className="flex flex-col gap-10 md:gap-4">
          {JOURNEY_STEPS.map((step, index) => {
            const isEven = index % 2 === 0;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className={cn(
                  "relative flex items-center gap-6 md:gap-8",
                  isEven ? "md:flex-row" : "md:flex-row-reverse"
                )}
              >
                {/* Desktop Left Side */}
                <div className={cn("hidden flex-1 md:block", isEven ? "text-right" : "text-left")}>
                  <h3 className="font-display text-xl font-medium text-mist-100">{step.title}</h3>
                  <p className="mt-2 text-mist-400">{step.description}</p>
                </div>

                {/* Node */}
                <div className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-base-900 shadow-xl md:mx-auto">
                  <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", step.colorClass)}>
                    <step.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                </div>

                {/* Mobile text OR Desktop Right Side */}
                <div className={cn("flex-1", !isEven && "md:hidden")}>
                  <h3 className="font-display text-xl font-medium text-mist-100">{step.title}</h3>
                  <p className="mt-2 text-mist-400">{step.description}</p>
                </div>
                
                {/* Desktop balancing column */}
                {isEven && <div className="hidden flex-1 md:block" />}
              </motion.div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
