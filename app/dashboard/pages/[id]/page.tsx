import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getMyBusiness } from "@/lib/business";
import { STYLE_LABELS, type Style } from "@/lib/brief";
import { parsePageContent } from "@/lib/page-content";
import { PageRenderer } from "@/components/templates";
import { DeletePageButton } from "./delete-button";
import { ImageStatus } from "./image-status";

type Params = { params: Promise<{ id: string }> };

export const metadata: Metadata = { title: "תצוגה מקדימה | דפי נחיתה עם AI" };

export default async function PagePreview({ params }: Params) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");
  const business = await getMyBusiness(supabase, user.id);
  if (!business) redirect("/onboarding");

  // RLS מחזיר רק דפים של העסק שלך. דף של מישהו אחר ייראה כמו דף שלא קיים
  const { data: page } = await supabase
    .from("pages")
    .select("id, template, content, brief, image_url, image_status")
    .eq("id", id)
    .maybeSingle<{
      id: string;
      template: Style;
      content: unknown;
      brief: Record<string, string>;
      image_url: string | null;
      image_status: "pending" | "generating" | "done" | "failed";
    }>();
  if (!page) notFound();

  const content = parsePageContent(page.content);
  if (!content) notFound();

  return (
    <div>
      <div className="material-bar sticky top-0 z-20 border-b border-[var(--border)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5 text-sm">
          <Link href="/dashboard" className="pressable rounded-lg px-3 py-1.5 hover:bg-[var(--muted)]">
            → לוח הבקרה
          </Link>
          <span className="truncate opacity-70">
            תצוגה מקדימה · תבנית {STYLE_LABELS[page.template].name}
          </span>
          <div className="flex items-center gap-1">
            <ImageStatus pageId={page.id} status={page.image_status} />
            <Link href="/dashboard/new" className="pressable rounded-lg px-3 py-1.5 hover:bg-[var(--muted)]">
              + דף חדש
            </Link>
            <DeletePageButton id={page.id} />
          </div>
        </div>
      </div>

      <PageRenderer
        template={page.template}
        content={content}
        imageUrl={page.image_url}
        business={{
          name: page.brief?.name || business.name,
          city: page.brief?.city || business.city,
          field: page.brief?.field || business.field,
        }}
      />
    </div>
  );
}
