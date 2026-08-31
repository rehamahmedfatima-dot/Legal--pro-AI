import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ContractAnalyzerUpload } from "@/components/dashboard/ContractAnalyzerUpload";
import { Card } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function ContractAnalyzerPage() {
  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: pastAnalyses } = await supabase
    .from("contract_analyses")
    .select("id, file_name, status, created_at")
    .eq("uploaded_by", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="mb-6 text-2xl font-semibold text-navy dark:text-white">
        AI Contract Analyzer
      </h1>

      <ContractAnalyzerUpload />

      {pastAnalyses && pastAnalyses.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-lg font-semibold text-navy dark:text-white">
            Recent Analyses
          </h2>
          <div className="space-y-2">
            {pastAnalyses.map((a) => (
              <Card key={a.id} className="flex items-center justify-between py-3">
                <span className="text-sm">{a.file_name}</span>
                <span className="text-xs text-black/50 dark:text-white/50">
                  {a.status} · {new Date(a.created_at).toLocaleDateString()}
                </span>
              </Card>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
