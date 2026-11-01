"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BriefFields, type BriefDefaults } from "@/components/brief-fields";
import { GeneratingNotice } from "@/components/generating";
import { briefFromFormData } from "@/lib/brief";
import { requestGeneration } from "@/lib/generate-client";

export function NewPageForm({ defaults }: { defaults: BriefDefaults }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();

  async function submit(formData: FormData) {
    setError(undefined);
    setBusy(true);
    const result = await requestGeneration(briefFromFormData(formData));
    if ("error" in result) {
      setError(result.error);
      setBusy(false);
      return;
    }
    router.push(`/dashboard/pages/${result.id}`);
  }

  return (
    <form action={submit} className="flex flex-col gap-5">
      <fieldset disabled={busy} className="flex flex-col gap-5 disabled:opacity-60">
        <BriefFields defaults={defaults} />
      </fieldset>

      {error && (
        <p role="alert" className="rounded-lg bg-red-100 px-4 py-2 text-red-800">
          {error}
        </p>
      )}

      {busy ? (
        <GeneratingNotice text="כותבים את הדף… זה לוקח בדרך כלל כמה שניות." />
      ) : (
        <button
          type="submit"
          className="pressable rounded-xl bg-[var(--foreground)] px-6 py-3 font-medium text-[var(--background)] hover:opacity-90"
        >
          יצירת הדף
        </button>
      )}
    </form>
  );
}
