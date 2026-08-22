-- =============================================================
-- 0011_modelos.sql
-- Tabela public.modelos para a página /modelos.
-- Suporta 3 tipos de mídia: image (Social Media), audio (Jingles), video (Vídeos).
-- =============================================================

create table public.modelos (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  category text not null,                             -- 'social_media' | 'jingles' | 'videos'
  media_type text not null,                           -- 'image' | 'audio' | 'video'
  media_url text not null,                            -- arquivo principal (mp3/mp4/imagem)
  thumbnail_url text,                                 -- capa (opcional; usa media_url se vazio)
  display_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint modelos_category_check check (
    category in ('social_media', 'jingles', 'videos')
  ),
  constraint modelos_media_type_check check (
    media_type in ('image', 'audio', 'video')
  )
);

create index idx_modelos_active_order
  on public.modelos (active, category, display_order);

create trigger trg_modelos before update on public.modelos
  for each row execute function public.set_updated_at();

alter table public.modelos enable row level security;

create policy "modelos_public_read" on public.modelos
  for select using (active = true);

create policy "modelos_admin_all" on public.modelos
  for all to authenticated
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));
