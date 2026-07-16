"use client";


import { motion } from "framer-motion";
import { ArrowRight, Mic, Sparkles } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Primitives";
import { AuthPromptModal } from "@/components/ui/AuthPromptModal";

const rise = {
  hidden: { opacity: 0, y: 22 },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] },
  }),
};

export function Hero() {
  const { data: session } = useSession();
  const router = useRouter();
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [targetUrl, setTargetUrl] = useState("/tutor");
  const [query, setQuery] = useState("");
  const [displayText, setDisplayText] = useState("");
  const fullText = "Hola! What would you like to translate today?";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, []);

  const handleAction = (url: string) => {
    if (!session) {
      setTargetUrl(url);
      setShowAuthPrompt(true);
    } else {
      router.push(url);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    handleAction(`/tutor?q=${encodeURIComponent(query)}`);
  };

  return (
    <section className="relative overflow-hidden pb-24 pt-16 sm:pb-32 sm:pt-24">
      <Container className="flex flex-col items-center text-center">
        <motion.div variants={rise} initial="hidden" animate="show" custom={0} className="relative mb-6">
          <div className="absolute inset-0 animate-pulse rounded-full bg-emerald-500/20 blur-xl" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-emerald-500/20 bg-base-900 shadow-[0_0_40px_-10px_rgba(16,185,129,0.3)]">
            <Sparkles className="h-8 w-8 text-emerald-400" />
          </div>
        </motion.div>

        <motion.h1
          variants={rise}
          initial="hidden"
          animate="show"
          custom={0.1}
          className="mt-4 max-w-3xl text-balance font-display text-4xl font-medium leading-[1.08] text-mist-100 sm:text-5xl"
        >
          {displayText}
          <span className="animate-pulse text-emerald-400">|</span>
        </motion.h1>

        <motion.p
          variants={rise}
          initial="hidden"
          animate="show"
          custom={0.2}
          className="mt-6 max-w-xl text-balance text-lg leading-relaxed text-mist-400"
        >
          Konita AI turns every translation into a lesson &mdash; grammar, vocabulary, pronunciation, and conversation practice.
        </motion.p>

        <motion.div
          variants={rise}
          initial="hidden"
          animate="show"
          custom={0.3}
          className="mt-10 w-full max-w-2xl"
        >
          <form 
            onSubmit={handleSubmit}
            className="relative flex items-center overflow-hidden rounded-full border border-white/10 bg-white/[0.02] p-2 shadow-2xl backdrop-blur-xl transition-all focus-within:border-emerald-500/50 focus-within:bg-white/[0.04]"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type something to translate..."
              className="w-full bg-transparent px-6 py-4 text-lg text-mist-100 placeholder-mist-500 outline-none"
            />
            <Button type="submit" size="lg" className="shrink-0 rounded-full px-8">
              Translate
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
          
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => handleAction("/tutor?voice=1")}
              className="group flex items-center gap-2 rounded-full border border-white/5 bg-base-800/50 px-4 py-2 text-sm text-mist-300 transition-colors hover:border-emerald-500/30 hover:text-emerald-300"
            >
              <Mic className="h-4 w-4" />
              Try Voice Translation
            </button>
            <button
              onClick={() => handleAction("/tutor")}
              className="group flex items-center gap-2 rounded-full border border-white/5 bg-base-800/50 px-4 py-2 text-sm text-mist-300 transition-colors hover:border-emerald-500/30 hover:text-emerald-300"
            >
              <ArrowRight className="h-4 w-4" />
              Skip to full app
            </button>
          </div>
        </motion.div>
      </Container>
      
      <AuthPromptModal 
        isOpen={showAuthPrompt} 
        onClose={() => {
          setShowAuthPrompt(false);
          router.push(targetUrl);
        }} 
      />
    </section>
  );
}
