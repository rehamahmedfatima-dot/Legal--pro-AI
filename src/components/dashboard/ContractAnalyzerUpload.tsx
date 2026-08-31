"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

interface AnalysisResult {
  summary: string;
  risks: { clause: string; issue: string; severity: string }[];
  obligations: { party: string; obligation: string }[];
  rights: { party: string; right: string }[];
  missing_clauses: string[];
  recommendations: string[];
}

const severityColor: Record<string, string> = {
  high: "bg-red-500/10 text-red-600",
  medium: "bg-gold/10 text-gold",
  low: "bg-emerald/10 text-emerald"
};

export function ContractAnalyzerUpload() {
  const supabase = createClient();
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "analyzing" | "done" | "error">(
    "idle"
  );
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  async function handleAnalyze() {
    if (!file) return;
    setError(null);
    setResult(null);

    const allowed = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];
    if (!allowed.includes(file.type)) {
      setError("Only PDF or DOCX files are supported.");
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setError("File is larger than the 15MB limit.");
      return;
    }

    setStatus("uploading");

    const {
      data: { user }
    } = await supabase.auth.getUser();
    if (!user) {
      setError("You must be signed in.");
      setStatus("error");
      return;
    }

    const filePath = `${user.id}/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("contracts")
      .upload(filePath, file, { contentType: file.type });

    if (uploadError) {
      setError(uploadError.message);
      setStatus("error");
      return;
    }

    setStatus("analyzing");

    try {
      const res = await fetch("/api/ai/contract-analyzer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filePath, fileName: file.name, mimeType: file.type })
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Analysis failed.");
        setStatus("error");
        return;
      }

      setResult(data.analysis);
      setStatus("done");
    } catch {
      setError("Network error — please try again.");
      setStatus("error");
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload a Contract</CardTitle>
        </CardHeader>
        <p className="mb-4 text-sm text-black/60 dark:text-white/60">
          PDF or DOCX, up to 15MB. This AI does not replace professional legal advice.
        </p>
        <div className="flex items-center gap-3">
          <input
            type="file"
            accept=".pdf,.docx"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="text-sm"
          />
          <Button
            onClick={handleAnalyze}
            disabled={!file}
            loading={status === "uploading" || status === "analyzing"}
          >
            {status === "uploading"
              ? "Uploading…"
              : status === "analyzing"
                ? "Analyzing…"
                : "Analyze Contract"}
          </Button>
        </div>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </Card>

      {result && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <p className="text-sm text-black/70 dark:text-white/70">{result.summary}</p>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Risks</CardTitle>
            </CardHeader>
            <div className="space-y-2">
              {result.risks.map((r, i) => (
                <div key={i} className="rounded-lg border border-black/5 p-3 dark:border-white/10">
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${severityColor[r.severity] ?? "bg-black/5"}`}
                  >
                    {r.severity}
                  </span>
                  <p className="mt-1 text-sm font-medium">{r.clause}</p>
                  <p className="text-sm text-black/60 dark:text-white/60">{r.issue}</p>
                </div>
              ))}
              {result.risks.length === 0 && (
                <p className="text-sm text-black/50">No significant risks flagged.</p>
              )}
            </div>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Obligations</CardTitle>
              </CardHeader>
              <ul className="space-y-1 text-sm">
                {result.obligations.map((o, i) => (
                  <li key={i}>
                    <span className="font-medium">{o.party}:</span> {o.obligation}
                  </li>
                ))}
              </ul>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Rights</CardTitle>
              </CardHeader>
              <ul className="space-y-1 text-sm">
                {result.rights.map((r, i) => (
                  <li key={i}>
                    <span className="font-medium">{r.party}:</span> {r.right}
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Missing Clauses</CardTitle>
            </CardHeader>
            <ul className="list-inside list-disc text-sm text-black/70 dark:text-white/70">
              {result.missing_clauses.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recommendations</CardTitle>
            </CardHeader>
            <ul className="list-inside list-disc text-sm text-black/70 dark:text-white/70">
              {result.recommendations.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </Card>
        </div>
      )}
    </div>
  );
          }
