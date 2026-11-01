"use server";

import { createClient } from "@/lib/supabase/server";
import { SLUG_PATTERN } from "@/lib/business";
import { briefFromFormData, parseBrief } from "@/lib/brief";

export type OnboardingResult = { ok: true } | { error: string };

export async function createBusiness(formData: FormData): Promise<OnboardingResult> {
  const parsed = parseBrief(briefFromFormData(formData));
  if ("error" in parsed) return { error: parsed.error };
  const { brief } = parsed;

  const slug = String(formData.get("slug") ?? "").trim().toLowerCase();
  if (slug.length < 3 || slug.length > 40 || !SLUG_PATTERN.test(slug)) {
    return {
      error: "הכתובת צריכה להכיל 3–40 תווים: אותיות באנגלית קטנות, ספרות ומקפים בלבד.",
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "צריך להתחבר מחדש." };

  const { error } = await supabase.from("businesses").insert({
    owner_id: user.id,
    slug,
    name: brief.name,
    field: brief.field,
    city: brief.city,
    description: brief.description,
    audience: brief.audience,
    style: brief.style,
  });

  if (error) {
    if (error.code === "23505") {
      return error.message.includes("slug")
        ? { error: "הכתובת הזו כבר תפוסה. נסו כתובת אחרת." }
        : { error: "כבר יש לך עסק במערכת." };
    }
    return { error: "השמירה נכשלה. נסו שוב." };
  }
  return { ok: true };
}
