"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Mic, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Primitives";
import { SoundWave } from "@/components/ui/SoundWave";

const rise = {
  hidden: { opacity: 0, y: 22 },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] },
  }),
};

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-24 pt-16 sm:pb-32 sm:pt-24">
      <Container className="flex flex-col items-center text-center">
        <motion.div variants={rise} initial="hidden" animate="show" custom={0}>
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/5 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.16em] text-emerald-300">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Powered by Gemini AI
          </span>
        </motion.div>

        <motion.h1
          variants={rise}
          initial="hidden"
          animate="show"
          custom={0.1}
          className="mt-7 max-w-3xl text-balance font-display text-4xl font-medium leading-[1.08] text-mist-100 sm:text-6xl"
        >
          Learn Languages <em className="text-emerald-300 not-italic">Smarter</em> with AI
        </motion.h1>

        <motion.p
          variants={rise}
          initial="hidden"
          animate="show"
          custom={0.2}
          className="mt-6 max-w-xl text-balance text-lg leading-relaxed text-mist-400"
        >
          Konita AI turns every translation into a lesson &mdash; grammar, vocabulary, pronunciation,
          and real conversation practice, all in one place.
        </motion.p>

        <motion.div
          variants={rise}
          initial="hidden"
          animate="show"
          custom={0.3}
          className="mt-9 flex flex-col items-center gap-3 sm:flex-row"
        >
          <Link href="/tutor">
            <Button size="lg" className="group">
              Start Learning
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Button>
          </Link>
          <Link href="/tutor?voice=1">
            <Button size="lg" variant="secondary" className="group">
              <Mic className="h-4 w-4" aria-hidden="true" />
              Try Voice Translation
            </Button>
          </Link>
        </motion.div>

        <motion.div
          variants={rise}
          initial="hidden"
          animate="show"
          custom={0.45}
          className="relative mt-20 w-full max-w-3xl"
        >
          <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-[1fr_auto_1fr]">
            <div className="rounded-4xl border border-white/[0.07] bg-white/[0.03] p-6 text-left shadow-panel backdrop-blur-2xl">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-mist-500">English</p>
              <p className="mt-3 font-display text-xl text-mist-100">
                &ldquo;Could you recommend a good place for breakfast?&rdquo;
              </p>
            </div>

            <div className="flex flex-row items-center justify-center gap-3 py-2 sm:flex-col">
              <SoundWave active barCount={5} className="h-8" />
              <span className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 font-mono text-[11px] text-emerald-300">
                AI
              </span>
            </div>

            <div className="rounded-4xl border border-emerald-400/20 bg-emerald-500/[0.06] p-6 text-left shadow-panel backdrop-blur-2xl">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-emerald-300/80">Spanish</p>
              <p className="mt-3 font-display text-xl text-emerald-100">
                &ldquo;&iquest;Podr&iacute;as recomendarme un buen lugar para desayunar?&rdquo;
              </p>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
