import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getMyBusiness } from "@/lib/business";
import { parsePageContent } from "@/lib/page-content";
import { generateHeroImage, ImageGenerationError } from "@/lib/gemini-image";
import type { Style } from "@/lib/brief";

export const runtime = "nodejs";
export const maxDuration = 60;

const EXT: Record<string, string> = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp" };

// שלב שני אחרי /api/generate: יוצר תמונה מה-image_prompt, שומר ב-Storage ומעדכן את הדף
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "צריך להתחבר." }, { status: 401 });

  const business = await getMyBusiness(supabase, user.id);
  if (!business) return NextResponse.json({ error: "לא נמצא עסק לחשבון." }, { status: 403 });

  const { pageId } = (await request.json().catch(() => ({}))) as { pageId?: unknown };
  if (typeof pageId !== "string") return NextResponse.json({ error: "בקשה לא תקינה." }, { status: 400 });

  // "תופסים" את הדף באופן אטומי, כדי ששתי בקשות במקביל לא ייצרו שתי תמונות.
  // תפיסה שנתקעה (השרת נעצר באמצע) משתחררת אחרי 70 שניות
  const stale = new Date(Date.now() - 70_000).toISOString();
  const { data: page } = await supabase
    .from("pages")
    .update({ image_status: "generating" })
    .eq("id", pageId)
    .eq("business_id", business.id)
    .or(`image_status.in.(pending,failed),and(image_status.eq.generating,updated_at.lt.${stale})`)
    .select("id, template, content")
    .maybeSingle<{ id: string; template: Style; content: unknown }>();

  if (!page) return NextResponse.json({ status: "skipped" });

  const fail = async (log: unknown) => {
    console.error("image generation failed:", log);
    await supabase.from("pages").update({ image_status: "failed" }).eq("id", page.id);
    return NextResponse.json({ error: "יצירת התמונה נכשלה. מוצגת תמונת ברירת מחדל." }, { status: 502 });
  };

  const prompt = parsePageContent(page.content)?.image_prompt;
  if (!prompt) return fail("page has no image_prompt");

  let image;
  try {
    image = await generateHeroImage(prompt, page.template);
  } catch (e) {
    return fail(e instanceof ImageGenerationError ? e.message : e);
  }

  // התיקייה של העסק: {business_id}/{page_id}-{time}.{ext}. מדיניות ה-Storage מרשה רק אותה
  const ext = EXT[image.mimeType] ?? "png";
  const path = `${business.id}/${page.id}-${Date.now()}.${ext}`;
  const { error: uploadError } = await supabase.storage
    .from("page-images")
    .upload(path, image.bytes, { contentType: image.mimeType, cacheControl: "31536000" });
  if (uploadError) return fail(uploadError);

  const { data: pub } = supabase.storage.from("page-images").getPublicUrl(path);
  const { error: updateError } = await supabase
    .from("pages")
    .update({ image_url: pub.publicUrl, image_status: "done" })
    .eq("id", page.id);
  if (updateError) return fail(updateError);

  return NextResponse.json({ status: "done", url: pub.publicUrl });
}
