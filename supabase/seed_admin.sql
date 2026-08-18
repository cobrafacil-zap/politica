-- =============================================================
-- seed_admin.sql
-- Cria (ou recria) o usuário admin inicial do projeto.
-- Cole este SQL no SQL Editor do Supabase e execute.
-- Troque o email/senha antes de rodar.
-- =============================================================

-- 1. (Opcional) Limpa qualquer admin anterior se quiser resetar.
-- Descomente o bloco abaixo se quiser começar do zero:
--
-- delete from public.profiles
--  where id in (select id from auth.users where email = 'admin@exemplo.com');
-- delete from auth.users where email = 'admin@exemplo.com';

-- 2. Cria o usuário (a senha é hasheada pelo pgcrypto).
--    ATENCAO: troque 'admin@exemplo.com' e 'senha-forte-123' antes de rodar.

insert into auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
)
select
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@exemplo.com',                                -- <<< troque aqui
  crypt('senha-forte-123', gen_salt('bf')),          -- <<< troque aqui
  now(),
  null,
  null,
  '{"provider":"email","providers":["email"]}',
  '{}',
  now(),
  now(),
  '',
  '',
  '',
  ''
where not exists (
  select 1 from auth.users where email = 'admin@exemplo.com'
);

-- 3. Se voce ja rodou o seed antes com outro email e quer promover este,
-- descomente:
--
-- update public.profiles
--    set is_admin = true
--  where id = (select id from auth.users where email = 'admin@exemplo.com')
--    and not exists (
--      select 1 from public.profiles where is_admin = true and id <> (
--        select id from auth.users where email = 'admin@exemplo.com'
--      )
--    );
--
-- OU force ser admin (remove o "primeiro admin" se quiser):
-- update public.profiles p
--    set is_admin = true
--   from auth.users u
--  where p.id = u.id and u.email = 'admin@exemplo.com';

-- 4. Whatsapp canonico do site (id=1).
update public.settings
   set whatsapp_number = '554396820296'
 where id = 1;

-- 5. Verificacao final.
select u.email, p.is_admin, u.email_confirmed_at is not null as confirmado
  from auth.users u
  left join public.profiles p on p.id = u.id
 where u.email = 'admin@exemplo.com';
