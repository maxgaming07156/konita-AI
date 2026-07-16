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

// gemini-2.5-flash is free-tier eligible as of mid-2026. Google periodically
// retires older models (e.g. gemini-2.0-flash was shut down June 1, 2026),
// so this is overridable via GEMINI_MODEL in .env.local without a code change.
const MODEL = process.env.GEMINI_MODEL || "gemini-flash-latest";

/**
 * Executes a Gemini API call with automatic fallback across multiple API keys.
 * If a 429 (Too Many Requests / Quota Exceeded) is encountered, it instantly retries with the next key.
 */
async function executeWithRotation<T>(
  operation: (client: GoogleGenAI) => Promise<T>
): Promise<T> {
  const keys = getApiKeys();
  
  // Shuffle keys so we don't always hit the first one first (simple load balancing)
  const shuffledKeys = [...keys].sort(() => Math.random() - 0.5);
  
  let lastError: unknown;

  for (const key of shuffledKeys) {
    try {
      const client = getClient(key);
      return await operation(client);
    } catch (error: any) {
      lastError = error;
      
      // Check if it's a rate limit or quota exceeded error
      // 429 status or RESOURCE_EXHAUSTED
      const isRateLimit = 
        error?.status === 429 || 
        error?.status === "RESOURCE_EXHAUSTED" ||
        error?.message?.includes("429") ||
        error?.message?.includes("Quota exceeded");
        
      if (isRateLimit) {
        console.warn(`[Gemini API] Key ending in ...${key.slice(-4)} hit rate limit. Trying next key...`);
        continue; // Try the next key in the pool
      }
      
      // If it's not a rate limit error, throw immediately (e.g., bad prompt)
      throw error;
    }
  }

  // If we exhausted all keys, throw the last rate limit error
  throw lastError;
}

export async function generateJson<T>(prompt: string, systemInstruction: string): Promise<T> {
  const response = await executeWithRotation(async (client) => {
    return await client.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        temperature: 0.4,
      },
    });
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
  const response = await executeWithRotation(async (client) => {
    return await client.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });
  });

  return (response.text ?? "").trim();
}
