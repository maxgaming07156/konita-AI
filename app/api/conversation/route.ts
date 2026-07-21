import { NextRequest, NextResponse } from "next/server";
import { generateJson } from "@/lib/gemini";
import { groqGenerateJson } from "@/lib/groq";
import { getLanguageByCode } from "@/lib/languages";
import type { ConversationMessage } from "@/types";

export const runtime = "nodejs";
export const maxDuration = 60;

interface ConversationRequestBody {
  targetLang: string;
  history: Pick<ConversationMessage, "role" | "content">[];
  message: string;
  provider?: "gemini" | "groq";
}

interface ConversationAiResponse {
  reply: string;
  correction: { corrected: string; explanation: string } | null;
}

const SYSTEM_INSTRUCTION = `You are Konita, a friendly, encouraging AI conversation partner helping a learner
practice a new language through natural chat. You will be told which language the learner is practicing.

Always reply with a single JSON object (no markdown, no code fences) shaped exactly like:
{
  "reply": string,
  "correction": { "corrected": string, "explanation": string } | null
}

Rules:
- "reply" continues the conversation naturally in the target language, at a beginner/intermediate level,
  using short, clear sentences. Ask a friendly follow-up question when appropriate to keep the conversation going.
- If the learner's most recent message contains a grammar, spelling, or word-choice mistake, set "correction" to
  an object with "corrected" (their sentence rewritten correctly) and "explanation" (one short, kind sentence
  explaining the fix, written in English). Never sound harsh.
- If there is no mistake, set "correction" to null.
- Stay warm, patient, and encouraging at all times.
- Respond ONLY with the JSON object.`;

function buildPrompt(
  targetLang: string,
  history: Pick<ConversationMessage, "role" | "content">[],
  message: string
): string {
  const language = getLanguageByCode(targetLang).name;
  const transcript = history
    .map((m) => `${m.role === "user" ? "Learner" : "Konita"}: ${m.content}`)
    .join("\n");

  return `Target language being practiced: ${language}\n\nConversation so far:\n${transcript || "(this is the first message)"}\n\nLearner's new message: """${message}"""\n\nReturn the JSON object described in your instructions.`;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<ConversationRequestBody>;
    const message = body.message?.trim();
    const targetLang = body.targetLang;
    const history = Array.isArray(body.history) ? body.history : [];
    const provider = body.provider ?? "gemini";

    if (!message) {
      return NextResponse.json({ error: "Please type a message to continue the conversation." }, { status: 400 });
    }
    if (!targetLang) {
      return NextResponse.json({ error: "Please choose a language to practice." }, { status: 400 });
    }
    if (message.length > 1000) {
      return NextResponse.json({ error: "Please keep messages under 1000 characters." }, { status: 400 });
    }

    const prompt = buildPrompt(targetLang, history.slice(-10), message);
    
    let aiResponse: ConversationAiResponse;
    if (provider === "groq") {
      aiResponse = await groqGenerateJson<ConversationAiResponse>(prompt, SYSTEM_INSTRUCTION);
    } else {
      aiResponse = await generateJson<ConversationAiResponse>(prompt, SYSTEM_INSTRUCTION);
    }

    return NextResponse.json({ data: aiResponse, provider }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something went wrong. Please try again.";
    const status = message.includes("GEMINI_API_KEY") ? 500 : 502;
    return NextResponse.json({ error: message }, { status });
  }
}
