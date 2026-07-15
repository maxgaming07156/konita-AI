import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AuroraBackground } from "@/components/layout/AuroraBackground";
import { ToastProvider } from "@/hooks/useToast";

const fontDisplay = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const fontBody = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Konita AI \u2014 Translate \u00b7 Speak \u00b7 Learn",
  description:
    "Konita AI is an AI-powered language learning platform combining translation, an AI tutor, speech recognition, text-to-speech, and conversation practice in one app.",
  keywords: [
    "AI translation",
    "language learning",
    "AI tutor",
    "voice translation",
    "learn languages",
    "Konita AI",
  ],
  openGraph: {
    title: "Konita AI \u2014 Translate \u00b7 Speak \u00b7 Learn",
    description: "Learn languages smarter with an AI tutor built into every translation.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fontDisplay.variable} ${fontBody.variable} ${fontMono.variable}`} suppressHydrationWarning>
      <body className="font-body" suppressHydrationWarning>
        <ToastProvider>
          <AuroraBackground />
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
