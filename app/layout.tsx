import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AuroraBackground } from "@/components/layout/AuroraBackground";
import { ToastProvider } from "@/hooks/useToast";
import { AuthProvider } from "@/components/layout/AuthProvider";

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
  metadataBase: new URL("https://konita-ai.vercel.app"), // Fallback if domain isn't known, standard practice
  title: {
    default: "Konita — AI Language Tutor by Knootix AI",
    template: "%s | Konita Tutor AI"
  },
  description:
    "Konita Tutor AI is the ultimate language learning platform by Knootix AI. Translate text and speech, and instantly receive grammar breakdowns, vocabulary, and pronunciation guides from your personal AI tutor.",
  keywords: [
    "Konita",
    "Knootix AI",
    "Konita Tutor Ai",
    "Konita AI",
    "AI translation",
    "language learning",
    "AI language tutor",
    "voice translation",
    "learn languages smarter",
  ],
  authors: [{ name: "Knootix AI" }],
  creator: "Knootix AI",
  openGraph: {
    title: "Konita — AI Language Tutor by Knootix AI",
    description: "Learn languages smarter with Konita Tutor AI. Get grammar, vocabulary, and pronunciation with every translation.",
    type: "website",
    siteName: "Konita AI",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Konita — AI Language Tutor by Knootix AI",
    description: "Learn languages smarter with Konita Tutor AI. Get grammar, vocabulary, and pronunciation with every translation.",
    creator: "@KnootixAI",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fontDisplay.variable} ${fontBody.variable} ${fontMono.variable}`} suppressHydrationWarning>
      <body className="font-body" suppressHydrationWarning>
        <AuthProvider>
          <ToastProvider>
            <AuroraBackground />
            <div className="relative flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
