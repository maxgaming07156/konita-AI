"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Primitives";

export function CtaBanner() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-5xl border border-emerald-400/20 bg-gradient-to-br from-emerald-500/10 via-base-900 to-base-950 px-8 py-16 text-center shadow-glow sm:px-16"
        >
          <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-emerald-500/25 blur-[110px]" aria-hidden="true" />
          <h2 className="relative font-display text-3xl font-medium text-mist-100 sm:text-4xl">
            Your next conversation is one translation away
          </h2>
          <p className="relative mx-auto mt-4 max-w-lg text-mist-400">
            Free to start. No account, no signup &mdash; just open the AI Tutor and begin.
          </p>
          <div className="relative mt-8 flex justify-center">
            <Link href="/tutor">
              <Button size="lg" className="group">
                Open AI Tutor
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
