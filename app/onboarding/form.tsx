"use client";

import { useActionState, useState } from "react";
import { createBusiness, type OnboardingState } from "./actions";

export function OnboardingForm() {
  const [state, action, pending] = useActionState<OnboardingState, FormData>(
    createBusiness,
    {},
  );
  const [slug, setSlug] = useState("");

  return (
    <form action={action} className="flex w-full flex-col gap-5 text-right">
      <label className="flex flex-col gap-2">
        <span className="font-medium">שם העסק</span>
        <input
          name="name"
          required
          minLength={2}
          maxLength={80}
          placeholder="למשל: המאפייה של רותי"
          className="rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900"
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="font-medium">כתובת קצרה באנגלית</span>
        <input
          name="slug"
          required
          dir="ltr"
          minLength={3}
          maxLength={40}
          pattern="[a-z0-9]+(-[a-z0-9]+)*"
          placeholder="ruthis-bakery"
          value={slug}
          onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
          className="rounded-lg border border-slate-300 bg-white px-4 py-3 text-left text-slate-900"
        />
        <span className="text-sm opacity-70">
          אותיות באנגלית קטנות, ספרות ומקפים. הכתובת שלך:{" "}
          <span dir="ltr" className="font-mono">/{slug || "your-business"}</span>
        </span>
      </label>

      {state.error && (
        <p role="alert" className="rounded-lg bg-red-100 px-4 py-2 text-red-800">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-xl bg-slate-900 px-6 py-3 font-medium text-white hover:opacity-90 disabled:opacity-50 dark:bg-white dark:text-slate-900"
      >
        {pending ? "שומר..." : "יצירת העסק"}
      </button>
    </form>
  );
}
