import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DocumentGeneratorForm } from "@/components/dashboard/DocumentGeneratorForm";
import { Card } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function DocumentGeneratorPage() {
  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "lawyer" && profile?.role !== "admin") {
    redirect("/client/dashboard");
  }

  const { data: pastDocs } = await supabase
    .from("generated_documents")
    .select("id, title, document_type, created_at")
    .eq("created_by", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="mb-6 text-2xl font-semibold text-navy dark:text-white">
        AI Document Generator
      </h1>

      <DocumentGeneratorForm />

      {pastDocs && pastDocs.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-lg font-semibold text-navy dark:text-white">
            Recently Generated
          </h2>
          <div className="space-y-2">
            {pastDocs.map((d) => (
              <Card key={d.id} className="flex items-center justify-between py-3">
                <span className="text-sm">{d.title}</span>
                <span className="text-xs text-black/50 dark:text-white/50">
                  {d.document_type.replace("_", " ")} ·{" "}
                  {new Date(d.created_at).toLocaleDateString()}
                </span>
              </Card>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
