// Supabase Edge Function (Deno runtime)
// Deploy: supabase functions deploy ai-legal-strategy
// Takes an existing case_ai_summaries row and produces organizational
// suggestions only (never legal advice or litigation strategy).
// Restricted to the case's own lawyer or an admin.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";
import { callGemini, parseJsonFromModel } from "../_shared/gemini.ts";

const DISCLAIMER =
  "These are organizational suggestions only — not legal advice or litigation strategy.";

const SYSTEM_PROMPT = `You are the LegalPro AI case organization engine.
You will receive a structured case summary (facts, people, events, legal
issues, strengths, weaknesses, missing information). Produce organizational
support ONLY and respond with STRICT JSON only (no markdown fences, no
commentary outside the JSON object) matching exactly this shape:
{
  "chronological_timeline": [{ "date": string, "description": string }],
  "open_questions": string[],
  "missing_documents": string[],
  "research_flags": string[],
  "discussion_topics": string[],
  "deadline_reminders": string[]
}
Rules:
- Do NOT recommend a litigation strategy, predict outcomes, or give legal
  advice — only organizational scaffolding (what to check, ask, or gather).
- Respond in the same language as the source material (Arabic or English).`;

interface LegalStrategyRequestBody {
  caseId: string;
  summaryId: string;
}

interface LegalStrategyResult {
  chronological_timeline: { date: string; description: string }[];
  open_questions: string[];
  missing_documents: string[];
  research_flags: string[];
  discussion_topics: string[];
  deadline_reminders: string[];
}

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

  const body = (await req.json()) as LegalStrategyRequestBody;
  if (!body.caseId || !body.summaryId) {
    return new Response(JSON.stringify({ error: "caseId and summaryId are required" }), {
      status: 400
    });
  }

  const { data: caseRow, error: caseError } = await supabase
    .from("cases")
    .select("id, lawyer_id")
    .eq("id", body.caseId)
    .single();
  if (caseError || !caseRow) {
    return new Response(JSON.stringify({ error: "Case not found" }), { status: 404 });
  }

  const { data: callerProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  const isOwner = caseRow.lawyer_id === user.id;
  const isAdmin = callerProfile?.role === "admin";
  if (!isOwner && !isAdmin) {
    return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
  }

  const { data: summaryRow, error: summaryError } = await supabase
    .from("case_ai_summaries")
    .select("*")
    .eq("id", body.summaryId)
    .eq("case_id", body.caseId)
    .single();
  if (summaryError || !summaryRow) {
    return new Response(JSON.stringify({ error: "Case summary not found" }), { status: 404 });
  }

  const geminiKey = Deno.env.get("GEMINI_API_KEY");
  if (!geminiKey) {
    return new Response(JSON.stringify({ error: "AI service not configured" }), {
      status: 500
    });
  }

  const sourceText = JSON.stringify({
    summary: summaryRow.summary,
    facts: summaryRow.facts,
    people: summaryRow.people,
    events: summaryRow.events,
    legal_issues: summaryRow.legal_issues,
    strengths: summaryRow.strengths,
    weaknesses: summaryRow.weaknesses,
    missing_information: summaryRow.missing_information
  });

  try {
    const rawResponse = await callGemini({
      apiKey: geminiKey,
      systemPrompt: SYSTEM_PROMPT,
      parts: [{ text: sourceText }],
      temperature: 0.2,
      maxOutputTokens: 2048
    });

    const result = parseJsonFromModel<LegalStrategyResult>(rawResponse);

    const adminSupabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: savedRow, error: insertError } = await adminSupabase
      .from("case_ai_strategies")
      .insert({
        case_id: body.caseId,
        summary_id: body.summaryId,
        created_by: user.id,
        chronological_timeline: result.chronological_timeline,
        open_questions: result.open_questions,
        missing_documents: result.missing_documents,
        research_flags: result.research_flags,
        discussion_topics: result.discussion_topics,
        deadline_reminders: result.deadline_reminders
      })
      .select("id, created_at")
      .single();

    if (insertError || !savedRow) {
      throw new Error(insertError?.message ?? "Failed to save legal strategy");
    }

    await adminSupabase.from("ai_interactions_log").insert({
      user_id: user.id,
      feature: "strategy",
      input_ref: body.caseId,
      output_summary: (result.open_questions ?? []).slice(0, 3).join("; ").slice(0, 500)
    });

    return new Response(
      JSON.stringify({ id: savedRow.id, result, disclaimer: DISCLAIMER }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Legal strategy generation failed:", err);
    return new Response(JSON.stringify({ error: "Legal strategy generation failed" }), {
      status: 502
    });
  }
});
