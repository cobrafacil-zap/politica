-- =============================================================
-- 0001_initial_schema.sql
-- Cria todas as tabelas, triggers de updated_at e índices.
-- =============================================================

create extension if not exists "uuid-ossp";

-- profiles: espelha auth.users e adiciona flag is_admin
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

-- settings: singleton (id=1)
create table public.settings (
  id int primary key default 1 check (id = 1),
  company_name text not null default 'Social Marketing Digital',
  whatsapp_number text,                              -- formato E.164 sem '+': 55DDDxxxxxxxx
  hero_title text,
  hero_subtitle text,
  hero_cta_label text default 'Falar no WhatsApp',
  about_text text,
  contact_email text,
  instagram_url text,
  facebook_url text,
  youtube_url text,
  updated_at timestamptz not null default now()
);
insert into public.settings (id, company_name)
values (1, 'Social Marketing Digital')
on conflict (id) do nothing;

-- Trigger genérico de updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- services
create table public.services (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  description text,
  icon text,                                         -- nome do ícone lucide-react
  display_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_services_active_order on public.services (active, display_order);
create trigger trg_services before update on public.services
  for each row execute function public.set_updated_at();

-- combos
create table public.combos (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  description text,
  price_cents int not null default 0,
  original_price_cents int,                          -- opcional (preço riscado)
  whatsapp_message text not null,                    -- suporta {{company}} e {{price}}
  display_order int not null default 0,
  active boolean not null default true,
  featured boolean not null default false,
  badge_text text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_combos_active_order on public.combos (active, display_order);
create trigger trg_combos before update on public.combos
  for each row execute function public.set_updated_at();

-- combo_services: junction
create table public.combo_services (
  combo_id uuid not null references public.combos(id) on delete cascade,
  service_id uuid not null references public.services(id) on delete restrict,
  primary key (combo_id, service_id)
);

-- portfolio_items
create table public.portfolio_items (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  image_url text not null,
  client_name text,
  year int,
  category text,
  display_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_portfolio_active_order on public.portfolio_items (active, display_order);
create trigger trg_portfolio before update on public.portfolio_items
  for each row execute function public.set_updated_at();

-- testimonials
create table public.testimonials (
  id uuid primary key default uuid_generate_v4(),
  client_name text not null,
  role text,
  content text not null,
  avatar_url text,
  rating int check (rating between 1 and 5),
  display_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_testimonials_active_order on public.testimonials (active, display_order);
create trigger trg_testimonials before update on public.testimonials
  for each row execute function public.set_updated_at();

-- faqs
create table public.faqs (
  id uuid primary key default uuid_generate_v4(),
  question text not null,
  answer text not null,
  display_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_faqs_active_order on public.faqs (active, display_order);
create trigger trg_faqs before update on public.faqs
  for each row execute function public.set_updated_at();

-- how_it_works_steps
create table public.how_it_works_steps (
  id uuid primary key default uuid_generate_v4(),
  step_number int not null,
  title text not null,
  description text not null,
  icon text,
  display_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_steps_active_order on public.how_it_works_steps (active, display_order);
create trigger trg_steps before update on public.how_it_works_steps
  for each row execute function public.set_updated_at();

-- trigger de settings
create trigger trg_settings before update on public.settings
  for each row execute function public.set_updated_at();
