import { NextRequest, NextResponse } from "next/server";
import { generateJson } from "@/lib/gemini";
import { getLanguageByCode } from "@/lib/languages";

export const runtime = "nodejs";

interface QuickTranslateRequestBody {
  text: string;
  sourceLang: string;
  targetLang: string;
}

interface QuickTranslateResult {
  translation: string;
  detectedSourceLanguage?: string;
}

const SYSTEM_INSTRUCTION = `You are a precise translation engine. Translate the source text into the target language.
Return a single JSON object with exactly this shape:
{
  "translation": string,
  "detectedSourceLanguage": string
}
Rules:
- "translation" must be an accurate, natural translation.
- "detectedSourceLanguage" is the full English name of the detected source language.
- Respond ONLY with the JSON. No markdown, no code fences, no commentary.`;

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<QuickTranslateRequestBody>;
    const text = body.text?.trim();
    const sourceLang = body.sourceLang ?? "auto";
    const targetLang = body.targetLang;

    if (!text) return NextResponse.json({ error: "Please enter some text." }, { status: 400 });
    if (text.length > 3000) return NextResponse.json({ error: "Text too long." }, { status: 400 });
    if (!targetLang) return NextResponse.json({ error: "Please choose a target language." }, { status: 400 });

    const source = sourceLang === "auto" ? "auto-detect" : getLanguageByCode(sourceLang).name;
    const target = getLanguageByCode(targetLang).name;
    const prompt = `Source text: """${text}"""\nSource language: ${source}\nTarget language: ${target}\n\nReturn the JSON.`;

    const result = await generateJson<QuickTranslateResult>(prompt, SYSTEM_INSTRUCTION);
    return NextResponse.json({ data: result }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something went wrong.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
