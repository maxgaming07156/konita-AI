import type { Metadata } from "next";
import { ProgressPageClient } from "./ProgressPageClient";

export const metadata: Metadata = {
  title: "Progress \u2014 Konita AI",
  description: "Track your streak, translations, and saved vocabulary in Konita AI.",
};

export default function ProgressPage() {
  return <ProgressPageClient />;
}
