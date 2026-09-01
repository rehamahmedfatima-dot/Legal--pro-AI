import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SignOutButton } from "@/components/public/SignOutButton";
import { Button } from "@/components/ui/button";

const roleHomePage: Record<string, string> = {
  admin: "/admin/dashboard",
  lawyer: "/lawyer/dashboard",
  client: "/client/dashboard"
};

export async function Header() {
  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  let role: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    role = profile?.role ?? null;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/80 backdrop-blur-md dark:border-white/10 dark:bg-bg-dark/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold text-navy dark:text-white">
          LegalPro <span className="text-gold">AI</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-black/70 dark:text-white/70 md:flex">
          <Link href="/" className="hover:text-gold">
            Home
          </Link>
          <Link href="/services" className="hover:text-gold">
            Services
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {user && role ? (
            <>
              <Link href={roleHomePage[role] ?? "/"}>
                <Button variant="secondary">Dashboard</Button>
              </Link>
              <SignOutButton />
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" className="border border-black/10 dark:border-white/10">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
