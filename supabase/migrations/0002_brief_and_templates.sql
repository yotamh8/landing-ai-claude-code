-- פרטי העסק לטופס היצירה, ותבנית + נתוני הטופס לכל דף.
-- העמודות ב-businesses אופציונליות, כדי שעסקים קיימים לא יישברו.

alter table public.businesses
  add column field text check (char_length(field) between 2 and 80),
  add column city text check (char_length(city) between 2 and 60),
  add column description text check (char_length(description) between 10 and 500),
  add column audience text check (char_length(audience) between 2 and 200),
  add column style text check (style in ('calm', 'bold', 'premium'));

alter table public.pages
  add column template text not null default 'calm' check (template in ('calm', 'bold', 'premium')),
  add column brief jsonb not null default '{}'::jsonb;

-- updated_at מתעדכן אוטומטית
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke execute on function public.set_updated_at() from public, anon, authenticated;

create trigger pages_set_updated_at
  before update on public.pages
  for each row execute function public.set_updated_at();
