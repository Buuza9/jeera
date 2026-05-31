-- Private Storage bucket for driver KYC docs (national ID, license photos).
-- Files live under `{auth.uid}/...` so RLS lets each driver read/write only
-- their own folder. Run in the Supabase SQL editor.

insert into storage.buckets (id, name, public)
values ('driver-docs', 'driver-docs', false)
on conflict (id) do nothing;

-- A signed-in driver can write/read/update objects only in their own folder.
drop policy if exists "driver_docs_insert_own" on storage.objects;
create policy "driver_docs_insert_own" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'driver-docs' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "driver_docs_select_own" on storage.objects;
create policy "driver_docs_select_own" on storage.objects
  for select to authenticated
  using (bucket_id = 'driver-docs' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "driver_docs_update_own" on storage.objects;
create policy "driver_docs_update_own" on storage.objects
  for update to authenticated
  using (bucket_id = 'driver-docs' and (storage.foldername(name))[1] = auth.uid()::text);
