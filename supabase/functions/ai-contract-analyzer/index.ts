// Supabase Edge Function (Deno runtime)
// Deploy: supabase functions deploy ai-contract-analyzer
// Downloads a previously-uploaded contract from the private `contracts`
// storage bucket, sends it to Gemini as a multimodal document, and stores
// the structured analysis in `contract_analyses`.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";
import { callGemini, parseJsonFromModel } from "../_shared/gemini.ts";

const DISCLAIMER = "This AI does not replace professional legal advice.";

const SYSTEM_PROMPT = `You are the LegalPro AI contract analysis engine.
You will receive a contract document. Analyze it and respond with STRICT JSON
only (no markdown fences, no commentary outside the JSON object) matching
exactly this shape:
{
  "summary": string,
  "risks": [{ "clause": string, "issue": string, "severity": "low"|"medium"|"high" }],
  "obligations": [{ "party": string, "obligation": string }],
  "rights": [{ "party": string, "right": string }],
  "missing_clauses": string[],
  "recommendations": string[]
}
Be specific and cite clause language where useful. Respond in the same
language as the contract (Arabic or English). This is organizational/
educational analysis only — never claim to be a substitute for a licensed
lawyer's review.`;

interface AnalyzeRequestBody {
  filePath: string;
  fileName: string;
  mimeType: string;
  caseId?: string;
}

interface AnalysisResult {
  summary: string;
  risks: { clause: string; issue: string; severity: string }[];
  obligations: { party: string; obligation: string }[];
  rights: { party: string; right: string }[];
  missing_clauses: string[];
  recommendations: string[];
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

  const body = (await req.json()) as AnalyzeRequestBody;
  if (!body.filePath || !body.fileName || !body.mimeType) {
    return new Response(
      JSON.stringify({ error: "filePath, fileName and mimeType are required" }),
      { status: 400 }
    );
  }

  // Ownership check: the uploaded file must live under the caller's own folder
  if (!body.filePath.startsWith(`${user.id}/`)) {
    return new Response(JSON.stringify({ error: "Forbidden file path" }), { status: 403 });
  }

  const allowedMimeTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ];
  if (!allowedMimeTypes.includes(body.mimeType)) {
    return new Response(JSON.stringify({ error: "Unsupported file type" }), { status: 400 });
  }

  const adminSupabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Insert a "pending" row up front so failures are still auditable
  const { data: analysisRow, error: insertError } = await adminSupabase
    .from("contract_analyses")
    .insert({
      uploaded_by: user.id,
      case_id: body.caseId ?? null,
      file_path: body.filePath,
      file_name: body.fileName,
      status: "pending"
    })
    .select("id")
    .single();

  if (insertError || !analysisRow) {
    return new Response(JSON.stringify({ error: "Failed to register analysis" }), {
      status: 500
    });
  }

  try {
    const { data: fileBlob, error: downloadError } = await adminSupabase.storage
      .from("contracts")
      .download(body.filePath);

    if (downloadError || !fileBlob) {
      throw new Error(downloadError?.message ?? "Could not download file");
    }

    if (fileBlob.size > 15 * 1024 * 1024) {
      throw new Error("File exceeds the 15MB analysis limit");
    }

    const arrayBuffer = await fileBlob.arrayBuffer();
    const base64 = btoa(
      new Uint8Array(arrayBuffer).reduce((acc, byte) => acc + String.fromCharCode(byte), "")
    );

    const geminiKey = Deno.env.get("GEMINI_API_KEY");
    if (!geminiKey) throw new Error("AI service not configured");

    const rawResponse = await callGemini({
      apiKey: geminiKey,
      systemPrompt: SYSTEM_PROMPT,
      parts: [
        { text: `Analyze this contract file: ${body.fileName}` },
        { inlineData: { mimeType: body.mimeType, data: base64 } }
      ],
      temperature: 0.2,
      maxOutputTokens: 3072
    });

    const analysis = parseJsonFromModel<AnalysisResult>(rawResponse);

    await adminSupabase
      .from("contract_analyses")
      .update({
        status: "completed",
        summary: analysis.summary,
        risks: analysis.risks,
        obligations: analysis.obligations,
        rights: analysis.rights,
        missing_clauses: analysis.missing_clauses,
        recommendations: analysis.recommendations
      })
      .eq("id", analysisRow.id);

    await adminSupabase.from("ai_interactions_log").insert({
      user_id: user.id,
      feature: "contract_analyzer",
      input_ref: body.fileName,
      output_summary: analysis.summary?.slice(0, 500) ?? null
    });

    return new Response(
      JSON.stringify({ id: analysisRow.id, analysis, disclaimer: DISCLAIMER }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Contract analysis failed:", err);
    await adminSupabase
      .from("contract_analyses")
      .update({ status: "failed", error_message: String(err) })
      .eq("id", analysisRow.id);

    return new Response(JSON.stringify({ error: "Contract analysis failed" }), {
      status: 502
    });
  }
});
