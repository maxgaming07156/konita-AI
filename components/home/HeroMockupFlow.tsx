"use client";

import { motion } from "framer-motion";
import { Mic, Sparkles, Volume2, CheckCircle2 } from "lucide-react";
import { SoundWave } from "@/components/ui/SoundWave";
import { useEffect, useState } from "react";

const Typewriter = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  const [start, setStart] = useState(false);
  
  useEffect(() => {
    const t = setTimeout(() => setStart(true), delay * 1000);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <span>
      {start ? (
        <motion.span initial="hidden" animate="visible" variants={{
          visible: { transition: { staggerChildren: 0.015 } }
        }}>
          {Array.from(text).map((char, index) => (
            <motion.span key={index} variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1 }
            }}>
              {char}
            </motion.span>
          ))}
        </motion.span>
      ) : (
        <span className="opacity-0">{text}</span>
      )}
    </span>
  );
};

export function HeroMockupFlow() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 1.2, delayChildren: 1.0 } // Slower stagger to let animations breathe
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
          <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
          </div>
          <div className="flex-1 rounded-3xl rounded-tl-md border border-emerald-500/20 bg-emerald-500/[0.04] p-4 shadow-[0_8px_32px_rgba(16,185,129,0.05)] backdrop-blur-xl sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400/80">Spanish Translation</span>
              <Volume2 className="h-4 w-4 text-emerald-400/60" aria-hidden="true" />
            </div>
            <p className="mt-2 text-lg text-emerald-50">
              <Typewriter text="¿Podrías recomendarme un buen lugar para desayunar?" delay={2.2} />
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs text-mist-400">
              <SoundWave active barCount={3} className="h-3 opacity-50 text-emerald-400" />
              <span className="font-mono opacity-80 text-emerald-200/50">/poˈðɾi.as re.ko.menˈdaɾ.me.../</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 3. Grammar Note */}
      <motion.div variants={item} className="ml-11 w-11/12 max-w-[436px] sm:ml-12">
        <div className="rounded-2xl border border-blue-500/30 bg-blue-500/[0.08] p-4 shadow-[0_8px_32px_rgba(59,130,246,0.1)] backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/30 dark:text-blue-300 text-blue-800">
              <span className="text-[9px] font-bold">G</span>
            </div>
            <span className="text-sm font-medium dark:text-blue-200 text-blue-900">Conditional Tense</span>
          </div>
          <p className="mt-2 text-sm leading-relaxed dark:text-blue-100/80 text-blue-900/80">
            Using <strong className="font-semibold dark:text-blue-100 text-blue-900">podr&iacute;as</strong> (could you) instead of <em className="italic dark:text-blue-200/70 text-blue-900/70">puedes</em> (can you) makes the request more polite.
          </p>
        </div>
      </motion.div>

      {/* 4. Vocabulary Saved */}
      <motion.div variants={item} className="mx-auto mt-2">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 4.8, type: "spring", stiffness: 200, damping: 15 }}
          className="flex items-center gap-2.5 rounded-full border border-amber-500/30 bg-amber-500/15 px-5 py-2.5 shadow-[0_0_30px_rgba(245,158,11,0.15)] backdrop-blur-md"
        >
          <CheckCircle2 className="h-4 w-4 dark:text-amber-400 text-amber-800" aria-hidden="true" />
          <span className="text-sm font-medium dark:text-amber-200 text-amber-900">
            <strong className="font-semibold dark:text-amber-100 text-amber-900">desayunar</strong> saved to flashcards
          </span>
        </motion.div>
      </motion.div>

      {/* 5. Conversation Practice */}
      <motion.div variants={item} className="mt-2 w-11/12 max-w-[480px]">
        <div className="flex gap-3 sm:gap-4">
          <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-500/20 dark:text-purple-400 text-purple-800 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
            <Mic className="h-4 w-4" aria-hidden="true" />
          </div>
          <div className="flex-1 rounded-3xl rounded-tl-md border border-purple-500/20 bg-purple-500/[0.06] p-4 shadow-[0_8px_32px_rgba(168,85,247,0.08)] backdrop-blur-xl sm:p-5">
            <span className="text-xs font-semibold uppercase tracking-wider dark:text-purple-400/80 text-purple-800/80">Conversation Practice</span>
            <p className="mt-2 text-[15px] leading-relaxed dark:text-purple-50 text-purple-900">
              <Typewriter text="¡Claro! ¿Prefieres algo dulce como panqueques o algo salado?" delay={5.8} />
            </p>
            <p className="mt-1 text-sm dark:text-purple-200/60 text-purple-900/60">(Sure! Do you prefer something sweet like pancakes or something savory?)</p>
            <div className="mt-4 flex w-fit cursor-pointer items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-sm dark:text-purple-200 text-purple-900 transition-colors hover:bg-purple-500/20">
              <Mic className="h-3.5 w-3.5 dark:text-purple-400 text-purple-800" aria-hidden="true" />
              Hold to reply...
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
