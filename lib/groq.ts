import Groq from "groq-sdk";

let groqClient: Groq | null = null;

function getGroqClient(): Groq {
  if (groqClient) return groqClient;
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GROQ_API_KEY is not configured. Add it to your environment variables."
    );
  }
  groqClient = new Groq({ apiKey });
  return groqClient;
}

// Best free model on Groq — fast, multilingual, and highly capable
const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

/**
 * Extracts a user-friendly error message from a raw Groq API error.
 */
function formatGroqError(error: unknown): Error {
  if (error instanceof Error) {
    const msg = error.message;
    if (msg.includes("429") || msg.includes("rate_limit") || msg.includes("Rate limit")) {
      return new Error("Llama (Groq) is currently at capacity. Please try again in a few moments.");
    }
    if (msg.includes("503") || msg.includes("unavailable")) {
      return new Error("Llama (Groq) is currently experiencing high demand. Please try again.");
    }
    if (msg.includes("GROQ_API_KEY")) {
      return error;
    }
    return new Error(msg);
  }
  return new Error("An unexpected error occurred with Llama AI. Please try again.");
}

export async function groqGenerateJson<T>(
  prompt: string,
  systemInstruction: string
): Promise<T> {
  const client = getGroqClient();

  let raw: string;
  try {
    const completion = await client.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: prompt },
      ],
      temperature: 0.4,
      response_format: { type: "json_object" },
    });
    raw = completion.choices[0]?.message?.content ?? "";
  } catch (error) {
    throw formatGroqError(error);
  }

  const cleaned = raw.replace(/```json\s*|```\s*/g, "").trim();

  if (!cleaned) {
    throw new Error("Llama AI didn't return a response. Please try again.");
  }

  try {
    return JSON.parse(cleaned) as T;
  } catch {
    throw new Error("Llama AI returned a response we couldn't parse. Please try again.");
  }
}

export async function groqGenerateText(
  prompt: string,
  systemInstruction: string
): Promise<string> {
  const client = getGroqClient();

  try {
    const completion = await client.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    });
    return (completion.choices[0]?.message?.content ?? "").trim();
  } catch (error) {
    throw formatGroqError(error);
  }
}
