import { createClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";
import { generateDocumentSchema } from "@/lib/validation/ai";

/**
 * Thin proxy from the browser to the ai-document-generator Supabase Edge
 * Function. Role enforcement (lawyer/admin only) happens inside the Edge
 * Function itself, using the caller's verified Supabase session.
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
  const parsed = generateDocumentSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const functionUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/ai-document-generator`;

  const res = await fetch(functionUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`
    },
    body: JSON.stringify(parsed.data)
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
