import { Hero } from "@/components/home/Hero";
import { WordOfTheDay } from "@/components/home/WordOfTheDay";
import { FeatureGrid } from "@/components/home/FeatureGrid";
import { HowItWorks } from "@/components/home/HowItWorks";
import { CtaBanner } from "@/components/home/CtaBanner";

export default function HomePage() {
  return (
    <>
      <Hero />
      <WordOfTheDay />
      <FeatureGrid />
      <HowItWorks />
      <CtaBanner />
    </>
  );
}
