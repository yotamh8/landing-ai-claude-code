import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getMyBusiness } from "@/lib/business";
import { signOut } from "@/app/auth/actions";
import { BusinessNameForm } from "./business-name-form";

export const metadata: Metadata = { title: "לוח בקרה | דפי נחיתה עם AI" };

type PageRow = { id: string; title: string; status: "draft" | "published"; updated_at: string };
type LeadRow = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  message: string | null;
  created_at: string;
  pages: { title: string } | null;
};

const dateFmt = new Intl.DateTimeFormat("he-IL", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Jerusalem",
});

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const business = await getMyBusiness(supabase, user.id);
  if (!business) redirect("/onboarding");

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  // כל השאילתות עוברות דרך RLS: המשתמש רואה רק נתונים של העסק שלו
  const [pagesCount, publishedCount, leadsCount, leadsWeekCount, recentPages, recentLeads] =
    await Promise.all([
      supabase.from("pages").select("id", { count: "exact", head: true }).eq("business_id", business.id),
      supabase
        .from("pages")
        .select("id", { count: "exact", head: true })
        .eq("business_id", business.id)
        .eq("status", "published"),
      supabase.from("leads").select("id", { count: "exact", head: true }).eq("business_id", business.id),
      supabase
        .from("leads")
        .select("id", { count: "exact", head: true })
        .eq("business_id", business.id)
        .gte("created_at", weekAgo),
      supabase
        .from("pages")
        .select("id, title, status, updated_at")
        .eq("business_id", business.id)
        .order("updated_at", { ascending: false })
        .limit(5)
        .returns<PageRow[]>(),
      supabase
        .from("leads")
        .select("id, name, email, phone, message, created_at, pages(title)")
        .eq("business_id", business.id)
        .order("created_at", { ascending: false })
        .limit(10)
        .returns<LeadRow[]>(),
    ]);

  const meta = user.user_metadata as { full_name?: string; name?: string; avatar_url?: string };
  const displayName = meta.full_name ?? meta.name ?? user.email ?? "";
  const avatarUrl = meta.avatar_url;
  const initial = displayName.trim().charAt(0) || "?";

  const stats = [
    { label: "דפי נחיתה", value: pagesCount.count ?? 0 },
    { label: "דפים מפורסמים", value: publishedCount.count ?? 0 },
    { label: "סה״כ לידים", value: leadsCount.count ?? 0 },
    { label: "לידים ב-7 ימים", value: leadsWeekCount.count ?? 0 },
  ];

  const pages = recentPages.data ?? [];
  const leads = recentLeads.data ?? [];
  const loadFailed = [pagesCount, leadsCount, recentPages, recentLeads].some((r) => r.error);

  return (
    <div className="min-h-screen">
      {/* כותרת עליונה */}
      <header className="border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <div className="min-w-0">
            <p className="text-xs opacity-60">לוח בקרה</p>
            <h1 className="truncate text-lg font-bold">{business.name}</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-left sm:block" dir="ltr">
              <p className="text-sm font-medium" dir="auto">{displayName}</p>
              <p className="text-xs opacity-60">{user.email}</p>
            </div>
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt=""
                width={36}
                height={36}
                referrerPolicy="no-referrer"
                className="h-9 w-9 rounded-full"
              />
            ) : (
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--muted)] font-bold">
                {initial}
              </span>
            )}
            <form action={signOut}>
              <button
                type="submit"
                className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm hover:bg-[var(--muted)]"
              >
                התנתקות
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6">
        <section className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold">שלום, {displayName.split(" ")[0]} 👋</h2>
          <p className="opacity-70">הנה מה שקורה בעסק שלך.</p>
        </section>

        {loadFailed && (
          <p role="alert" className="rounded-lg bg-red-100 px-4 py-3 text-red-800">
            חלק מהנתונים לא נטענו. נסו לרענן את הדף.
          </p>
        )}

        {/* מדדים */}
        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4" aria-label="מדדים">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
              <p className="text-sm opacity-70">{s.label}</p>
              <p className="mt-1 text-3xl font-bold tabular-nums">{s.value.toLocaleString("he-IL")}</p>
            </div>
          ))}
        </section>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* לידים אחרונים */}
          <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] lg:col-span-2">
            <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
              <h3 className="font-bold">לידים אחרונים</h3>
              <span className="text-sm opacity-60">{leads.length > 0 ? `${leads.length} אחרונים` : ""}</span>
            </div>
            {leads.length === 0 ? (
              <Empty
                title="עדיין אין לידים"
                text="כשמבקרים ימלאו את הטופס בדף הנחיתה שלך, הפניות יופיעו כאן."
              />
            ) : (
              <ul className="divide-y divide-[var(--border)]">
                {leads.map((l) => (
                  <li key={l.id} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <p className="font-medium">{l.name || "ללא שם"}</p>
                      <p className="flex flex-wrap gap-x-3 text-sm opacity-70">
                        {l.phone && (
                          <a href={`tel:${l.phone}`} dir="ltr" className="hover:underline">
                            {l.phone}
                          </a>
                        )}
                        {l.email && (
                          <a href={`mailto:${l.email}`} dir="ltr" className="hover:underline">
                            {l.email}
                          </a>
                        )}
                      </p>
                      {l.message && <p className="mt-1 line-clamp-2 text-sm">{l.message}</p>}
                    </div>
                    <div className="shrink-0 text-sm opacity-60 sm:text-left">
                      <p>{dateFmt.format(new Date(l.created_at))}</p>
                      {l.pages?.title && <p className="truncate">מתוך: {l.pages.title}</p>}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* עמודה צדדית */}
          <div className="flex flex-col gap-6">
            <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)]">
              <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
                <h3 className="font-bold">דפי הנחיתה שלי</h3>
                <button
                  type="button"
                  disabled
                  title="בקרוב"
                  className="rounded-lg bg-[var(--foreground)] px-3 py-1.5 text-sm font-medium text-[var(--background)] opacity-50"
                >
                  + דף חדש (בקרוב)
                </button>
              </div>
              {pages.length === 0 ? (
                <Empty title="עדיין אין דפים" text="בקרוב תוכל ליצור כאן דף נחיתה עם AI בכמה קליקים." />
              ) : (
                <ul className="divide-y divide-[var(--border)]">
                  {pages.map((p) => (
                    <li key={p.id} className="flex items-center justify-between gap-3 px-4 py-3">
                      <div className="min-w-0">
                        <p className="truncate font-medium">{p.title || "ללא כותרת"}</p>
                        <p className="text-xs opacity-60">עודכן {dateFmt.format(new Date(p.updated_at))}</p>
                      </div>
                      <StatusBadge status={p.status} />
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="flex flex-col gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
              <h3 className="font-bold">הגדרות העסק</h3>
              <BusinessNameForm name={business.name} />
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium">כתובת העסק</p>
                <p dir="ltr" className="rounded-lg bg-[var(--muted)] px-3 py-2 text-left font-mono text-sm">
                  /{business.slug}
                </p>
                <p className="text-xs opacity-60">הכתובת נקבעת פעם אחת ולא ניתנת לשינוי.</p>
              </div>
            </section>

            <section className="flex flex-col gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm">
              <h3 className="font-bold">החשבון שלי</h3>
              <p>
                <span className="opacity-60">שם: </span>
                {displayName}
              </p>
              <p>
                <span className="opacity-60">אימייל: </span>
                <span dir="ltr">{user.email}</span>
              </p>
              <p>
                <span className="opacity-60">חבר מאז: </span>
                {dateFmt.format(new Date(user.created_at))}
              </p>
              <p>
                <span className="opacity-60">התחברות עם: </span>
                Google
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatusBadge({ status }: { status: "draft" | "published" }) {
  return status === "published" ? (
    <span className="shrink-0 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
      מפורסם
    </span>
  ) : (
    <span className="shrink-0 rounded-full bg-[var(--muted)] px-2.5 py-0.5 text-xs font-medium">טיוטה</span>
  );
}

function Empty({ title, text }: { title: string; text: string }) {
  return (
    <div className="flex flex-col items-center gap-1 px-4 py-10 text-center">
      <p className="font-medium">{title}</p>
      <p className="max-w-xs text-sm opacity-60">{text}</p>
    </div>
  );
}
