import { GoogleGenAI } from "@google/genai";

let client: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  if (client) return client;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not configured. Add it to your environment variables on Vercel."
    );
  }
  client = new GoogleGenAI({ apiKey });
  return client;
}

// Use the latest stable Flash model. Override with GEMINI_MODEL env var if needed.
const MODEL = process.env.GEMINI_MODEL || "gemini-flash-latest";

/**
 * Extracts a user-friendly error message from a raw Gemini API error.
 */
function formatGeminiError(error: unknown): Error {
  if (error instanceof Error) {
    let msg = error.message;

    // Try to extract JSON if it's embedded in the error message
    const jsonMatch = msg.match(/\{.*\}/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed?.error?.message) {
          msg = parsed.error.message;
        }
      } catch {
        // Ignore parsing errors
      }
    }

    if (msg.includes("503") || msg.includes("UNAVAILABLE") || msg.includes("high demand") || msg.includes("overloaded")) {
      return new Error("Gemini is currently experiencing high demand. Please try Llama instead, or try again in a few moments.");
    }
    if (msg.includes("429") || msg.includes("Quota exceeded") || msg.includes("RESOURCE_EXHAUSTED")) {
      return new Error("Gemini is currently at capacity. Please try Llama instead, or try again in a few moments.");
    }

    return new Error(msg);
  }
  return new Error("An unexpected error occurred with Gemini. Please try again.");
}

export async function generateJson<T>(prompt: string, systemInstruction: string): Promise<T> {
  let response;
  try {
    response = await getClient().models.generateContent({
      model: MODEL,
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        temperature: 0.4,
      },
    });
  } catch (error) {
    throw formatGeminiError(error);
  }

  const raw = response.text ?? "";
  const cleaned = raw.replace(/```json\s*|```\s*/g, "").trim();

  if (!cleaned) {
    throw new Error("Gemini didn't return a response. Please try again.");
  }

  try {
    return JSON.parse(cleaned) as T;
  } catch {
    throw new Error("Gemini returned a response we couldn't parse. Please try again.");
  }
}

export async function generateText(prompt: string, systemInstruction: string): Promise<string> {
  let response;
  try {
    response = await getClient().models.generateContent({
      model: MODEL,
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });
  } catch (error) {
    throw formatGeminiError(error);
  }

  return (response.text ?? "").trim();
}
