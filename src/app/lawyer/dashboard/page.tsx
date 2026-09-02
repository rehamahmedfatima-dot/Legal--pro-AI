import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/link-button";

export const dynamic = "force-dynamic";

export default async function LawyerDashboardPage() {
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
          Lawyer Dashboard
        </h1>
        <LinkButton href="/lawyer/cases/new">+ New Case</LinkButton>
      </div>

      <section className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
        <Card>
          <p className="text-3xl font-bold text-gold">{openCount ?? 0}</p>
          <p className="mt-1 text-sm text-black/60 dark:text-white/60">Open Cases</p>
        </Card>
        <Card>
          <p className="text-3xl font-bold text-emerald">{clientCount ?? 0}</p>
          <p className="mt-1 text-sm text-black/60 dark:text-white/60">Active Clients</p>
        </Card>
        <Card>
          <p className="text-3xl font-bold text-navy dark:text-white">
            {cases?.length ?? 0}
          </p>
          <p className="mt-1 text-sm text-black/60 dark:text-white/60">Recent Cases</p>
        </Card>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-lg font-semibold text-navy dark:text-white">
          AI Tools
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Link href="/lawyer/tools/contract-analyzer">
            <Card className="hover:border-gold/40">
              <CardHeader>
                <CardTitle>AI Contract Analyzer</CardTitle>
              </CardHeader>
              <p className="text-sm text-black/60 dark:text-white/60">
                Upload a contract to get clause risks, obligations, rights, and
                missing-clause recommendations.
              </p>
            </Card>
          </Link>
          <Link href="/lawyer/tools/document-generator">
            <Card className="hover:border-gold/40">
              <CardHeader>
                <CardTitle>AI Document Generator</CardTitle>
              </CardHeader>
              <p className="text-sm text-black/60 dark:text-white/60">
                Generate an editable draft contract, notice, POA, or other
                legal document from a short form.
              </p>
            </Card>
          </Link>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-lg font-semibold text-navy dark:text-white">
          Recent Cases
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
                    {c.status.replace("_", " ")}
                  </span>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card>
            <p className="text-sm text-black/60 dark:text-white/60">
              No cases yet — create your first one.
            </p>
          </Card>
        )}
      </section>
    </main>
  );
                }
