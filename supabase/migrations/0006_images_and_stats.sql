-- Imagens para serviços e combos (reaproveita o bucket "portfolio")
-- + imagem do hero e stats para a barra de confiança

alter table public.services
  add column if not exists image_url text;

alter table public.combos
  add column if not exists image_url text;

alter table public.how_it_works_steps
  add column if not exists image_url text;

alter table public.settings
  add column if not exists hero_image_url text,
  add column if not exists stats_campaigns text not null default '200+',
  add column if not exists stats_states text not null default '12',
  add column if not exists stats_satisfaction text not null default '98%';

-- Backfill: imagens de campanha (Unsplash, domínio público, temática)
update public.services set image_url = 'https://images.unsplash.com/photo-1485579149621-3123dd979885?w=900&q=80'
  where slug = 'jingle' and image_url is null;

update public.services set image_url = 'https://images.unsplash.com/photo-1492724441997-5dc865305da7?w=900&q=80'
  where slug = 'site' and image_url is null;

update public.services set image_url = 'https://images.unsplash.com/photo-1586281380349-9aae63a05c70?w=900&q=80'
  where slug = 'flyer' and image_url is null;

update public.services set image_url = 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=900&q=80'
  where slug = 'edicao-video' and image_url is null;

update public.services set image_url = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&q=80'
  where slug = 'trafego-pago' and image_url is null;

update public.services set image_url = 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=900&q=80'
  where slug = 'social-media' and image_url is null;

-- Combos: tentar pelos slugs mais comuns; se não, cai pra display_order
update public.combos set image_url = 'https://images.unsplash.com/photo-1494172961521-33799ddd43a5?w=1200&q=80'
  where (slug like '%vereador%' or name ilike '%vereador%') and image_url is null;

update public.combos set image_url = 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200&q=80'
  where (slug like '%prefeito%' or name ilike '%prefeito%') and image_url is null;

update public.combos set image_url = 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=1200&q=80'
  where (slug like '%deputado%' or name ilike '%deputado%') and image_url is null;

-- Fallback por display_order caso nenhum slug bata
update public.combos set image_url = 'https://images.unsplash.com/photo-1494172961521-33799ddd43a5?w=1200&q=80'
  where image_url is null and display_order = 1;
update public.combos set image_url = 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200&q=80'
  where image_url is null and display_order = 2;
update public.combos set image_url = 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=1200&q=80'
  where image_url is null and display_order = 3;