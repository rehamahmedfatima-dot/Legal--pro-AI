"use client";

import { useFormState, useFormStatus } from "react-dom";
import { promoteToLawyerAction, type PromoteToLawyerState } from "@/app/admin/lawyers/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const initialState: PromoteToLawyerState = { error: null, success: false };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" loading={pending}>
      Make Lawyer
    </Button>
  );
}

export function PromoteToLawyerForm() {
  const [state, formAction] = useFormState(promoteToLawyerAction, initialState);

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-3">
      <div className="flex-1 min-w-[220px]">
        <label className="mb-1 block text-sm font-medium">Client email</label>
        <Input name="email" type="email" placeholder="client@example.com" required />
      </div>
      <SubmitButton />
      {state.error && <p className="w-full text-sm text-red-600">{state.error}</p>}
      {state.success && (
        <p className="w-full text-sm text-emerald">Account promoted to lawyer.</p>
      )}
    </form>
  );
}
