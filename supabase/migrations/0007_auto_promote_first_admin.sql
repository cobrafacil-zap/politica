-- Auto-promove a admin o primeiro profile criado (caso ainda não exista nenhum admin)
-- Evita o problema clássico: usuário criado em Authentication, profile gerado pelo trigger
-- com is_admin=false, e admin/layout.tsx mostrando "Acesso negado" pra sempre.

create or replace function public.promote_first_admin_if_none()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (select 1 from public.profiles where is_admin = true) then
    new.is_admin := true;
  end if;
  return new;
end;
$$;

-- Trigger BEFORE INSERT garante que é só na criação do profile
drop trigger if exists promote_first_admin on public.profiles;
create trigger promote_first_admin
  before insert on public.profiles
  for each row execute function public.promote_first_admin_if_none();