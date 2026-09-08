import { createClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";
import { sendMessageSchema } from "@/lib/validation/message";

/**
 * Inserts a message on behalf of the signed-in user. No service role
 * needed here — the "messages: insert as self" RLS policy already
 * guarantees sender_id must equal the caller's own auth.uid().
 */
export async function POST(req: NextRequest) {
  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const json = await req.json();
  const parsed = sendMessageSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("messages")
    .insert({
      sender_id: user.id,
      receiver_id: parsed.data.receiverId,
      case_id: parsed.data.caseId ?? null,
      body: parsed.data.body
    })
    .select("id, sender_id, receiver_id, body, created_at")
    .single();

  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? "Failed to send message" }, { status: 500 });
  }

  return NextResponse.json({ message: data });
}
