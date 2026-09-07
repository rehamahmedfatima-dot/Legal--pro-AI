import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { NewCaseForm } from "@/components/dashboard/NewCaseForm";
import { Card } from "@/components/ui/card";
import { getLocale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/translations";

export const dynamic = "force-dynamic";

export default async function NewCasePage() {
  const locale = getLocale();
  const t = getDictionary(locale);
  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: clients } = await supabase
    .from("profiles")
    .select("id, full_name")
    .eq("role", "client")
    .order("full_name");

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="mb-6 text-2xl font-semibold text-navy dark:text-white">
        {t.newCase.pageTitle}
      </h1>
      <Card>
        <NewCaseForm clients={clients ?? []} t={t.newCase} priorityLabels={t.priority} />
      </Card>
    </main>
  );
}
