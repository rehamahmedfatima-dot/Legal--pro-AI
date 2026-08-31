"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/lib/validation/auth";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  const router = useRouter();
  const supabase = createClient();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginInput) {
    setServerError(null);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password
    });

    if (error) {
      setServerError(error.message);
      return;
    }

    const userId = data.user?.id;
    if (!userId) {
      setServerError("Login failed — no session returned.");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    router.refresh();
    switch (profile?.role) {
      case "admin":
        router.push("/admin/dashboard");
        break;
      case "lawyer":
        router.push("/lawyer/dashboard");
        break;
      default:
        router.push("/client/dashboard");
    }
  }

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/api/auth/callback` }
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-navy dark:text-white">
          Email
        </label>
        <Input type="email" placeholder="you@example.com" {...register("email")} />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-navy dark:text-white">
          Password
        </label>
        <Input type="password" placeholder="••••••••" {...register("password")} />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      {serverError && <p className="text-sm text-red-600">{serverError}</p>}

      <Button type="submit" className="w-full" loading={isSubmitting}>
        Sign in
      </Button>

      <Button
        type="button"
        variant="ghost"
        className="w-full border border-black/10 dark:border-white/10"
        onClick={signInWithGoogle}
      >
        Continue with Google
      </Button>
    </form>
  );
}
