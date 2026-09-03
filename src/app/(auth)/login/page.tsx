import { LoginForm } from "@/components/auth/LoginForm";
import { getLocale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/translations";

export const dynamic = "force-dynamic";

export const metadata = { title: "Sign in — LegalPro AI" };

export default function LoginPage() {
  const locale = getLocale();
  const t = getDictionary(locale);

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-light px-4 dark:bg-bg-dark">
      <div className="w-full max-w-md rounded-xl2 border border-black/5 bg-white/80 p-8 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-white/5">
        <h1 className="mb-1 text-2xl font-semibold text-navy dark:text-white">
          {t.auth.welcomeBack}
        </h1>
        <p className="mb-6 text-sm text-black/60 dark:text-white/60">
          {t.auth.signInSubtitle}
        </p>
        <LoginForm t={t.auth} />
        <p className="mt-6 text-center text-sm text-black/60 dark:text-white/60">
          {t.auth.dontHaveAccount}{" "}
          <a href="/register" className="text-gold underline">
            {t.auth.createOne}
          </a>
        </p>
      </div>
    </div>
  );
}
