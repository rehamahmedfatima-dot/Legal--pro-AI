"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "@/lib/validation/auth";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { translations } from "@/lib/i18n/translations";

type AuthDictionary = (typeof translations)["en"]["auth"];

export function RegisterForm({ t }: { t: AuthDictionary }) {
  const supabase = createClient();
  const [serverError, setServerError] = useState<string | null>(null);
  const [confirmationSent, setConfirmationSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(values: RegisterInput) {
    setServerError(null);

    // Clients self-register with role "client" by default.
    // Lawyer/admin accounts are created by an admin from the admin panel,
    // never through public self-registration.
    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: { full_name: values.fullName, role: "client" },
        emailRedirectTo: `${window.location.origin}/api/auth/callback`
      }
    });

    if (error) {
      setServerError(error.message);
      return;
    }

    setConfirmationSent(true);
  }

  if (confirmationSent) {
    return (
      <p className="text-sm text-navy dark:text-white">
        {t.checkInbox}{" "}
        <a href="/login" className="text-gold underline">
          {t.signInLink}
        </a>
        .
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-navy dark:text-white">
          {t.fullName}
        </label>
        <Input placeholder="John Doe" {...register("fullName")} />
        {errors.fullName && (
          <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-navy dark:text-white">
          {t.email}
        </label>
        <Input type="email" placeholder="you@example.com" {...register("email")} />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-navy dark:text-white">
          {t.password}
        </label>
        <Input type="password" placeholder="••••••••" {...register("password")} />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-navy dark:text-white">
          {t.confirmPassword}
        </label>
        <Input type="password" placeholder="••••••••" {...register("confirmPassword")} />
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
        )}
      </div>

      {serverError && <p className="text-sm text-red-600">{serverError}</p>}

      <Button type="submit" className="w-full" loading={isSubmitting}>
        {t.createAccount}
      </Button>
    </form>
  );
}
