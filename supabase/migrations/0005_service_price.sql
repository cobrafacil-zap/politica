-- =============================================================
-- 0005_service_price.sql
-- Adiciona preço unitário e flag "selecionável" aos serviços.
-- =============================================================

alter table public.services
  add column if not exists price_cents int not null default 0;

alter table public.services
  add column if not exists selectable boolean not null default true;

-- Backfill de preços default para os 6 serviços do seed.
-- Ajuste à vontade pelo painel admin depois.
update public.services set price_cents =  80000, selectable = true where slug = 'jingle';
update public.services set price_cents = 150000, selectable = true where slug = 'site';
update public.services set price_cents =  30000, selectable = true where slug = 'flyer';
update public.services set price_cents = 120000, selectable = true where slug = 'edicao-video';
update public.services set price_cents = 200000, selectable = true where slug = 'trafego-pago';
update public.services set price_cents = 150000, selectable = true where slug = 'social-media';
