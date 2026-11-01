"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BriefFields } from "@/components/brief-fields";
import { GeneratingNotice } from "@/components/generating";
import { briefFromFormData } from "@/lib/brief";
import { requestGeneration } from "@/lib/generate-client";
import { createBusiness } from "./actions";

type Stage = "idle" | "saving" | "generating";

export function OnboardingForm() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("idle");
  const [error, setError] = useState<string>();
  const [slug, setSlug] = useState("");

  async function submit(formData: FormData) {
    setError(undefined);
    setStage("saving");
    const saved = await createBusiness(formData);
    if ("error" in saved) {
      setError(saved.error);
      setStage("idle");
      return;
    }

    // העסק נשמר. יוצרים מיד את דף הנחיתה הראשון
    setStage("generating");
    const result = await requestGeneration(briefFromFormData(formData));
    router.push("error" in result ? "/dashboard?error=generate" : `/dashboard/pages/${result.id}`);
  }

  const busy = stage !== "idle";

  return (
    <form action={submit} className="flex w-full flex-col gap-5">
      <fieldset disabled={busy} className="flex flex-col gap-5 disabled:opacity-60">
        <BriefFields />

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
            className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-left"
          />
          <span className="text-sm opacity-70">
            אותיות באנגלית קטנות, ספרות ומקפים. הכתובת שלך:{" "}
            <span dir="ltr" className="font-mono">/{slug || "your-business"}</span>
          </span>
        </label>
      </fieldset>

      {error && (
        <p role="alert" className="rounded-lg bg-red-100 px-4 py-2 text-red-800">
          {error}
        </p>
      )}

      {stage === "generating" ? (
        <GeneratingNotice text="העסק נשמר. כותבים את דף הנחיתה הראשון שלך…" />
      ) : (
        <button
          type="submit"
          disabled={busy}
          className="pressable rounded-xl bg-[var(--foreground)] px-6 py-3 font-medium text-[var(--background)] hover:opacity-90 disabled:opacity-50"
        >
          {stage === "saving" ? "שומר…" : "יצירת העסק והדף הראשון"}
        </button>
      )}
    </form>
  );
}
