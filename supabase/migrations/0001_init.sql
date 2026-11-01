-- טבלאות בסיס: עסקים, דפים, לידים. RLS מופעל בכל טבלה (ראו CLAUDE.md).

create table public.businesses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null unique default auth.uid() references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 2 and 80),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) between 3 and 40),
  created_at timestamptz not null default now()
);

create table public.pages (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  title text not null default '',
  content jsonb not null default '{}'::jsonb,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  page_id uuid references public.pages(id) on delete set null,
  name text,
  email text,
  phone text,
  message text,
  created_at timestamptz not null default now()
);

create index pages_business_id_idx on public.pages(business_id);
create index leads_business_id_idx on public.leads(business_id);
create index leads_page_id_idx on public.leads(page_id);

alter table public.businesses enable row level security;
alter table public.pages enable row level security;
alter table public.leads enable row level security;

-- businesses: הבעלים בלבד
create policy "businesses_select_own" on public.businesses
  for select to authenticated using (owner_id = (select auth.uid()));
create policy "businesses_insert_own" on public.businesses
  for insert to authenticated with check (owner_id = (select auth.uid()));
create policy "businesses_update_own" on public.businesses
  for update to authenticated
  using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));
create policy "businesses_delete_own" on public.businesses
  for delete to authenticated using (owner_id = (select auth.uid()));

-- pages: רק דפים של העסק של המשתמש
create policy "pages_all_own" on public.pages
  for all to authenticated
  using (exists (select 1 from public.businesses b
                 where b.id = business_id and b.owner_id = (select auth.uid())))
  with check (exists (select 1 from public.businesses b
                      where b.id = business_id and b.owner_id = (select auth.uid())));

-- leads: הבעלים קוראים ומוחקים. הוספה ציבורית תתווסף עם טופס הלידים.
create policy "leads_select_own" on public.leads
  for select to authenticated
  using (exists (select 1 from public.businesses b
                 where b.id = business_id and b.owner_id = (select auth.uid())));
create policy "leads_delete_own" on public.leads
  for delete to authenticated
  using (exists (select 1 from public.businesses b
                 where b.id = business_id and b.owner_id = (select auth.uid())));
