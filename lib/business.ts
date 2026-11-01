import type { SupabaseClient } from "@supabase/supabase-js";
import type { Style } from "./brief";

export const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export type Business = {
  id: string;
  name: string;
  slug: string;
  field: string | null;
  city: string | null;
  description: string | null;
  audience: string | null;
  style: Style | null;
};

export async function getMyBusiness(supabase: SupabaseClient, userId: string) {
  const { data } = await supabase
    .from("businesses")
    .select("id, name, slug, field, city, description, audience, style")
    .eq("owner_id", userId)
    .maybeSingle<Business>();
  return data;
}
