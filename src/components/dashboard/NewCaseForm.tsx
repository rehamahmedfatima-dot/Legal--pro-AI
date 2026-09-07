"use client";

import { useFormState, useFormStatus } from "react-dom";
import { createCaseAction, type CreateCaseState } from "@/app/lawyer/cases/new/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { NewCaseDictionary, PriorityDictionary } from "@/lib/i18n/translations";

interface ClientOption {
  id: string;
  full_name: string;
}

const initialState: CreateCaseState = { error: null };

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" loading={pending} className="w-full">
      {label}
    </Button>
  );
}

export function NewCaseForm({
  clients,
  t,
  priorityLabels
}: {
  clients: ClientOption[];
  t: NewCaseDictionary;
  priorityLabels: PriorityDictionary;
}) {
  const [state, formAction] = useFormState(createCaseAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium">{t.caseTitle}</label>
        <Input name="title" placeholder={t.titlePlaceholder} required />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">{t.category}</label>
        <Input name="category" placeholder={t.categoryPlaceholder} required />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">{t.client}</label>
        <select
          name="clientId"
          required
          className="w-full rounded-lg border border-black/10 bg-white px-3.5 py-2.5 text-sm dark:border-white/10 dark:bg-bg-dark"
        >
          <option value="">{t.selectClient}</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.full_name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">{t.priority}</label>
        <select
          name="priority"
          defaultValue="medium"
          className="w-full rounded-lg border border-black/10 bg-white px-3.5 py-2.5 text-sm dark:border-white/10 dark:bg-bg-dark"
        >
          <option value="low">{priorityLabels.low}</option>
          <option value="medium">{priorityLabels.medium}</option>
          <option value="high">{priorityLabels.high}</option>
          <option value="urgent">{priorityLabels.urgent}</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">{t.court}</label>
          <Input name="courtName" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">{t.judge}</label>
          <Input name="judgeName" />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">{t.summary}</label>
        <textarea
          name="summary"
          rows={4}
          className="w-full rounded-lg border border-black/10 bg-white px-3.5 py-2.5 text-sm dark:border-white/10 dark:bg-bg-dark"
        />
      </div>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <SubmitButton label={t.createCase} />
    </form>
  );
}
