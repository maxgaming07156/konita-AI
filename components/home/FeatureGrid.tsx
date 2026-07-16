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
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                <SpellCheck2 className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-display text-2xl font-medium text-mist-100">Understand the rules without a textbook</h3>
              <p className="mt-3 max-w-md text-base leading-relaxed text-mist-400">
                Grammar Assistant breaks down complex rules instantly. Every sentence is analyzed so you understand exactly why it&apos;s built the way it is.
              </p>
            </div>
            
            {/* Mockup */}
            <div className="relative mx-8 mt-auto rounded-t-2xl border border-white/10 border-b-0 bg-base-800 p-5 shadow-2xl">
              <p className="text-lg text-mist-100">
                Je ne sais pas <span className="relative inline-block cursor-pointer border-b-2 border-blue-500 text-blue-300">pourquoi<div className="absolute bottom-full left-1/2 mb-2 w-64 -translate-x-1/2 rounded-xl border border-white/10 bg-base-900 p-3 shadow-xl">
                  <span className="block text-xs font-semibold text-blue-400 uppercase tracking-wider">Conjunction</span>
                  <span className="mt-1 block text-sm text-mist-200">Means &quot;why&quot;. Don&apos;t confuse it with <em className="italic">parce que</em> (because).</span>
                </div></span> il a dit ça.
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
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                <BookMarked className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-display text-2xl font-medium text-mist-100">Expand your vocabulary effortlessly</h3>
              <p className="mt-3 text-base leading-relaxed text-mist-400">
                Words are saved automatically. Spaced repetition ensures you review them right before you forget them.
              </p>
            </div>

            {/* Mockup */}
            <div className="mx-6 mb-6 mt-auto rounded-2xl border border-white/5 bg-white/5 p-4 shadow-lg backdrop-blur-md">
              <div className="flex items-center justify-between">
                <span className="rounded bg-amber-500/20 px-2 py-0.5 text-xs font-medium text-amber-300">Due for review</span>
                <div className="flex gap-1">
                  <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                  <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                  <div className="h-2 w-2 rounded-full bg-white/10"></div>
                </div>
              </div>
              <div className="mt-4 text-center">
                <p className="font-display text-2xl font-medium text-mist-100">desayunar</p>
                <p className="mt-1 text-sm text-mist-500">to have breakfast</p>
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
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                <MessageSquareText className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-display text-2xl font-medium text-mist-100">Practice naturally</h3>
              <p className="mt-3 text-base leading-relaxed text-mist-400">
                Chat with an AI partner that corrects you gently and keeps the conversation going without pressure.
              </p>
            </div>

            {/* Mockup */}
            <div className="mx-6 mb-6 mt-auto flex flex-col gap-3">
              <div className="w-10/12 rounded-2xl rounded-tl-sm border border-purple-500/20 bg-purple-500/5 p-3 text-sm text-mist-200">
                <p>Hello! How was your weekend?</p>
              </div>
              <div className="ml-auto w-10/12 rounded-2xl rounded-tr-sm bg-white/10 p-3 text-sm text-mist-200">
                <p>I go to the park yesterday.</p>
                <div className="mt-2 flex items-start gap-2 rounded-lg border border-purple-500/30 bg-purple-500/10 p-2 text-xs">
                  <Sparkles className="mt-0.5 h-3 w-3 shrink-0 text-purple-400" />
                  <span className="text-purple-200">Hint: Use the past tense <strong>went</strong> for yesterday.</span>
                </div>
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
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400">
                  <Mic className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-display text-2xl font-medium text-mist-100">Speak confidently</h3>
                <p className="mt-3 text-base leading-relaxed text-mist-400">
                  Voice recognition lets you speak naturally. Instantly hear the correct pronunciation spoken back to you with native-like accuracy.
                </p>
              </div>
              
              {/* Mockup */}
              <div className="relative flex md:w-1/2 items-center justify-center p-6 pt-0 md:pt-6">
                <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-base-800 p-6 shadow-2xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-widest text-mist-500">Listening...</span>
                    <SoundWave active barCount={5} className="h-4 opacity-70" />
                  </div>
                  <p className="mt-6 text-xl text-mist-100">
                    Où est la gare la plus proche ?
                  </p>
                  <div className="mt-8 flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-500 text-white shadow-[0_0_40px_rgba(244,63,94,0.4)]">
                      <Mic className="h-6 w-6" />
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
