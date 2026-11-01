import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getMyBusiness } from "@/lib/business";
import { NewPageForm } from "./form";

export const metadata: Metadata = { title: "דף חדש | דפי נחיתה עם AI" };

export default async function NewPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");
  const business = await getMyBusiness(supabase, user.id);
  if (!business) redirect("/onboarding");

  return (
    <main className="mx-auto flex max-w-xl flex-col gap-8 px-4 py-10">
      <div className="flex flex-col gap-2">
        <Link href="/dashboard" className="text-sm opacity-60 hover:opacity-100">
          → חזרה ללוח הבקרה
        </Link>
        <h1 className="text-3xl font-bold">דף נחיתה חדש</h1>
        <p className="opacity-70">
          הפרטים מולאו מהעסק שלך. אפשר לשנות אותם לדף הזה, למשל קהל יעד אחר או סגנון אחר.
        </p>
      </div>
      <NewPageForm
        defaults={{
          name: business.name,
          field: business.field ?? undefined,
          city: business.city ?? undefined,
          description: business.description ?? undefined,
          audience: business.audience ?? undefined,
          style: business.style ?? undefined,
        }}
      />
    </main>
  );
}
