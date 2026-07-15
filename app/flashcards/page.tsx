import type { Metadata } from "next";
import { FlashcardsClient } from "./FlashcardsClient";

export const metadata: Metadata = {
  title: "Flashcards \u2014 Konita AI",
  description: "Review your favorite words with spaced-repetition flashcards.",
};

export default function FlashcardsPage() {
  return <FlashcardsClient />;
}
