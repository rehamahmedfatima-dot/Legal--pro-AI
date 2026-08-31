import { createClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";
import { analyzeContractSchema } from "@/lib/validation/ai";

/**
 * Thin proxy from the browser to the ai-contract-analyzer Supabase Edge
 * Function. The file itself is uploaded directly to Supabase Storage by
 * the client beforehand — this route only kicks off the analysis of an
 * already-uploaded file.
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
  const parsed = analyzeContractSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const functionUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/ai-contract-analyzer`;

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
