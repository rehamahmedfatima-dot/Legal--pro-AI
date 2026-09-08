import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { getLocale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/translations";

export const dynamic = "force-dynamic";

export default async function ClientMessagesPage() {
  const locale = getLocale();
  const t = getDictionary(locale);
  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: cases } = await supabase
    .from("cases")
    .select("lawyer_id")
    .eq("client_id", user.id);

  const lawyerIds = Array.from(new Set((cases ?? []).map((c) => c.lawyer_id)));

  const { data: lawyers } = lawyerIds.length
    ? await supabase.from("profiles").select("id, full_name").in("id", lawyerIds)
    : { data: [] };

  const { data: unreadRows } = await supabase
    .from("messages")
    .select("sender_id")
    .eq("receiver_id", user.id)
    .is("read_at", null);

  const unreadCount = new Map<string, number>();
  for (const row of unreadRows ?? []) {
    unreadCount.set(row.sender_id, (unreadCount.get(row.sender_id) ?? 0) + 1);
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="mb-6 text-2xl font-semibold text-navy dark:text-white">
        {t.messaging.title}
      </h1>

      {lawyers && lawyers.length > 0 ? (
        <div className="space-y-2">
          {lawyers.map((l) => (
            <Link key={l.id} href={`/client/messages/${l.id}`}>
              <Card className="flex items-center justify-between hover:border-gold/40">
                <span className="font-medium text-navy dark:text-white">{l.full_name}</span>
                {unreadCount.get(l.id) ? (
                  <span className="rounded-full bg-gold/10 px-2.5 py-1 text-xs font-medium text-gold">
                    {unreadCount.get(l.id)} {t.messaging.unreadSuffix}
                  </span>
                ) : null}
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card>
          <p className="text-sm text-black/60 dark:text-white/60">{t.messaging.noContacts}</p>
        </Card>
      )}
    </main>
  );
}
