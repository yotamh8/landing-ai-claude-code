-- תמונות דפים: bucket ציבורי לקריאה (דפי נחיתה הם ציבוריים), כתיבה רק לתיקייה של העסק שלך.

alter table public.pages
  add column image_url text,
  add column image_status text not null default 'pending'
    check (image_status in ('pending', 'generating', 'done', 'failed'));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('page-images', 'page-images', true, 5242880, array['image/png', 'image/jpeg', 'image/webp'])
on conflict (id) do nothing;

-- הנתיב הוא {business_id}/{file}. מותר להעלות או למחוק רק בתיקייה של עסק שבבעלותך
create policy "page_images_insert_own" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'page-images'
    and (storage.foldername(name))[1] in (
      select id::text from public.businesses where owner_id = (select auth.uid())
    )
  );

create policy "page_images_delete_own" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'page-images'
    and (storage.foldername(name))[1] in (
      select id::text from public.businesses where owner_id = (select auth.uid())
    )
  );

-- רשימת קבצים (לניקוי תמונות כשמוחקים דף): רק בתיקייה של העסק שלך
create policy "page_images_select_own" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'page-images'
    and (storage.foldername(name))[1] in (
      select id::text from public.businesses where owner_id = (select auth.uid())
    )
  );
