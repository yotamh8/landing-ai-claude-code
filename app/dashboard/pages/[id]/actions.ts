"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getMyBusiness } from "@/lib/business";

export async function deletePage(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");
  const business = await getMyBusiness(supabase, user.id);

  // RLS: אפשר למחוק רק דף של העסק שלך
  const { data: deleted } = await supabase.from("pages").delete().eq("id", id).select("id");

  // מוחקים גם את תמונות הדף מהתיקייה של העסק
  if (business && deleted?.length) {
    const { data: files } = await supabase.storage
      .from("page-images")
      .list(business.id, { search: id });
    if (files?.length) {
      await supabase.storage.from("page-images").remove(files.map((f) => `${business.id}/${f.name}`));
    }
  }
  redirect("/dashboard");
}
