// Supabase Edge Function (Deno runtime)
// Deploy: supabase functions deploy ai-legal-assistant
// Secret required: supabase secrets set GEMINI_API_KEY=xxxxx

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";
import { callGemini } from "../_shared/gemini.ts";

const DISCLAIMER = "This AI does not replace professional legal advice.";

const SYSTEM_PROMPT = `You are the LegalPro AI legal information assistant.
Answer general legal questions, explain legal terminology in plain language,
and suggest general next procedural steps. You are educational only:
- Never claim to represent the user as their lawyer.
- Never give a definitive answer on the outcome of a specific dispute.
- Keep answers concise and structured.
- Respond in the same language the user asked in (Arabic or English).`;

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response(JSON.stringify({ error: "Missing Authorization header" }), {
      status: 401
    });
  }

  // Verify the caller's Supabase session before spending Gemini quota on them
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } }
  );

  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const { question } = await req.json();
  if (!question || typeof question !== "string" || question.trim().length === 0) {
    return new Response(JSON.stringify({ error: "`question` is required" }), {
      status: 400
    });
  }
  if (question.length > 4000) {
    return new Response(JSON.stringify({ error: "Question is too long" }), { status: 400 });
  }

  const geminiKey = Deno.env.get("GEMINI_API_KEY");
  if (!geminiKey) {
    return new Response(JSON.stringify({ error: "AI service not configured" }), {
      status: 500
    });
  }

  let answer: string;
  try {
    answer = await callGemini({
      apiKey: geminiKey,
      systemPrompt: SYSTEM_PROMPT,
      parts: [{ text: question }],
      temperature: 0.3,
      maxOutputTokens: 1024
    });
  } catch (err) {
    console.error("Gemini API error:", err);
    return new Response(JSON.stringify({ error: "AI service failed" }), { status: 502 });
  }

  // Audit log — service role client, bypasses RLS intentionally for logging only
  const adminSupabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );
  await adminSupabase.from("ai_interactions_log").insert({
    user_id: user.id,
    feature: "assistant",
    input_ref: question.slice(0, 200),
    output_summary: answer.slice(0, 500)
  });

  return new Response(
    JSON.stringify({ answer, disclaimer: DISCLAIMER }),
    { headers: { "Content-Type": "application/json" } }
  );
});
