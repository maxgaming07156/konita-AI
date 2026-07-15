import { NextRequest, NextResponse } from "next/server";
import { generateJson } from "@/lib/gemini";
import { getLanguageByCode } from "@/lib/languages";

export const runtime = "nodejs";

interface WordOfDayResponse {
  phrase: string;
  translation: string;
  pronunciation: string;
  usageNote: string;
}

const SYSTEM_INSTRUCTION = `You are Konita, an AI language tutor. Generate one short, useful, everyday
phrase (3-8 words) in English, along with its translation into a requested target language.

Return ONLY a JSON object shaped exactly like:
{ "phrase": string, "translation": string, "pronunciation": string, "usageNote": string }

Rules:
- "phrase" is the English phrase.
- "translation" is its natural, accurate translation into the target language.
- "pronunciation" is a simple, readable phonetic guide (not IPA) for saying the translation aloud.
- "usageNote" is one short, encouraging sentence about when or how to use this phrase.
- Pick a varied, everyday, practical phrase each time — greetings, small talk, useful requests, travel,
  or common expressions. Avoid repeating the same phrase style every time.
- Respond ONLY with the JSON object.`;

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { targetLang?: string };
    const targetLang = body.targetLang && body.targetLang !== "auto" ? body.targetLang : "es";
    const language = getLanguageByCode(targetLang).name;

    const prompt = `Target language: ${language}\nGenerate today's phrase.`;
    const data = await generateJson<WordOfDayResponse>(prompt, SYSTEM_INSTRUCTION);

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Couldn't load today's phrase.";
    const status = message.includes("GEMINI_API_KEY") ? 500 : 502;
    return NextResponse.json({ error: message }, { status });
  }
}
