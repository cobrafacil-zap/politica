-- =============================================================
-- 0004_storage_bucket.sql
-- Cria o bucket 'portfolio' (público) usado em /api/upload.
-- =============================================================

insert into storage.buckets (id, name, public)
values ('portfolio', 'portfolio', true)
on conflict (id) do update set public = excluded.public;

-- Políticas de storage: público lê, apenas admin escreve.
create policy "portfolio_public_read" on storage.objects
  for select using (bucket_id = 'portfolio');

create policy "portfolio_admin_insert" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'portfolio'
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );

create policy "portfolio_admin_update" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'portfolio'
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );

create policy "portfolio_admin_delete" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'portfolio'
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );
