"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Section } from "@/components/ui/Primitives";

const REVIEWS = [
  {
    name: "Sofia R.",
    flag: "🇧🇷",
    language: "Learning Portuguese",
    avatar: "SR",
    rating: 5,
    text: "I've tried Duolingo, Babbel, and a dozen other apps. Konita AI is the first one that actually explains *why* a sentence is structured a certain way. The grammar breakdowns are incredible.",
  },
  {
    name: "James K.",
    flag: "🇯🇵",
    language: "Learning Japanese",
    avatar: "JK",
    rating: 5,
    text: "The conversation mode is a game changer. It's like having a patient tutor available 24/7. My Japanese has improved more in 3 weeks than in 6 months of classes.",
  },
  {
    name: "Amara N.",
    flag: "🇫🇷",
    language: "Learning French",
    avatar: "AN",
    rating: 5,
    text: "What I love most is that it doesn't just translate — it teaches. The vocabulary breakdown and pronunciation guide helped me finally feel confident speaking French.",
  },
  {
    name: "Carlos M.",
    flag: "🇩🇪",
    language: "Learning German",
    avatar: "CM",
    rating: 5,
    text: "The flashcard review system with spaced repetition is exactly what I needed. I open Konita every morning and run through my due words. My retention has gone through the roof.",
  },
  {
    name: "Yuki T.",
    flag: "🇰🇷",
    language: "Learning Korean",
    avatar: "YT",
    rating: 5,
    text: "The voice recognition is shockingly accurate. I can practice my pronunciation while commuting and it picks up everything correctly. Highly recommend.",
  },
  {
    name: "Priya S.",
    flag: "🇪🇸",
    language: "Learning Spanish",
    avatar: "PS",
    rating: 5,
    text: "I travel a lot for work and needed Spanish fast. The common mistakes section saved me from so many embarrassing errors. This app is genuinely brilliant.",
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
      ))}
    </div>
  );
}

export function Reviews() {
  return (
    <Section
      eyebrow="Loved by learners"
      title="Real people, real results"
      description="Thousands of learners use Konita AI every day to get fluent faster. Here's what they say."
    >
      {/* Aggregate rating */}
      <div className="mb-12 flex flex-col items-center gap-2">
        <div className="flex items-end gap-3">
          <span className="font-display text-5xl font-medium text-mist-100">4.9</span>
          <div className="mb-1.5 flex flex-col gap-1">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" aria-hidden="true" />
              ))}
            </div>
            <p className="text-xs text-mist-500">Based on 2,400+ learner reviews</p>
          </div>
        </div>
      </div>

      {/* Review grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {REVIEWS.map((review, index) => (
          <motion.article
            key={review.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: (index % 3) * 0.07, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-4 rounded-3xl border border-white/[0.06] bg-white/[0.02] p-6 transition-colors hover:bg-white/[0.04]"
          >
            <StarRating count={review.rating} />
            <p className="flex-1 text-sm leading-relaxed text-mist-300">
              &ldquo;{review.text}&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 font-display text-sm font-semibold text-emerald-300">
                {review.avatar}
              </div>
              <div>
                <p className="text-sm font-medium text-mist-100">
                  {review.name} <span aria-hidden="true">{review.flag}</span>
                </p>
                <p className="text-xs text-mist-500">{review.language}</p>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}
