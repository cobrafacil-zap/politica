-- =============================================================
-- 0002_rls_policies.sql
-- Habilita RLS, cria função is_admin e políticas.
-- =============================================================

alter table public.profiles           enable row level security;
alter table public.settings           enable row level security;
alter table public.services           enable row level security;
alter table public.combos             enable row level security;
alter table public.combo_services     enable row level security;
alter table public.portfolio_items    enable row level security;
alter table public.testimonials       enable row level security;
alter table public.faqs               enable row level security;
alter table public.how_it_works_steps enable row level security;

-- Função helper: checa se o usuário atual é admin
create or replace function public.is_admin(uid uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles where id = uid and is_admin = true
  );
$$;

-- profiles: usuário lê e edita o próprio perfil
create policy "profiles_self_select" on public.profiles
  for select to authenticated using (auth.uid() = id);
create policy "profiles_self_update" on public.profiles
  for update to authenticated using (auth.uid() = id);

-- settings: público lê; só admin escreve
create policy "settings_public_read" on public.settings
  for select using (true);
create policy "settings_admin_write" on public.settings
  for all to authenticated
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- Padrão para tabelas com active flag:
--   - público lê se active = true
--   - admin lê e escreve tudo

-- services
create policy "services_public_read" on public.services
  for select using (active = true);
create policy "services_admin_all" on public.services
  for all to authenticated
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- combos
create policy "combos_public_read" on public.combos
  for select using (active = true);
create policy "combos_admin_all" on public.combos
  for all to authenticated
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- combo_services: segue o status do combo
create policy "cs_public_read" on public.combo_services
  for select using (
    exists (select 1 from public.combos c where c.id = combo_id and c.active = true)
  );
create policy "cs_admin_all" on public.combo_services
  for all to authenticated
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- portfolio
create policy "portfolio_public_read" on public.portfolio_items
  for select using (active = true);
create policy "portfolio_admin_all" on public.portfolio_items
  for all to authenticated
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- testimonials
create policy "testimonials_public_read" on public.testimonials
  for select using (active = true);
create policy "testimonials_admin_all" on public.testimonials
  for all to authenticated
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- faqs
create policy "faqs_public_read" on public.faqs
  for select using (active = true);
create policy "faqs_admin_all" on public.faqs
  for all to authenticated
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- steps
create policy "steps_public_read" on public.how_it_works_steps
  for select using (active = true);
create policy "steps_admin_all" on public.how_it_works_steps
  for all to authenticated
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- Trigger para auto-criar profile ao cadastrar no Auth
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', new.email))
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
