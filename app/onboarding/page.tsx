import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getMyBusiness } from "@/lib/business";
import { OnboardingForm } from "./form";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");
  if (await getMyBusiness(supabase, user.id)) redirect("/dashboard");

  return (
    <main className="enter mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center gap-8 px-4 py-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold">ברוכים הבאים!</h1>
        <p className="mt-2 opacity-80">ספרו לנו על העסק, ונכתוב לכם דף נחיתה ראשון.</p>
      </div>
      <OnboardingForm />
    </main>
  );
}
