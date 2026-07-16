"use client";

import { motion } from "framer-motion";
import { Mic, Sparkles, Star, Volume2 } from "lucide-react";
import { SoundWave } from "@/components/ui/SoundWave";

export function HeroMockupFlow() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.8, delayChildren: 1.2 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="mx-auto mt-16 flex w-full max-w-2xl flex-col gap-5 text-left font-sans">
      {/* 1. Source */}
      <motion.div variants={item} className="ml-auto w-11/12 max-w-[400px] rounded-3xl rounded-tr-md border border-white/5 bg-white/5 p-4 shadow-md backdrop-blur-xl sm:p-5">
        <p className="text-[15px] leading-relaxed text-mist-100">&ldquo;Could you recommend a good place for breakfast?&rdquo;</p>
      </motion.div>

      {/* 2. Translation & Pronunciation */}
      <motion.div variants={item} className="w-11/12 max-w-[480px]">
        <div className="flex gap-3 sm:gap-4">
          <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
          </div>
          <div className="flex-1 rounded-3xl rounded-tl-md border border-emerald-500/20 bg-emerald-500/[0.04] p-4 shadow-lg backdrop-blur-xl sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400/80">Spanish Translation</span>
              <Volume2 className="h-4 w-4 text-emerald-400/60" aria-hidden="true" />
            </div>
            <p className="mt-2 text-lg text-emerald-50">&iquest;Podr&iacute;as recomendarme un buen lugar para desayunar?</p>
            <div className="mt-3 flex items-center gap-2 text-xs text-mist-400">
              <SoundWave active barCount={3} className="h-3 opacity-50" />
              <span className="font-mono opacity-80">/poˈðɾi.as re.ko.menˈdaɾ.me.../</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 3. Grammar Note */}
      <motion.div variants={item} className="ml-11 w-11/12 max-w-[436px] sm:ml-12">
        <div className="rounded-2xl border border-blue-500/20 bg-blue-500/[0.04] p-4 shadow-lg backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
              <span className="text-[9px] font-bold">G</span>
            </div>
            <span className="text-sm font-medium text-blue-200">Conditional Tense</span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-blue-100/70">
            Using <strong className="font-semibold text-blue-100">podr&iacute;as</strong> (could you) instead of <em className="italic">puedes</em> (can you) makes the request more polite, which is common when asking for recommendations.
          </p>
        </div>
      </motion.div>

      {/* 4. Vocabulary Saved */}
      <motion.div variants={item} className="mx-auto mt-2">
        <div className="flex items-center gap-2.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-2 shadow-lg backdrop-blur-md">
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
          <span className="text-sm font-medium text-amber-200">
            <strong className="font-semibold text-amber-100">desayunar</strong> saved to flashcards
          </span>
        </div>
      </motion.div>

      {/* 5. Conversation Practice */}
      <motion.div variants={item} className="mt-2 w-11/12 max-w-[480px]">
        <div className="flex gap-3 sm:gap-4">
          <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-purple-400">
            <Mic className="h-4 w-4" aria-hidden="true" />
          </div>
          <div className="flex-1 rounded-3xl rounded-tl-md border border-purple-500/20 bg-purple-500/[0.04] p-4 shadow-lg backdrop-blur-xl sm:p-5">
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-400/80">Conversation Practice</span>
            <p className="mt-2 text-[15px] leading-relaxed text-purple-50">&iexcl;Claro! &iquest;Prefieres algo dulce como panqueques o algo salado?</p>
            <p className="mt-1 text-sm text-purple-200/60">(Sure! Do you prefer something sweet like pancakes or something savory?)</p>
            <div className="mt-4 flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-mist-300">
              <Mic className="h-3.5 w-3.5 text-mist-400" aria-hidden="true" />
              Hold to reply in Spanish...
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
