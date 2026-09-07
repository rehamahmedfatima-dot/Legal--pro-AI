"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import type { CaseAiWorkspaceDictionary } from "@/lib/i18n/translations";

interface SummaryResult {
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

interface StrategyResult {
  chronological_timeline: { date: string; description: string }[];
  open_questions: string[];
  missing_documents: string[];
  research_flags: string[];
  discussion_topics: string[];
  deadline_reminders: string[];
}

function Bullets({ items, noneLabel }: { items: string[]; noneLabel: string }) {
  if (!items || items.length === 0) {
    return <p className="text-sm text-black/50 dark:text-white/50">{noneLabel}</p>;
  }
  return (
    <ul className="list-inside list-disc text-sm text-black/70 dark:text-white/70">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

export function CaseAiWorkspace({
  caseId,
  t
}: {
  caseId: string;
  t: CaseAiWorkspaceDictionary;
}) {
  const [additionalText, setAdditionalText] = useState("");
  const [summaryId, setSummaryId] = useState<string | null>(null);
  const [summary, setSummary] = useState<SummaryResult | null>(null);
  const [strategy, setStrategy] = useState<StrategyResult | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingStrategy, setLoadingStrategy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generateSummary() {
    setError(null);
    setStrategy(null);
    setLoadingSummary(true);
    try {
      const res = await fetch("/api/ai/case-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caseId, additionalText: additionalText || undefined })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to generate summary.");
        return;
      }
      setSummary(data.result);
      setSummaryId(data.id);
    } catch {
      setError("Network error — please try again.");
    } finally {
      setLoadingSummary(false);
    }
  }

  async function generateStrategy() {
    if (!summaryId) return;
    setError(null);
    setLoadingStrategy(true);
    try {
      const res = await fetch("/api/ai/legal-strategy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caseId, summaryId })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to generate strategy notes.");
        return;
      }
      setStrategy(data.result);
    } catch {
      setError("Network error — please try again.");
    } finally {
      setLoadingStrategy(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t.summaryCardTitle}</CardTitle>
        </CardHeader>
        <p className="mb-3 text-sm text-black/60 dark:text-white/60">{t.summaryCardDesc}</p>
        <textarea
          value={additionalText}
          onChange={(e) => setAdditionalText(e.target.value)}
          rows={4}
          placeholder={t.additionalTextPlaceholder}
          className="w-full rounded-lg border border-black/10 bg-white px-3.5 py-2.5 text-sm dark:border-white/10 dark:bg-bg-dark"
        />
        <Button onClick={generateSummary} loading={loadingSummary} className="mt-3">
          {t.generateSummaryButton}
        </Button>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </Card>

      {summary && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t.summaryTitle}</CardTitle>
            </CardHeader>
            <p className="text-sm text-black/70 dark:text-white/70">{summary.summary}</p>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{t.factsTitle}</CardTitle>
              </CardHeader>
              <Bullets items={summary.facts} noneLabel={t.noneIdentified} />
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{t.legalIssuesTitle}</CardTitle>
              </CardHeader>
              <Bullets items={summary.legal_issues} noneLabel={t.noneIdentified} />
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{t.strengthsTitle}</CardTitle>
              </CardHeader>
              <Bullets items={summary.strengths} noneLabel={t.noneIdentified} />
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{t.weaknessesTitle}</CardTitle>
              </CardHeader>
              <Bullets items={summary.weaknesses} noneLabel={t.noneIdentified} />
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{t.missingInfoTitle}</CardTitle>
              </CardHeader>
              <Bullets items={summary.missing_information} noneLabel={t.noneIdentified} />
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{t.evidenceTitle}</CardTitle>
              </CardHeader>
              <Bullets items={summary.evidence} noneLabel={t.noneIdentified} />
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t.peopleTitle}</CardTitle>
            </CardHeader>
            <ul className="space-y-1 text-sm">
              {summary.people.map((p, i) => (
                <li key={i}>
                  <span className="font-medium">{p.name}</span> — {p.role}
                </li>
              ))}
              {summary.people.length === 0 && (
                <p className="text-black/50 dark:text-white/50">{t.noneIdentified}</p>
              )}
            </ul>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t.strategyCardTitle}</CardTitle>
            </CardHeader>
            <p className="mb-3 text-sm font-medium text-gold">{t.strategyDisclaimer}</p>
            {!strategy ? (
              <Button onClick={generateStrategy} loading={loadingStrategy}>
                {t.generateStrategyButton}
              </Button>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-black/50 dark:text-white/50">
                    {t.openQuestionsTitle}
                  </p>
                  <Bullets items={strategy.open_questions} noneLabel={t.noneIdentified} />
                </div>
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-black/50 dark:text-white/50">
                    {t.missingDocumentsTitle}
                  </p>
                  <Bullets items={strategy.missing_documents} noneLabel={t.noneIdentified} />
                </div>
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-black/50 dark:text-white/50">
                    {t.researchFlagsTitle}
                  </p>
                  <Bullets items={strategy.research_flags} noneLabel={t.noneIdentified} />
                </div>
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-black/50 dark:text-white/50">
                    {t.discussionTopicsTitle}
                  </p>
                  <Bullets items={strategy.discussion_topics} noneLabel={t.noneIdentified} />
                </div>
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-black/50 dark:text-white/50">
                    {t.deadlineRemindersTitle}
                  </p>
                  <Bullets items={strategy.deadline_reminders} noneLabel={t.noneIdentified} />
                </div>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
