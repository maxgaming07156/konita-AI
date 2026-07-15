import { GoogleGenAI } from "@google/genai";

let cachedClient: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not configured. Add it to your .env.local file."
    );
  }
  if (!cachedClient) {
    cachedClient = new GoogleGenAI({ apiKey });
  }
  return cachedClient;
}

// gemini-2.5-flash is free-tier eligible as of mid-2026. Google periodically
// retires older models (e.g. gemini-2.0-flash was shut down June 1, 2026),
// so this is overridable via GEMINI_MODEL in .env.local without a code change.
const MODEL = process.env.GEMINI_MODEL || "gemini-flash-latest";

export async function generateJson<T>(prompt: string, systemInstruction: string): Promise<T> {
  const client = getClient();

  const response = await client.models.generateContent({
    model: MODEL,
    contents: prompt,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      temperature: 0.4,
    },
  });

  const raw = response.text ?? "";
  const cleaned = raw.replace(/```json\s*|```\s*/g, "").trim();

  if (!cleaned) {
    throw new Error("The AI didn't return a response. Please try again.");
  }

  try {
    return JSON.parse(cleaned) as T;
  } catch {
    throw new Error("The AI returned a response we couldn't parse. Please try again.");
  }
}

export async function generateText(prompt: string, systemInstruction: string): Promise<string> {
  const client = getClient();

  const response = await client.models.generateContent({
    model: MODEL,
    contents: prompt,
    config: {
      systemInstruction,
      temperature: 0.7,
    },
  });

  return (response.text ?? "").trim();
}
