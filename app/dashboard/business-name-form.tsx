"use client";

import { useActionState } from "react";
import { updateBusinessName, type UpdateNameState } from "./actions";

export function BusinessNameForm({ name }: { name: string }) {
  const [state, action, pending] = useActionState<UpdateNameState, FormData>(
    updateBusinessName,
    {},
  );

  return (
    <form action={action} className="flex flex-col gap-3">
      <label htmlFor="business-name" className="text-sm font-medium">
        שם העסק
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id="business-name"
          name="name"
          defaultValue={name}
          required
          minLength={2}
          maxLength={80}
          className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5"
        />
        <button
          type="submit"
          disabled={pending}
          className="pressable rounded-lg bg-[var(--foreground)] px-5 py-2.5 font-medium text-[var(--background)] hover:opacity-90 disabled:opacity-50"
        >
          {pending ? "שומר..." : "שמירה"}
        </button>
      </div>
      {state.error && (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      )}
      {state.ok && (
        <p role="status" className="text-sm text-green-600">
          נשמר ✓
        </p>
      )}
    </form>
  );
}
