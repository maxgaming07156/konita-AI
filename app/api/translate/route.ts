import { NextRequest, NextResponse } from "next/server";
import { generateJson } from "@/lib/gemini";
import { getLanguageByCode } from "@/lib/languages";
import type { TutorBreakdown } from "@/types";

export const runtime = "nodejs";
export const maxDuration = 60;

interface TranslateRequestBody {
  text: string;
  sourceLang: string;
  targetLang: string;
}

const SYSTEM_INSTRUCTION = `You are Konita, an expert AI language tutor embedded inside a translation app.
For every request you receive raw source text and a target language. You must return a single
JSON object (no markdown, no commentary, no code fences) that matches exactly this TypeScript shape:

{
  "translation": string,
  "detectedSourceLanguage": string,
  "grammarExplanation": string,
  "vocabulary": { "word": string, "meaning": string, "partOfSpeech": string }[],
  "pronunciationGuide": string,
  "exampleSentence": string,
  "exampleSentenceTranslation": string,
  "commonMistakes": string[],
  "learningTips": string[]
}

Rules:
- "translation" is the accurate, natural translation of the source text into the target language.
- "detectedSourceLanguage" is the full English name of the language you detected the source text to be written in.
- "grammarExplanation" is a short, beginner-friendly explanation (2-4 sentences) of the grammar structure used.
- "vocabulary" lists 3-6 key words or phrases from the translation with their meaning and part of speech.
- "pronunciationGuide" gives a simple phonetic guide (not IPA, use readable syllables) for saying the translation aloud.
- "exampleSentence" is a new, different example sentence in the target language that reuses a key word from the translation.
- "exampleSentenceTranslation" translates that example sentence back into the source language.
- "commonMistakes" lists 2-3 mistakes learners commonly make with this phrase or grammar point.
- "learningTips" lists 2-3 short, encouraging, practical tips for remembering or using this phrase.
- Keep every field beginner-friendly, warm, and encouraging in tone.
- Respond ONLY with the JSON object.`;

function buildPrompt(text: string, sourceLang: string, targetLang: string): string {
  const source = sourceLang === "auto" ? "auto-detect the language" : getLanguageByCode(sourceLang).name;
  const target = getLanguageByCode(targetLang).name;
  return `Source text: """${text}"""\nSource language: ${source}\nTarget language: ${target}\n\nReturn the JSON object described in your instructions.`;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<TranslateRequestBody>;
    const text = body.text?.trim();
    const sourceLang = body.sourceLang ?? "auto";
    const targetLang = body.targetLang;

    if (!text) {
      return NextResponse.json({ error: "Please enter some text to translate." }, { status: 400 });
    }
    if (text.length > 3000) {
      return NextResponse.json(
        { error: "That text is too long. Please keep it under 3000 characters." },
        { status: 400 }
      );
    }
    if (!targetLang) {
      return NextResponse.json({ error: "Please choose a target language." }, { status: 400 });
    }

    const prompt = buildPrompt(text, sourceLang, targetLang);
    const breakdown = await generateJson<TutorBreakdown>(prompt, SYSTEM_INSTRUCTION);

    return NextResponse.json({ data: breakdown }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something went wrong while translating.";
    const status = message.includes("GEMINI_API_KEY") ? 500 : 502;
    return NextResponse.json({ error: message }, { status });
  }
}
