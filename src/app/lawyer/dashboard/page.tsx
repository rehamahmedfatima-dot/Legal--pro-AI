import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/link-button";
import { getLocale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/translations";

export const dynamic = "force-dynamic";

export default async function LawyerDashboardPage() {
  const locale = getLocale();
  const t = getDictionary(locale);
  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: cases }, { count: openCount }, { count: clientCount }] = await Promise.all([
    supabase
      .from("cases")
      .select("id, case_number, title, status, priority, client_id")
      .eq("lawyer_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("cases")
      .select("id", { count: "exact", head: true })
      .eq("lawyer_id", user.id)
      .neq("status", "closed"),
    supabase
      .from("cases")
      .select("client_id", { count: "exact", head: true })
      .eq("lawyer_id", user.id)
  ]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-navy dark:text-white">
          {t.lawyerDashboard.title}
        </h1>
        <LinkButton href="/lawyer/cases/new">{t.lawyerDashboard.newCase}</LinkButton>
      </div>

      <section className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
        <Card>
          <p className="text-3xl font-bold text-gold">{openCount ?? 0}</p>
          <p className="mt-1 text-sm text-black/60 dark:text-white/60">
            {t.lawyerDashboard.openCases}
          </p>
        </Card>
        <Card>
          <p className="text-3xl font-bold text-emerald">{clientCount ?? 0}</p>
          <p className="mt-1 text-sm text-black/60 dark:text-white/60">
            {t.lawyerDashboard.activeClients}
          </p>
        </Card>
        <Card>
          <p className="text-3xl font-bold text-navy dark:text-white">
            {cases?.length ?? 0}
          </p>
          <p className="mt-1 text-sm text-black/60 dark:text-white/60">
            {t.lawyerDashboard.recentCases}
          </p>
        </Card>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-lg font-semibold text-navy dark:text-white">
          {t.lawyerDashboard.aiToolsTitle}
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Link href="/lawyer/tools/contract-analyzer">
            <Card className="hover:border-gold/40">
              <CardHeader>
                <CardTitle>{t.lawyerDashboard.contractAnalyzerTitle}</CardTitle>
              </CardHeader>
              <p className="text-sm text-black/60 dark:text-white/60">
                {t.lawyerDashboard.contractAnalyzerDesc}
              </p>
            </Card>
          </Link>
          <Link href="/lawyer/tools/document-generator">
            <Card className="hover:border-gold/40">
              <CardHeader>
                <CardTitle>{t.lawyerDashboard.documentGeneratorTitle}</CardTitle>
              </CardHeader>
              <p className="text-sm text-black/60 dark:text-white/60">
                {t.lawyerDashboard.documentGeneratorDesc}
              </p>
            </Card>
          </Link>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-lg font-semibold text-navy dark:text-white">
          {t.lawyerDashboard.recentCasesTitle}
        </h2>
        {cases && cases.length > 0 ? (
          <div className="space-y-3">
            {cases.map((c) => (
              <Link key={c.id} href={`/lawyer/cases/${c.id}`}>
                <Card className="flex items-center justify-between hover:border-gold/40">
                  <div>
                    <p className="font-medium text-navy dark:text-white">{c.title}</p>
                    <p className="text-sm text-black/60 dark:text-white/60">
                      #{c.case_number}
                    </p>
                  </div>
                  <span className="rounded-full bg-navy/5 px-3 py-1 text-xs font-medium text-navy dark:bg-white/10 dark:text-white">
                    {t.status[c.status]}
                  </span>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card>
            <p className="text-sm text-black/60 dark:text-white/60">
              {t.lawyerDashboard.noCasesYet}
            </p>
          </Card>
        )}
      </section>
    </main>
  );
}
