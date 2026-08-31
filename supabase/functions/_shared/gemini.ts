// Shared Gemini helper for all AI Edge Functions.
export const GEMINI_MODEL = "gemini-1.5-pro";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

export interface GeminiPart {
  text?: string;
  inlineData?: { mimeType: string; data: string };
}

export async function callGemini(opts: {
  apiKey: string;
  systemPrompt: string;
  parts: GeminiPart[];
  temperature?: number;
  maxOutputTokens?: number;
}): Promise<string> {
  const res = await fetch(`${GEMINI_URL}?key=${opts.apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: opts.systemPrompt }] },
      contents: [{ role: "user", parts: opts.parts }],
      generationConfig: {
        temperature: opts.temperature ?? 0.3,
        maxOutputTokens: opts.maxOutputTokens ?? 2048
      }
    })
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini API error (${res.status}): ${errText}`);
  }

  const data = await res.json();
  const text: string | undefined = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini returned an empty response");
  return text;
}

/** Strips ```json ... ``` fences some models add, then parses the JSON payload. */
export function parseJsonFromModel<T>(raw: string): T {
  const cleaned = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
  return JSON.parse(cleaned) as T;
}
