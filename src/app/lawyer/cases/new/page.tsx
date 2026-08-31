import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { NewCaseForm } from "@/components/dashboard/NewCaseForm";
import { Card } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function NewCasePage() {
  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // In production this list would be scoped to clients this lawyer has
  // an existing relationship with, or a searchable combobox. Kept simple here.
  const { data: clients } = await supabase
    .from("profiles")
    .select("id, full_name")
    .eq("role", "client")
    .order("full_name");

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="mb-6 text-2xl font-semibold text-navy dark:text-white">
        Open a New Case
      </h1>
      <Card>
        <NewCaseForm clients={clients ?? []} />
      </Card>
    </main>
  );
}
