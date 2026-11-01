"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type UpdateNameState = { error?: string; ok?: boolean };

export async function updateBusinessName(
  _prev: UpdateNameState,
  formData: FormData,
): Promise<UpdateNameState> {
  const name = String(formData.get("name") ?? "").trim();
  if (name.length < 2 || name.length > 80) {
    return { error: "שם העסק צריך להכיל בין 2 ל-80 תווים." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "צריך להתחבר מחדש." };

  // RLS מבטיח שרק הבעלים יכול לעדכן
  const { error } = await supabase
    .from("businesses")
    .update({ name })
    .eq("owner_id", user.id);

  if (error) return { error: "השמירה נכשלה. נסו שוב." };
  revalidatePath("/dashboard");
  return { ok: true };
}
