import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata = { title: "Create account — LegalPro AI" };

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-light px-4 dark:bg-bg-dark">
      <div className="w-full max-w-md rounded-xl2 border border-black/5 bg-white/80 p-8 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-white/5">
        <h1 className="mb-1 text-2xl font-semibold text-navy dark:text-white">
          Create your client account
        </h1>
        <p className="mb-6 text-sm text-black/60 dark:text-white/60">
          Lawyer and admin accounts are created by the firm — contact us if you need one.
        </p>
        <RegisterForm />
        <p className="mt-6 text-center text-sm text-black/60 dark:text-white/60">
          Already have an account?{" "}
          <a href="/login" className="text-gold underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
