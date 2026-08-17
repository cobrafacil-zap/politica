# Social Marketing Digital — Landing Page

Landing page de marketing político com painel admin completo. Edita serviços, combos (com botão WhatsApp por combo), portfólio, depoimentos, FAQ, "como funciona" e configurações gerais. Tudo configurável pelo navegador, sem precisar mexer em código.

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** + **shadcn/ui**
- **Supabase** (Postgres + Auth + Storage) — free tier
- **Vercel** — deploy

## Setup local

### 1. Pré-requisitos
- Node 20+
- Conta no [Supabase](https://supabase.com) (free tier)
- Conta no [Vercel](https://vercel.com) (para deploy)

### 2. Criar projeto Supabase
1. Crie um projeto free no Supabase.
2. Anote a **Project URL** e as chaves em **Settings → API**:
   - `anon` (public)
   - `service_role` (server only)

### 3. Rodar migrations
No **SQL Editor** do Supabase, rode em ordem:
1. `supabase/migrations/0001_initial_schema.sql` — tabelas
2. `supabase/migrations/0002_rls_policies.sql` — RLS e função `is_admin`
3. `supabase/migrations/0003_seed.sql` — dados iniciais (6 serviços, 3 combos, 4 passos, 4 FAQs)
4. `supabase/migrations/0004_storage_bucket.sql` — bucket `portfolio`

### 4. Criar bucket de Storage
Se a migration 0004 não criou (depende da ordem), crie manualmente:
- **Storage → New bucket**: nome `portfolio`, **público**.

### 5. Criar primeiro admin
1. **Authentication → Users → Add user → Create new user** (com email e senha).
2. No **SQL Editor**:
   ```sql
   update public.profiles
   set is_admin = true
   where email = 'seu@email.com';
   ```

### 6. Desabilitar signup público
**Authentication → Providers → Email**:
- Desligue **"Enable sign up"** (ninguém pode se cadastrar sozinho; admins são criados manualmente).

### 7. Variáveis de ambiente
Copie `.env.example` para `.env.local` e preencha:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 8. Instalar e rodar
```bash
npm install
npm run dev
```

- LP: http://localhost:3000
- Admin: http://localhost:3000/admin/login

## Deploy na Vercel

1. Suba o projeto para o GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/SEU_USUARIO/SEU_REPO.git
   git push -u origin main
   ```
2. Em **vercel.com → New Project**, importe o repositório.
3. Em **Settings → Environment Variables**, adicione as 4 variáveis (com os mesmos valores do `.env.local`, ajustando `NEXT_PUBLIC_SITE_URL` para a URL final).
4. Deploy. A cada push, novo deploy automático.

## Como editar conteúdo

Acesse `/admin` e edite:
- **Serviços** — adicionar/remover; o slug precisa ser único.
- **Combos** — defina serviços inclusos, preço, mensagem do WhatsApp (use `{{company}}` e `{{price}}` para placeholders).
- **Portfólio** — faça upload de imagens direto do navegador.
- **Depoimentos / FAQ / Como funciona / Configurações**.

As alterações são refletidas **imediatamente** na landing pública, sem redeploy (ISR com revalidação por tag).

## Estrutura

```
app/
  (public)/         → landing page (/)
  admin/            → painel (/admin/*) — protegido por middleware
  api/upload/       → upload de imagens para Supabase Storage
components/
  ui/               → shadcn/ui (button, card, dialog, table, etc.)
  landing/          → Hero, ServicesGrid, ComboCard, HowItWorks, etc.
  admin/            → Forms e tabelas admin
lib/
  supabase/         → clients (browser, server, admin) + queries
  validation/       → schemas Zod
  whatsapp.ts       → gera link wa.me com placeholders
  format.ts         → formatBRL, slugify
supabase/
  migrations/       → schema + RLS + seed + storage
```

## Segurança

- **RLS** habilitada em todas as tabelas.
- Função `is_admin(uid)` decide quem escreve.
- `SUPABASE_SERVICE_ROLE_KEY` **nunca** vai para o cliente (não use prefixo `NEXT_PUBLIC_`).
- Signup público desabilitado — apenas admins via SQL.

## Verificação end-to-end

### Local
1. `npm run dev` → LP e admin abrem.
2. **Teste RLS anônimo** (SQL Editor com sessão `anon`):
   ```sql
   select * from services where active = false;        -- 0 linhas
   update settings set company_name = 'X';             -- erro de permissão
   ```
3. Logue em `/admin/login` → edite `whatsapp_number` em Configurações.
4. Recarregue `/` → o botão WhatsApp aparece com o número correto.
5. Crie um combo novo → botão aparece com a mensagem customizada.
6. Faça upload de uma imagem no portfólio → aparece na LP.

### Produção
1. Build verde na Vercel.
2. `/` retorna 200.
3. `/admin` redireciona para `/admin/login` quando deslogado.
4. Edições no admin refletem na LP sem redeploy.
