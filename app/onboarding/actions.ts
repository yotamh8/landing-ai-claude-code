"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SLUG_PATTERN } from "@/lib/business";

export type OnboardingState = { error?: string };

export async function createBusiness(
  _prev: OnboardingState,
  formData: FormData,
): Promise<OnboardingState> {
  const name = String(formData.get("name") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim().toLowerCase();

  if (name.length < 2 || name.length > 80) {
    return { error: "שם העסק צריך להכיל בין 2 ל-80 תווים." };
  }
  if (slug.length < 3 || slug.length > 40 || !SLUG_PATTERN.test(slug)) {
    return {
      error: "הכתובת צריכה להכיל 3–40 תווים: אותיות באנגלית קטנות, ספרות ומקפים בלבד.",
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const { error } = await supabase
    .from("businesses")
    .insert({ name, slug, owner_id: user.id });

  if (error) {
    if (error.code === "23505") {
      return error.message.includes("slug")
        ? { error: "הכתובת הזו כבר תפוסה. נסו כתובת אחרת." }
        : { error: "כבר יש לך עסק במערכת." };
    }
    return { error: "השמירה נכשלה. נסו שוב." };
  }

  redirect("/dashboard");
}
