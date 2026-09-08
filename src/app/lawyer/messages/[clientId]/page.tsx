import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { MessageThread } from "@/components/dashboard/MessageThread";
import { getLocale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/translations";

export const dynamic = "force-dynamic";

export default async function LawyerMessageThreadPage({
  params
}: {
  params: { clientId: string };
}) {
  const locale = getLocale();
  const t = getDictionary(locale);
  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Ownership check: this lawyer must actually have a case with this client
  const { data: relationship } = await supabase
    .from("cases")
    .select("id")
    .eq("lawyer_id", user.id)
    .eq("client_id", params.clientId)
    .limit(1)
    .maybeSingle();

  if (!relationship) notFound();

  const { data: client } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", params.clientId)
    .single();

  const { data: messages } = await supabase
    .from("messages")
    .select("id, sender_id, receiver_id, body, created_at")
    .or(
      `and(sender_id.eq.${user.id},receiver_id.eq.${params.clientId}),and(sender_id.eq.${params.clientId},receiver_id.eq.${user.id})`
    )
    .order("created_at", { ascending: true });

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <MessageThread
        currentUserId={user.id}
        partnerId={params.clientId}
        partnerName={client?.full_name ?? "—"}
        initialMessages={messages ?? []}
        t={t.messaging}
        locale={locale}
      />
    </main>
  );
}
