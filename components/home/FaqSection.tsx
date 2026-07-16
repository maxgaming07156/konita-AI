"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/ui/Primitives";
import Script from "next/script";

const FAQS = [
  {
    question: "How does Konita Tutor AI help me learn languages?",
    answer: "Konita AI turns every translation into a mini-lesson. Instead of just giving you the translated text, it provides a breakdown of the grammar, extracts key vocabulary words, highlights common mistakes, and offers a pronunciation guide.",
  },
  {
    question: "Is there a way to practice conversation with the AI?",
    answer: "Yes, Konita Tutor AI includes a dedicated Conversation Mode. You can chat naturally with the AI in your target language, and it will gently correct your mistakes while keeping the conversation flowing.",
  },
  {
    question: "Can I use voice recognition to practice speaking?",
    answer: "Absolutely. You can tap the microphone to speak naturally in any supported language. Konita will recognize your speech, translate it, and provide feedback on how to improve.",
  },
  {
    question: "How do the flashcards work?",
    answer: "Whenever you translate something, you can tap the star icon to save favorite words or phrases. Konita uses a Spaced Repetition System (SRS) to automatically schedule these words for review as flashcards, ensuring you commit them to long-term memory.",
  },
];

export function FaqSection() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <Section
      eyebrow="Frequently Asked Questions"
      title="Understand how Konita works"
      description="Everything you need to know about our AI language tutor."
    >
      <Script
        id="faq-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      <div className="mx-auto max-w-3xl space-y-4">
        {FAQS.map((faq, index) => (
          <motion.article
            key={faq.question}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-3xl border border-white/[0.06] bg-white/[0.02] p-6 text-left"
          >
            <h3 className="font-display text-lg font-medium text-mist-100">{faq.question}</h3>
            <p className="mt-2 text-sm leading-relaxed text-mist-400">{faq.answer}</p>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}
