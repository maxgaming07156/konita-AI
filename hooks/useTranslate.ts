"use client";

import { useCallback, useState } from "react";
import type { RequestState, TutorBreakdown } from "@/types";

export type AIProvider = "gemini" | "groq";

interface UseTranslateReturn {
  state: RequestState;
  result: TutorBreakdown | null;
  error: string | null;
  provider: AIProvider;
  setProvider: (p: AIProvider) => void;
  translate: (text: string, sourceLang: string, targetLang: string) => Promise<TutorBreakdown | null>;
  reset: () => void;
}

export function useTranslate(): UseTranslateReturn {
  const [state, setState] = useState<RequestState>("idle");
  const [result, setResult] = useState<TutorBreakdown | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [provider, setProvider] = useState<AIProvider>("gemini");

  const translate = useCallback(
    async (text: string, sourceLang: string, targetLang: string): Promise<TutorBreakdown | null> => {
      setState("loading");
      setError(null);

      try {
        const response = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, sourceLang, targetLang, provider }),
        });

        const payload = (await response.json()) as { data?: TutorBreakdown; error?: string };

        if (!response.ok || !payload.data) {
          throw new Error(payload.error ?? "Translation failed. Please try again.");
        }

        setResult(payload.data);
        setState("success");
        return payload.data;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Translation failed. Please try again.";
        setError(message);
        setState("error");
        return null;
      }
    },
    [provider]
  );

  const reset = useCallback(() => {
    setState("idle");
    setResult(null);
    setError(null);
  }, []);

  return { state, result, error, provider, setProvider, translate, reset };
}
