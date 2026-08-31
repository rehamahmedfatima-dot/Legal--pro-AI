import { createClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
  question: z.string().min(1).max(4000)
});

/**
 * Thin proxy from the browser to the ai-legal-assistant Supabase Edge
 * Function. Keeps the Gemini key server/Edge-Function-only and lets us
 * reuse the user's existing Supabase session cookie.
 */
export async function POST(req: NextRequest) {
  const supabase = createClient();

  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const json = await req.json();
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const functionUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/ai-legal-assistant`;

  const res = await fetch(functionUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`
    },
    body: JSON.stringify({ question: parsed.data.question })
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
