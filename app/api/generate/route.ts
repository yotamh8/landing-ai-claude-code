import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getMyBusiness } from "@/lib/business";
import { parseBrief } from "@/lib/brief";
import { generatePageContent, GenerationError } from "@/lib/gemini";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "צריך להתחבר." }, { status: 401 });

  const business = await getMyBusiness(supabase, user.id);
  if (!business) return NextResponse.json({ error: "לא נמצא עסק לחשבון." }, { status: 403 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "בקשה לא תקינה." }, { status: 400 });
  }

  const parsed = parseBrief(body);
  if ("error" in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const { brief } = parsed;

  let content;
  try {
    content = await generatePageContent(brief);
  } catch (e) {
    console.error("generate failed:", e instanceof GenerationError ? e.message : e);
    return NextResponse.json(
      { error: "יצירת הדף נכשלה. נסו שוב בעוד רגע." },
      { status: 502 },
    );
  }

  // השמירה עוברת דרך RLS: אפשר להוסיף דף רק לעסק של המשתמש המחובר
  const { data, error } = await supabase
    .from("pages")
    .insert({
      business_id: business.id,
      title: content.title,
      template: brief.style,
      content,
      brief,
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("save page failed:", error);
    return NextResponse.json({ error: "שמירת הדף נכשלה." }, { status: 500 });
  }

  return NextResponse.json({ id: data.id });
}
