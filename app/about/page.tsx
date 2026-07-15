import type { Metadata } from "next";
import { Heart, Rocket, ShieldCheck, Sparkles } from "lucide-react";
import { Section, Container } from "@/components/ui/Primitives";
import { CardGlow } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "About \u2014 Konita AI",
  description: "Why Konita AI exists and what makes it different from a plain translator.",
};

const VALUES = [
  {
    icon: Sparkles,
    title: "Teach, don't just translate",
    description: "Every result includes the grammar and vocabulary behind it, so understanding compounds over time.",
  },
  {
    icon: ShieldCheck,
    title: "Private by default",
    description: "No accounts, no tracking. Your history and favorites live only in your browser's local storage.",
  },
  {
    icon: Rocket,
    title: "Fast and lightweight",
    description: "Built on Next.js with careful performance choices, so it feels instant on any device.",
  },
  {
    icon: Heart,
    title: "Encouraging by nature",
    description: "Corrections are gentle and explanations are beginner-friendly — learning should feel good.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Section
        eyebrow="About Konita AI"
        title="A translator that wants you to stop needing it"
        className="pb-8 pt-20 sm:pt-28"
      >
        <Container className="!px-0">
          <div className="mx-auto max-w-2xl text-center text-mist-400">
            <p className="leading-relaxed">
              Most translation apps give you an answer and move on. Konita AI was built on a simple
              belief: every translation is a missed lesson if it doesn&apos;t teach you something.
              So we paired fast, accurate AI translation with a tutor that explains the grammar,
              breaks down the vocabulary, and gives you a place to practice speaking it back &mdash;
              all without asking you to create an account.
            </p>
          </div>
        </Container>
      </Section>

      <Section eyebrow="What we believe" title="The principles behind the product">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {VALUES.map((value) => (
            <CardGlow key={value.title}>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-300">
                <value.icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="mt-5 font-display text-lg font-medium text-mist-100">{value.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-mist-500">{value.description}</p>
            </CardGlow>
          ))}
        </div>
      </Section>

      <Section className="pt-0">
        <Container>
          <div className="rounded-4xl border border-emerald-400/20 bg-emerald-500/[0.05] p-8 text-center sm:p-12">
            <h2 className="font-display text-2xl font-medium text-mist-100">Made in Lahore, Pakistan</h2>
            <p className="mx-auto mt-3 max-w-xl text-mist-400">
              Konita AI is designed and built by a small independent team who believe great language
              tools shouldn&apos;t require a subscription to start learning.
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}
