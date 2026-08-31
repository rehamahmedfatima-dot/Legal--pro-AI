import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { AiAssistantWidget } from "@/components/dashboard/AiAssistantWidget";

export const dynamic = "force-dynamic";

export default async function ClientDashboardPage() {
  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: profile }, { data: cases }, { data: appointments }] = await Promise.all([
    supabase.from("profiles").select("full_name").eq("id", user.id).single(),
    supabase
      .from("cases")
      .select("id, case_number, title, status, priority, opened_at")
      .eq("client_id", user.id)
      .order("opened_at", { ascending: false }),
    supabase
      .from("appointments")
      .select("id, scheduled_at, status, consultation_type")
      .eq("client_id", user.id)
      .order("scheduled_at", { ascending: true })
      .limit(5)
  ]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-navy dark:text-white">
        Welcome back, {profile?.full_name ?? "there"}
      </h1>
      <p className="mt-1 text-sm text-black/60 dark:text-white/60">
        Here is an overview of your cases and upcoming appointments.
      </p>

      <section className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-navy dark:text-white">
          Your Cases
        </h2>
        {cases && cases.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {cases.map((c) => (
              <Card key={c.id}>
                <CardHeader>
                  <CardTitle>{c.title}</CardTitle>
                </CardHeader>
                <p className="text-sm text-black/60 dark:text-white/60">
                  Case #{c.case_number} — {c.status.replace("_", " ")}
                </p>
                <span className="mt-3 inline-block rounded-full bg-emerald/10 px-3 py-1 text-xs font-medium text-emerald">
                  Priority: {c.priority}
                </span>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <p className="text-sm text-black/60 dark:text-white/60">
              You have no active cases yet.
            </p>
          </Card>
        )}
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-lg font-semibold text-navy dark:text-white">
          Upcoming Appointments
        </h2>
        {appointments && appointments.length > 0 ? (
          <div className="space-y-3">
            {appointments.map((a) => (
              <Card key={a.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-navy dark:text-white">
                    {new Date(a.scheduled_at).toLocaleString()}
                  </p>
                  <p className="text-sm text-black/60 dark:text-white/60 capitalize">
                    {a.consultation_type.replace("_", " ")}
                  </p>
                </div>
                <span className="rounded-full bg-gold/10 px-3 py-1 text-xs font-medium text-gold">
                  {a.status}
                </span>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <p className="text-sm text-black/60 dark:text-white/60">
              No upcoming appointments.
            </p>
          </Card>
        )}
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-lg font-semibold text-navy dark:text-white">
          AI Legal Assistant
        </h2>
        <AiAssistantWidget />
      </section>
    </main>
  );
}
