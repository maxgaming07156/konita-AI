"use client";

import { motion } from "framer-motion";
import { BookMarked, MessageSquareText, Mic, SpellCheck2, Sparkles } from "lucide-react";
import { Section } from "@/components/ui/Primitives";
import { CardGlow } from "@/components/ui/Card";
import { SoundWave } from "@/components/ui/SoundWave";

// We keep the original 6 concepts but restructure them into a Bento grid
// focusing on "What will I learn?" and user outcomes.

export function FeatureGrid() {
  return (
    <Section
      eyebrow="Everything in one place"
      title="A tutor that lives inside every translation"
      description="Konita AI doesn't just tell you what something means — it teaches you why."
    >
      <div className="mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        
        {/* 1. Grammar Assistant (Col Span 2) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-2"
        >
          <CardGlow className="flex h-full flex-col justify-between p-0 overflow-hidden bg-base-900/50">
            <div className="p-6 md:p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 dark:text-blue-400 text-blue-800">
                <SpellCheck2 className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-display text-2xl font-medium text-mist-100">Understand the rules without a textbook</h3>
              <p className="mt-3 max-w-md text-base leading-relaxed text-mist-400">
                Grammar Assistant breaks down complex rules instantly. Every sentence is analyzed so you understand exactly why it&apos;s built the way it is.
              </p>
            </div>
            
            {/* Mockup */}
            <div className="relative mx-8 mt-auto rounded-t-3xl border border-white/10 border-b-0 bg-base-800 p-6 shadow-2xl">
              <p className="text-xl text-mist-100">
                Je ne sais pas <span className="relative inline-block cursor-pointer border-b-2 border-blue-500 dark:text-blue-300 text-blue-800 transition-colors hover:dark:text-blue-200 text-blue-900">
                  pourquoi
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 15 }}
                    viewport={{ once: true }}
                    className="absolute bottom-full left-1/2 mb-3 w-64 -translate-x-1/2 rounded-2xl border border-blue-500/30 bg-blue-500/10 p-4 shadow-[0_8px_32px_rgba(59,130,246,0.15)] backdrop-blur-xl"
                  >
                    <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider dark:text-blue-400 text-blue-800">
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500/20 text-[10px]">G</span>
                      Conjunction
                    </span>
                    <span className="mt-2 block text-sm leading-relaxed dark:text-blue-100/90 text-blue-900/90">
                      Means &quot;why&quot;. Don&apos;t confuse it with <em className="italic dark:text-blue-200/70 text-blue-900/70">parce que</em> (because).
                    </span>
                  </motion.div>
                </span> il a dit ça.
              </p>
            </div>
          </CardGlow>
        </motion.div>

        {/* 2. Vocabulary Builder (Col Span 1) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <CardGlow className="flex h-full flex-col justify-between p-0 overflow-hidden bg-base-900/50">
            <div className="p-6 md:p-8 pb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 dark:text-amber-400 text-amber-800">
                <BookMarked className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-display text-2xl font-medium text-mist-100">Expand your vocabulary effortlessly</h3>
              <p className="mt-3 text-base leading-relaxed text-mist-400">
                Words are saved automatically. Spaced repetition ensures you review them right before you forget them.
              </p>
            </div>

            {/* Mockup - Progress & Flashcard */}
            <div className="mx-6 mb-6 mt-auto flex flex-col gap-3">
              {/* Daily Goal */}
              <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 p-3 px-4 shadow-lg backdrop-blur-md">
                <span className="text-xs font-medium text-mist-300">Daily Goal</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-400">3/5 Words</span>
                  <div className="h-1.5 w-16 overflow-hidden rounded-full bg-white/10">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: "60%" }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                      className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"
                    />
                  </div>
                </div>
              </div>

              {/* Flashcard */}
              <div className="group relative rounded-3xl border border-amber-500/20 bg-amber-500/[0.04] p-5 shadow-[0_8px_32px_rgba(245,158,11,0.05)] backdrop-blur-md transition-all hover:bg-amber-500/[0.06]">
                <div className="flex items-center justify-between">
                  <span className="rounded bg-amber-500/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider dark:text-amber-300 text-amber-800">Review</span>
                  <div className="flex gap-1.5">
                    <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ delay: 0.6 }} viewport={{ once: true }} className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></motion.div>
                    <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ delay: 0.8 }} viewport={{ once: true }} className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></motion.div>
                    <div className="h-2 w-2 rounded-full bg-white/10"></div>
                  </div>
                </div>
                <div className="mt-5 text-center">
                  <p className="font-display text-2xl font-medium text-mist-100 transition-transform group-hover:-translate-y-1">desayunar</p>
                  <p className="mt-2 text-sm dark:text-amber-200/0 text-amber-900/0 transition-all group-hover:dark:text-amber-200/80 text-amber-900/80">to have breakfast</p>
                </div>
              </div>
            </div>
          </CardGlow>
        </motion.div>

        {/* 3. Conversation Practice (Col Span 1) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <CardGlow className="flex h-full flex-col justify-between p-0 overflow-hidden bg-base-900/50">
            <div className="p-6 md:p-8 pb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 dark:text-purple-400 text-purple-800">
                <MessageSquareText className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-display text-2xl font-medium text-mist-100">Practice naturally</h3>
              <p className="mt-3 text-base leading-relaxed text-mist-400">
                Chat with an AI partner that corrects you gently and keeps the conversation going without pressure.
              </p>
            </div>

            {/* Mockup */}
            <div className="mx-6 mb-6 mt-auto flex flex-col gap-3">
              <div className="w-10/12 rounded-3xl rounded-tl-sm border border-purple-500/20 bg-purple-500/5 p-4 text-[15px] dark:text-purple-100 text-purple-900 shadow-sm backdrop-blur-xl">
                <p>Hello! How was your weekend?</p>
              </div>
              <div className="ml-auto w-10/12 rounded-3xl rounded-tr-sm bg-white/10 p-4 text-[15px] text-mist-100 shadow-sm backdrop-blur-xl">
                <p>I go to the park yesterday.</p>
                <motion.div 
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  whileInView={{ opacity: 1, height: "auto", marginTop: 12 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.2, duration: 0.4 }}
                  className="flex items-start gap-2 rounded-xl border border-purple-500/30 bg-purple-500/10 p-3 text-sm shadow-[0_4px_20px_rgba(168,85,247,0.1)] overflow-hidden"
                >
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 dark:text-purple-400 text-purple-800" />
                  <span className="dark:text-purple-200/90 text-purple-900/90 leading-relaxed">Hint: Use the past tense <strong className="font-semibold dark:text-purple-100 text-purple-900">went</strong> for yesterday.</span>
                </motion.div>
              </div>
            </div>
          </CardGlow>
        </motion.div>

        {/* 4. Speak Confidently (Col Span 2) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-2"
        >
          <CardGlow className="flex h-full flex-col justify-between p-0 overflow-hidden bg-base-900/50">
            <div className="flex flex-col md:flex-row h-full">
              <div className="p-6 md:p-8 md:w-1/2">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/10 dark:text-rose-400 text-rose-800">
                  <Mic className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-display text-2xl font-medium text-mist-100">Speak confidently</h3>
                <p className="mt-3 text-base leading-relaxed text-mist-400">
                  Voice recognition lets you speak naturally. Instantly hear the correct pronunciation spoken back to you with native-like accuracy.
                </p>
              </div>
              
              {/* Mockup */}
              <div className="relative flex md:w-1/2 items-center justify-center p-6 pt-0 md:pt-6">
                <div className="w-full max-w-sm rounded-4xl border border-rose-500/20 bg-rose-500/[0.02] p-8 shadow-[0_8px_32px_rgba(244,63,94,0.05)] backdrop-blur-xl">
                  <div className="flex items-center justify-between">
                    <motion.span 
                      animate={{ opacity: [1, 0.5, 1] }} 
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="text-xs font-semibold uppercase tracking-widest dark:text-rose-400/80 text-rose-800/80"
                    >
                      Listening...
                    </motion.span>
                    <SoundWave active barCount={5} className="h-4 dark:text-rose-400 text-rose-800" />
                  </div>
                  <p className="mt-8 text-2xl font-medium dark:text-rose-50 text-rose-900">
                    Où est la gare la plus proche ?
                  </p>
                  <div className="mt-10 flex justify-center">
                    <div className="relative flex h-20 w-20 items-center justify-center">
                      <motion.div 
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 rounded-full bg-rose-500/40"
                      />
                      <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-rose-500 text-white shadow-[0_0_40px_rgba(244,63,94,0.6)]">
                        <Mic className="h-6 w-6" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardGlow>
        </motion.div>

      </div>
    </Section>
  );
}
