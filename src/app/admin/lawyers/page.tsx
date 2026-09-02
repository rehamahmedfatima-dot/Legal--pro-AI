import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { PromoteToLawyerForm } from "@/components/dashboard/PromoteToLawyerForm";

export const dynamic = "force-dynamic";

export default async function AdminLawyersPage() {
  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: myProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (myProfile?.role !== "admin") redirect("/client/dashboard");

  const { data: lawyers } = await supabase
    .from("profiles")
    .select("id, full_name, email, created_at")
    .eq("role", "lawyer")
    .order("full_name");

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="mb-6 text-2xl font-semibold text-navy dark:text-white">
        Manage Lawyers
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>Promote a Client to Lawyer</CardTitle>
        </CardHeader>
        <p className="mb-4 text-sm text-black/60 dark:text-white/60">
          Enter the email of an existing client account to give it lawyer access.
        </p>
        <PromoteToLawyerForm />
      </Card>

      <section className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-navy dark:text-white">
          Current Lawyers ({lawyers?.length ?? 0})
        </h2>
        {lawyers && lawyers.length > 0 ? (
          <div className="space-y-2">
            {lawyers.map((l) => (
              <Card key={l.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-navy dark:text-white">{l.full_name}</p>
                  <p className="text-xs text-black/50 dark:text-white/50">{l.email}</p>
                </div>
                <span className="text-xs text-black/40 dark:text-white/40">
                  Joined {new Date(l.created_at).toLocaleDateString()}
                </span>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <p className="text-sm text-black/60 dark:text-white/60">No lawyers yet.</p>
          </Card>
        )}
      </section>
    </main>
  );
}
