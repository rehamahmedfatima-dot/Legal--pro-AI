"use server";

import { createClient } from "@/lib/supabase/server";
import { createCaseSchema } from "@/lib/validation/case";
import { redirect } from "next/navigation";

export type CreateCaseState = { error: string | null };

function generateCaseNumber() {
  const year = new Date().getFullYear();
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `LP-${year}-${rand}`;
}

export async function createCaseAction(
  _prevState: CreateCaseState,
  formData: FormData
): Promise<CreateCaseState> {
  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in." };

  const parsed = createCaseSchema.safeParse({
    title: formData.get("title"),
    category: formData.get("category"),
    clientId: formData.get("clientId"),
    priority: formData.get("priority") || "medium",
    courtName: formData.get("courtName") || undefined,
    judgeName: formData.get("judgeName") || undefined,
    summary: formData.get("summary") || undefined
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const { data, error } = await supabase
    .from("cases")
    .insert({
      case_number: generateCaseNumber(),
      title: parsed.data.title,
      category: parsed.data.category,
      lawyer_id: user.id,
      client_id: parsed.data.clientId,
      priority: parsed.data.priority,
      court_name: parsed.data.courtName ?? null,
      judge_name: parsed.data.judgeName ?? null,
      summary: parsed.data.summary ?? null
    })
    .select("id")
    .single();

  if (error || !data) {
    return { error: error?.message ?? "Failed to create case." };
  }

  redirect(`/lawyer/cases/${data.id}`);
}
