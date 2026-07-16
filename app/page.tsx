import { Hero } from "@/components/home/Hero";
import { WordOfTheDay } from "@/components/home/WordOfTheDay";
import { LearningJourney } from "@/components/home/LearningJourney";
import { FeatureGrid } from "@/components/home/FeatureGrid";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Reviews } from "@/components/home/Reviews";
import { FaqSection } from "@/components/home/FaqSection";
import { CtaBanner } from "@/components/home/CtaBanner";

export default function HomePage() {
  return (
    <>
      <Hero />
      <WordOfTheDay />
      <LearningJourney />
      <FeatureGrid />
      <HowItWorks />
      <Reviews />
      <FaqSection />
      <CtaBanner />
    </>
  );
}

