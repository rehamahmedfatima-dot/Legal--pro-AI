import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { CaseAiWorkspace } from "@/components/dashboard/CaseAiWorkspace";
import { getLocale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/translations";

export const dynamic = "force-dynamic";

export default async function CaseDetailPage({ params }: { params: { id: string } }) {
  const locale = getLocale();
  const t = getDictionary(locale);
  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: caseData } = await supabase
    .from("cases")
    .select(
      "id, case_number, title, category, status, priority, court_name, judge_name, summary, client_id"
    )
    .eq("id", params.id)
    .single();

  if (!caseData) notFound();

  const [{ data: client }, { data: timeline }] = await Promise.all([
    supabase.from("profiles").select("full_name, email").eq("id", caseData.client_id).single(),
    supabase
      .from("case_timeline_events")
      .select("id, event_type, title, description, event_date")
      .eq("case_id", caseData.id)
      .order("event_date", { ascending: false })
  ]);

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-navy dark:text-white">
            {caseData.title}
          </h1>
          <p className="text-sm text-black/60 dark:text-white/60">
            #{caseData.case_number} · {caseData.category}
          </p>
        </div>
        <span className="rounded-full bg-navy/5 px-3 py-1 text-xs font-medium text-navy dark:bg-white/10 dark:text-white">
          {t.status[caseData.status]}
        </span>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t.caseDetail.client}</CardTitle>
          </CardHeader>
          <p className="text-sm">{client?.full_name}</p>
          <p className="text-sm text-black/60 dark:text-white/60">{client?.email}</p>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t.caseDetail.courtDetails}</CardTitle>
          </CardHeader>
          <p className="text-sm">{caseData.court_name || t.caseDetail.notAssigned}</p>
          <p className="text-sm text-black/60 dark:text-white/60">
            {t.caseDetail.judge}: {caseData.judge_name || "—"}
          </p>
        </Card>
      </div>

      {caseData.summary && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>{t.caseDetail.summary}</CardTitle>
          </CardHeader>
          <p className="text-sm text-black/70 dark:text-white/70">{caseData.summary}</p>
        </Card>
      )}

      <section className="mt-10">
        <h2 className="mb-4 text-lg font-semibold text-navy dark:text-white">
          {t.caseDetail.timeline}
        </h2>
        <ol className="relative ms-3 space-y-6 border-s-2 border-gold/30 ps-6">
          {(timeline ?? []).map((event) => (
            <li key={event.id} className="relative">
              <span className="absolute -start-[1.95rem] top-1 h-3 w-3 rounded-full bg-gold" />
              <p className="text-xs font-medium uppercase tracking-wide text-gold">
                {t.eventType[event.event_type as keyof typeof t.eventType] ?? event.event_type}
              </p>
              <p className="font-medium text-navy dark:text-white">{event.title}</p>
              {event.description && (
                <p className="text-sm text-black/60 dark:text-white/60">
                  {event.description}
                </p>
              )}
              <p className="mt-1 text-xs text-black/40 dark:text-white/40">
                {new Date(event.event_date).toLocaleString(locale === "ar" ? "ar-EG" : "en-US")}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-lg font-semibold text-navy dark:text-white">
          {t.caseDetail.aiCaseAnalysis}
        </h2>
        <CaseAiWorkspace caseId={caseData.id} t={t.caseAiWorkspace} />
      </section>
    </main>
  );
}
