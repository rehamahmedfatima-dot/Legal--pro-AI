"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { documentTypes } from "@/lib/validation/ai";
import type { DocumentGeneratorDictionary } from "@/lib/i18n/translations";

export function DocumentGeneratorForm({ t }: { t: DocumentGeneratorDictionary }) {
  const [documentType, setDocumentType] =
    useState<(typeof documentTypes)[number]>("contract");
  const [title, setTitle] = useState("");
  const [partyA, setPartyA] = useState("");
  const [partyB, setPartyB] = useState("");
  const [keyTerms, setKeyTerms] = useState("");
  const [language, setLanguage] = useState<"ar" | "en">("ar");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState<string | null>(null);

  async function handleGenerate() {
    setError(null);
    setContent(null);

    if (title.trim().length < 3) {
      setError("Please enter a title of at least 3 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/ai/document-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentType,
          title,
          language,
          fields: { partyA, partyB, keyTerms }
        })
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Generation failed.");
        return;
      }

      setContent(data.content);
    } catch {
      setError("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t.formTitle}</CardTitle>
        </CardHeader>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">{t.documentType}</label>
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value as typeof documentType)}
              className="w-full rounded-lg border border-black/10 bg-white px-3.5 py-2.5 text-sm dark:border-white/10 dark:bg-bg-dark"
            >
              {documentTypes.map((type) => (
                <option key={type} value={type}>
                  {t.types[type]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">{t.titleLabel}</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t.titlePlaceholder}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">{t.partyA}</label>
              <Input value={partyA} onChange={(e) => setPartyA(e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">{t.partyB}</label>
              <Input value={partyB} onChange={(e) => setPartyB(e.target.value)} />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">{t.keyTerms}</label>
            <textarea
              rows={4}
              value={keyTerms}
              onChange={(e) => setKeyTerms(e.target.value)}
              placeholder={t.keyTermsPlaceholder}
              className="w-full rounded-lg border border-black/10 bg-white px-3.5 py-2.5 text-sm dark:border-white/10 dark:bg-bg-dark"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">{t.language}</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as "ar" | "en")}
              className="w-full rounded-lg border border-black/10 bg-white px-3.5 py-2.5 text-sm dark:border-white/10 dark:bg-bg-dark"
            >
              <option value="ar">{t.arabic}</option>
              <option value="en">{t.english}</option>
            </select>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button onClick={handleGenerate} loading={loading} className="w-full">
            {t.generateDraft}
          </Button>
        </div>
      </Card>

      {content && (
        <Card>
          <CardHeader>
            <CardTitle>{t.draftTitle}</CardTitle>
          </CardHeader>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={20}
            className="w-full rounded-lg border border-black/10 bg-white p-4 font-mono text-sm leading-relaxed dark:border-white/10 dark:bg-bg-dark"
          />
        </Card>
      )}
    </div>
  );
}
