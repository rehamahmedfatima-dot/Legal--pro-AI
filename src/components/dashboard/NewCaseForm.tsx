"use client";

import { useFormState, useFormStatus } from "react-dom";
import { createCaseAction, type CreateCaseState } from "@/app/lawyer/cases/new/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ClientOption {
  id: string;
  full_name: string;
}

const initialState: CreateCaseState = { error: null };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" loading={pending} className="w-full">
      Create Case
    </Button>
  );
}

export function NewCaseForm({ clients }: { clients: ClientOption[] }) {
  const [state, formAction] = useFormState(createCaseAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium">Case title</label>
        <Input name="title" placeholder="e.g. Commercial dispute — ABC Trading" required />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Category</label>
        <Input name="category" placeholder="e.g. Commercial Law" required />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Client</label>
        <select
          name="clientId"
          required
          className="w-full rounded-lg border border-black/10 bg-white px-3.5 py-2.5 text-sm dark:border-white/10 dark:bg-bg-dark"
        >
          <option value="">Select a client</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.full_name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Priority</label>
        <select
          name="priority"
          defaultValue="medium"
          className="w-full rounded-lg border border-black/10 bg-white px-3.5 py-2.5 text-sm dark:border-white/10 dark:bg-bg-dark"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Court (optional)</label>
          <Input name="courtName" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Judge (optional)</label>
          <Input name="judgeName" />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Summary (optional)</label>
        <textarea
          name="summary"
          rows={4}
          className="w-full rounded-lg border border-black/10 bg-white px-3.5 py-2.5 text-sm dark:border-white/10 dark:bg-bg-dark"
        />
      </div>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <SubmitButton />
    </form>
  );
}
