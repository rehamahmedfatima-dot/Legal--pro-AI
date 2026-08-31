// Supabase Edge Function (Deno runtime)
// Deploy: supabase functions deploy ai-document-generator
// Generates an editable legal document draft from structured form fields
// and stores it in `generated_documents`. Restricted to lawyer/admin roles.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";
import { callGemini } from "../_shared/gemini.ts";

const DISCLAIMER = "Draft for review by a licensed lawyer before use.";

const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  contract: "General Contract",
  legal_notice: "Legal Notice",
  power_of_attorney: "Power of Attorney",
  declaration: "Declaration",
  court_request: "Court Request",
  legal_letter: "Legal Letter",
  employment_contract: "Employment Contract",
  rental_contract: "Rental Contract",
  purchase_agreement: "Purchase Agreement",
  company_formation: "Company Formation Document"
};

interface GenerateRequestBody {
  documentType: keyof typeof DOCUMENT_TYPE_LABELS;
  title: string;
  fields: Record<string, string>;
  language?: "ar" | "en";
  caseId?: string;
}

function buildPrompt(body: GenerateRequestBody): string {
  const label = DOCUMENT_TYPE_LABELS[body.documentType] ?? body.documentType;
  const fieldLines = Object.entries(body.fields)
    .filter(([, v]) => v && v.trim().length > 0)
    .map(([k, v]) => `- ${k}: ${v}`)
    .join("\n");

  return `Draft a professional "${label}" titled "${body.title}".
Use the following details supplied by the drafting lawyer:
${fieldLines || "(no additional details provided — use reasonable standard clauses)"}

Requirements:
- Write the full document text, formatted with clear numbered sections/clauses.
- Use standard legal drafting conventions for this document type.
- Leave clearly marked placeholders like [DATE] or [SIGNATURE] where a
  human must fill in something not provided above.
- Do not include any commentary before or after the document itself.`;
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

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || (profile.role !== "lawyer" && profile.role !== "admin")) {
    return new Response(
      JSON.stringify({ error: "Only lawyers and admins can generate documents" }),
      { status: 403 }
    );
  }

  const body = (await req.json()) as GenerateRequestBody;
  if (!body.documentType || !DOCUMENT_TYPE_LABELS[body.documentType] || !body.title) {
    return new Response(JSON.stringify({ error: "documentType and title are required" }), {
      status: 400
    });
  }
  if (!body.fields || typeof body.fields !== "object") {
    return new Response(JSON.stringify({ error: "fields object is required" }), {
      status: 400
    });
  }

  const geminiKey = Deno.env.get("GEMINI_API_KEY");
  if (!geminiKey) {
    return new Response(JSON.stringify({ error: "AI service not configured" }), {
      status: 500
    });
  }

  const language = body.language === "en" ? "English" : "Arabic";
  const systemPrompt = `You are the LegalPro AI document drafting engine.
Write the requested legal document in ${language}. Output ONLY the document
text — no preamble, no markdown fences, no explanation.`;

  try {
    const content = await callGemini({
      apiKey: geminiKey,
      systemPrompt,
      parts: [{ text: buildPrompt(body) }],
      temperature: 0.4,
      maxOutputTokens: 3072
    });

    const adminSupabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: doc, error: insertError } = await adminSupabase
      .from("generated_documents")
      .insert({
        created_by: user.id,
        case_id: body.caseId ?? null,
        document_type: body.documentType,
        title: body.title,
        content,
        form_data: body.fields,
        language: body.language ?? "ar"
      })
      .select("id, created_at")
      .single();

    if (insertError || !doc) {
      throw new Error(insertError?.message ?? "Failed to save generated document");
    }

    await adminSupabase.from("ai_interactions_log").insert({
      user_id: user.id,
      feature: "document_generator",
      input_ref: body.title,
      output_summary: content.slice(0, 500)
    });

    return new Response(
      JSON.stringify({ id: doc.id, content, disclaimer: DISCLAIMER }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Document generation failed:", err);
    return new Response(JSON.stringify({ error: "Document generation failed" }), {
      status: 502
    });
  }
});
