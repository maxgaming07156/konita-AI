import type { Metadata } from "next";
import {
  BookMarked,
  Copy,
  Download,
  Ear,
  Keyboard,
  Languages,
  MessageSquareText,
  Mic,
  Repeat,
  Share2,
  SpellCheck2,
  GraduationCap,
} from "lucide-react";
import { Section, Container } from "@/components/ui/Primitives";
import { CardGlow } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Features \u2014 Konita AI",
  description: "Explore every feature inside Konita AI: translation, voice, AI tutoring, and more.",
};

const CORE_FEATURES = [
  {
    icon: Languages,
    title: "Text Translation",
    description: "Translate between any language pair with natural, context-aware accuracy.",
  },
  {
    icon: Mic,
    title: "Voice Translation",
    description: "Speak instead of typing — Konita AI transcribes and translates in one step.",
  },
  {
    icon: GraduationCap,
    title: "AI Tutor",
    description: "Grammar, vocabulary, pronunciation, and tips attached to every translation.",
  },
  {
    icon: MessageSquareText,
    title: "Conversation Mode",
    description: "Practice real dialogue with an AI partner that corrects you kindly.",
  },
  {
    icon: BookMarked,
    title: "Favorite Words",
    description: "Save key vocabulary to a personal list you can revisit anytime.",
  },
  {
    icon: Repeat,
    title: "Recent Translations",
    description: "Your last 30 translations are saved locally so you can pick up where you left off.",
  },
];

const PRODUCTIVITY_FEATURES = [
  { icon: Copy, title: "Copy Translation", description: "Copy any translation to your clipboard in one tap." },
  { icon: Download, title: "Download as TXT", description: "Export a translation and its breakdown as a text file." },
  { icon: Share2, title: "Share Translation", description: "Share a translation using your device's native share sheet." },
  { icon: Keyboard, title: "Keyboard Shortcut", description: "Press Ctrl + Enter to translate instantly without touching your mouse." },
  { icon: SpellCheck2, title: "Auto Detect Language", description: "Not sure what language you're reading? Konita AI figures it out." },
  { icon: Ear, title: "Text to Speech", description: "Hear any translation spoken aloud, with instant replay." },
];

function FeatureRow({ features }: { features: typeof CORE_FEATURES }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {features.map((feature) => (
        <CardGlow key={feature.title}>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-300">
            <feature.icon className="h-5 w-5" aria-hidden="true" />
          </div>
          <h3 className="mt-5 font-display text-lg font-medium text-mist-100">{feature.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-mist-500">{feature.description}</p>
        </CardGlow>
      ))}
    </div>
  );
}

export default function FeaturesPage() {
  return (
    <>
      <Section
        eyebrow="Features"
        title="Built for people who want to actually learn"
        description="Every tool in Konita AI is designed to turn a quick translation into real progress."
        className="pb-8 pt-20 sm:pt-28"
      >
        <FeatureRow features={CORE_FEATURES} />
      </Section>

      <Section eyebrow="Everyday tools" title="Small details that save you time" className="pt-8">
        <FeatureRow features={PRODUCTIVITY_FEATURES} />
      </Section>

      <Section className="pt-8">
        <Container>
          <div className="rounded-4xl border border-white/[0.07] bg-white/[0.02] p-8 sm:p-12">
            <h2 className="font-display text-2xl font-medium text-mist-100">Accessible by design</h2>
            <p className="mt-3 max-w-2xl text-mist-500">
              Konita AI is built with semantic HTML, full keyboard navigation, visible focus states, and
              ARIA labels throughout, so it works well with screen readers and assistive technology.
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}
