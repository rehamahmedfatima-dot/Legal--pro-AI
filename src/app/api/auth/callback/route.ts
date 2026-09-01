import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Handles both:
 * - Email confirmation links (Supabase sends the user here with ?code=...)
 * - Google OAuth callback (same ?code= exchange flow)
 * Exchanges the one-time code for a real session, then sends the user
 * on to their dashboard (or wherever `next` / `redirectTo` points).
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const redirectTo = searchParams.get("redirectTo") ?? "/";

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${redirectTo}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=confirmation_failed`);
}
