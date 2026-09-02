import { LoginForm } from "@/components/auth/LoginForm";

export const dynamic = "force-dynamic";

export const metadata = { title: "Sign in — LegalPro AI" };

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-light px-4 dark:bg-bg-dark">
      <div className="w-full max-w-md rounded-xl2 border border-black/5 bg-white/80 p-8 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-white/5">
        <h1 className="mb-1 text-2xl font-semibold text-navy dark:text-white">
          Welcome back
        </h1>
        <p className="mb-6 text-sm text-black/60 dark:text-white/60">
          Sign in to your LegalPro AI account.
        </p>
        <LoginForm />
        <p className="mt-6 text-center text-sm text-black/60 dark:text-white/60">
          Don&apos;t have an account?{" "}
          <a href="/register" className="text-gold underline">
            Create one
          </a>
        </p>
      </div>
    </div>
  );
}
