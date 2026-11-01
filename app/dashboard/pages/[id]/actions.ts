"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function deletePage(id: string) {
  const supabase = await createClient();
  // RLS: אפשר למחוק רק דף של העסק שלך
  await supabase.from("pages").delete().eq("id", id);
  redirect("/dashboard");
}
