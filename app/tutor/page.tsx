import type { Metadata } from "next";
import { Suspense } from "react";
import { TutorPageClient } from "./TutorPageClient";

export const metadata: Metadata = {
  title: "Konita Tutor AI \u2014 Your Personal Language Teacher",
  description: "Translate, speak, and practice conversation with Konita Tutor AI. Get instant grammar and vocabulary feedback on every translation.",
};

export default function TutorPage() {
  return (
    <Suspense fallback={null}>
      <TutorPageClient />
    </Suspense>
  );
}
