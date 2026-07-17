import { GoogleGenAI } from "@google/genai";

// Store initialized clients to avoid re-initializing
const clients = new Map<string, GoogleGenAI>();

function getApiKeys(): string[] {
  // Support both a single key or a comma-separated list of keys
  const keysStr = process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY;
  if (!keysStr) {
    throw new Error(
      "GEMINI_API_KEY or GEMINI_API_KEYS is not configured. Add it to your .env.local file."
    );
  }
  return keysStr.split(",").map(k => k.trim()).filter(Boolean);
}

function getClient(key: string): GoogleGenAI {
  if (!clients.has(key)) {
    clients.set(key, new GoogleGenAI({ apiKey: key }));
  }
  return clients.get(key)!;
}

// Model fallback list. If the primary model is completely overloaded globally,
// we automatically gracefully degrade to the lighter, faster 8B model which has much higher capacity.
const MODELS = [
  process.env.GEMINI_MODEL || "gemini-flash-latest",
  "gemini-pro-latest"
];

/**
 * Executes a Gemini API call with automatic fallback across multiple API keys AND models.
 * If a 429 or 503 is encountered, it retries with the next key, and if all keys fail, the next model.
 */
async function executeWithRotation<T>(
  operation: (client: GoogleGenAI, modelName: string) => Promise<T>
): Promise<T> {
  const keys = getApiKeys();
  
  // Shuffle keys so we don't always hit the first one first (simple load balancing)
  const shuffledKeys = [...keys].sort(() => Math.random() - 0.5);
  
  let lastError: unknown;

  for (const model of MODELS) {
    for (const key of shuffledKeys) {
      try {
        const client = getClient(key);
        return await operation(client, model);
      } catch (error: unknown) {
        lastError = error;
        
        // Check if it's a rate limit or quota exceeded error
        // 429 status or RESOURCE_EXHAUSTED
        // OR if it's a 503 High Demand / UNAVAILABLE error
        const err = error as Record<string, unknown>;
        const isRateLimitOrUnavailable = 
          err?.status === 429 || 
          err?.status === "RESOURCE_EXHAUSTED" ||
          err?.status === 503 ||
          err?.status === "UNAVAILABLE" ||
          (typeof err?.message === "string" && (
            err.message.includes("429") || 
            err.message.includes("Quota exceeded") ||
            err.message.includes("503") ||
            err.message.includes("high demand")
          ));
          
        if (isRateLimitOrUnavailable) {
          console.warn(`[Gemini API] Key ending in ...${key.slice(-4)} hit rate limit or 503 on ${model}. Trying next...`);
          continue; // Try the next key or model
        }
        
        // If it's not a rate limit error, throw immediately (e.g., bad prompt)
        throw error;
      }
    }
  }

// If we exhausted all keys, throw the last rate limit error
  throw lastError;
}

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
      return new Error("Konita is currently experiencing high demand. Please try again in a few moments.");
    }
    if (msg.includes("429") || msg.includes("Quota exceeded") || msg.includes("RESOURCE_EXHAUSTED")) {
      return new Error("Konita is currently at capacity. Please try again in a few moments.");
    }

    return new Error(msg);
  }
  return new Error("An unexpected error occurred with the AI. Please try again.");
}

export async function generateJson<T>(prompt: string, systemInstruction: string): Promise<T> {
  let response;
  try {
    response = await executeWithRotation(async (client, modelName) => {
      return await client.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          temperature: 0.4,
        },
      });
    });
  } catch (error) {
    throw formatGeminiError(error);
  }

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
  let response;
  try {
    response = await executeWithRotation(async (client, modelName) => {
      return await client.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });
    });
  } catch (error) {
    throw formatGeminiError(error);
  }

  return (response.text ?? "").trim();
}
