import type { Metadata } from "next";
import { Suspense } from "react";
import { TutorPageClient } from "./TutorPageClient";

export const metadata: Metadata = {
  title: "AI Tutor \u2014 Konita AI",
  description: "Translate, speak, and practice conversation with your personal AI language tutor.",
};

export default function TutorPage() {
  return (
    <Suspense fallback={null}>
      <TutorPageClient />
    </Suspense>
  );
}
