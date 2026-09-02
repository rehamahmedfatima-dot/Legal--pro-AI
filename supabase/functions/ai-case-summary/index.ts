// Supabase Edge Function (Deno runtime)
// Deploy: supabase functions deploy ai-case-summary
// Pulls a case's existing timeline + summary field, combines it with any
// additional text the lawyer pastes in, and asks Gemini to extract a
// structured case summary. Restricted to the case's own lawyer or an admin.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";
import { callGemini, parseJsonFromModel } from "../_shared/gemini.ts";

const DISCLAIMER = "This AI does not replace professional legal advice.";

const SYSTEM_PROMPT = `You are the LegalPro AI case analysis engine.
You will receive case notes, a case summary, and a timeline of events for a
legal case. Extract a structured overview and respond with STRICT JSON only
(no markdown fences, no commentary outside the JSON object) matching exactly
this shape:
{
  "facts": string[],
  "people": [{ "name": string, "role": string }],
  "events": [{ "date": string, "description": string }],
  "evidence": string[],
  "important_dates": [{ "date": string, "description": string }],
  "legal_issues": string[],
  "strengths": string[],
  "weaknesses": string[],
  "missing_information": string[],
  "timeline": [{ "date": string, "description": string }],
  "summary": string
}
Respond in the same language as the source material (Arabic or English).
This is organizational/educational analysis only — never claim to be a
substitute for a licensed lawyer's judgment.`;

interface CaseSummaryRequestBody {
  caseId: string;
  additionalText?: string;
}

interface CaseSummaryResult {
  facts: string[];
  people: { name: string; role: string }[];
  events: { date: string; description: string }[];
  evidence: string[];
  important_dates: { date: string; description: string }[];
  legal_issues: string[];
  strengths: string[];
  weaknesses: string[];
  missing_information: string[];
  timeline: { date: string; description: string }[];
  summary: string;
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

  const body = (await req.json()) as CaseSummaryRequestBody;
  if (!body.caseId) {
    return new Response(JSON.stringify({ error: "caseId is required" }), { status: 400 });
  }
  if (body.additionalText && body.additionalText.length > 8000) {
    return new Response(JSON.stringify({ error: "additionalText is too long" }), {
      status: 400
    });
  }

  // Ownership check: only the case's own lawyer (or an admin, via the
  // profiles role check) may run AI analysis on it.
  const { data: caseRow, error: caseError } = await supabase
    .from("cases")
    .select("id, title, category, summary, lawyer_id")
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

  const { data: timelineEvents } = await supabase
    .from("case_timeline_events")
    .select("event_type, title, description, event_date")
    .eq("case_id", body.caseId)
    .order("event_date", { ascending: true });

  const timelineText = (timelineEvents ?? [])
    .map((e) => `- [${e.event_type}] ${e.event_date}: ${e.title}${e.description ? " — " + e.description : ""}`)
    .join("\n");

  const sourceText = [
    `Case title: ${caseRow.title}`,
    `Category: ${caseRow.category}`,
    caseRow.summary ? `Existing summary: ${caseRow.summary}` : "",
    timelineText ? `Timeline events:\n${timelineText}` : "",
    body.additionalText ? `Additional notes from the lawyer:\n${body.additionalText}` : ""
  ]
    .filter(Boolean)
    .join("\n\n");

  const geminiKey = Deno.env.get("GEMINI_API_KEY");
  if (!geminiKey) {
    return new Response(JSON.stringify({ error: "AI service not configured" }), {
      status: 500
    });
  }

  try {
    const rawResponse = await callGemini({
      apiKey: geminiKey,
      systemPrompt: SYSTEM_PROMPT,
      parts: [{ text: sourceText }],
      temperature: 0.2,
      maxOutputTokens: 3072
    });

    const result = parseJsonFromModel<CaseSummaryResult>(rawResponse);

    const adminSupabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: savedRow, error: insertError } = await adminSupabase
      .from("case_ai_summaries")
      .insert({
        case_id: body.caseId,
        created_by: user.id,
        input_text: body.additionalText ?? null,
        facts: result.facts,
        people: result.people,
        events: result.events,
        evidence: result.evidence,
        important_dates: result.important_dates,
        legal_issues: result.legal_issues,
        strengths: result.strengths,
        weaknesses: result.weaknesses,
        missing_information: result.missing_information,
        timeline: result.timeline,
        summary: result.summary
      })
      .select("id, created_at")
      .single();

    if (insertError || !savedRow) {
      throw new Error(insertError?.message ?? "Failed to save case summary");
    }

    await adminSupabase.from("ai_interactions_log").insert({
      user_id: user.id,
      feature: "case_summary",
      input_ref: caseRow.title,
      output_summary: result.summary?.slice(0, 500) ?? null
    });

    return new Response(
      JSON.stringify({ id: savedRow.id, result, disclaimer: DISCLAIMER }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Case summary generation failed:", err);
    return new Response(JSON.stringify({ error: "Case summary generation failed" }), {
      status: 502
    });
  }
});
