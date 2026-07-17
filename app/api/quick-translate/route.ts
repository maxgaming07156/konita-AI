import { NextRequest, NextResponse } from "next/server";
import { generateText } from "@/lib/gemini";
import { getLanguageByCode } from "@/lib/languages";

export const runtime = "nodejs";
export const maxDuration = 60;

interface QuickTranslateRequestBody {
  text: string;
  sourceLang: string;
  targetLang: string;
}

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

    const systemInstruction = `You are a precise translation engine. Translate the source text into ${target}. 
Reply with ONLY the translated text. No explanations, no quotation marks, no punctuation outside what is part of the translation.`;

    const prompt = `Source language: ${source}\nText to translate: ${text}`;

    const translation = await generateText(prompt, systemInstruction);

    if (!translation) {
      return NextResponse.json({ error: "No translation returned. Please try again." }, { status: 502 });
    }

    return NextResponse.json({ data: { translation } }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something went wrong.";
    const status = message.includes("GEMINI_API_KEY") ? 500 : 502;
    return NextResponse.json({ error: message }, { status });
  }
}
