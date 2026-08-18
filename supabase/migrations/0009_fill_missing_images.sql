-- =============================================================
-- 0009_fill_missing_images.sql
-- Preenche imagens que estao vazias ou quebradas (404):
--   - settings.hero_image_url  (Hero da home)
--   - services.image_url       (cartao "Flyer" do cardapio)
--   - how_it_works_steps.image_url (4 passos: Briefing, Proposta,
--     Producao, Lancamento)
--
-- Todas as URLs foram testadas via curl em 2026-08 e retornam HTTP 200
-- em images.unsplash.com (cdn do Unsplash). Caso alguma quebre no futuro,
-- basta trocar a URL nesta migration e rodar de novo.
--
-- Tema: publico politico/campanha eleitoral brasileiro.
-- =============================================================

-- ---------- HERO (palanque / candidato falando para multidao) ----------
update public.settings
   set hero_image_url = 'https://images.unsplash.com/photo-1517457373958-bb43f82c33c4?w=1600&q=80'
 where id = 1
   and (hero_image_url is null or hero_image_url = '');

-- ---------- SERVICOS: arrumar o FLYER (URL antiga era 404) ----------
update public.services
   set image_url = 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=900&q=80'
 where slug = 'flyer'
   and (image_url is null
        or image_url like '%1586281380349%'  -- URL antiga que retornava 404
        or image_url = '');

-- ---------- HOW IT WORKS: 4 passos ----------
update public.how_it_works_steps set image_url = 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=900&q=80' where step_number = 1 and title = 'Briefing';
update public.how_it_works_steps set image_url = 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=900&q=80' where step_number = 2 and title = 'Proposta';
update public.how_it_works_steps set image_url = 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=900&q=80' where step_number = 3 and title = 'Produção';
update public.how_it_works_steps set image_url = 'https://images.unsplash.com/photo-1599658880436-c61792e70672?w=900&q=80' where step_number = 4 and title = 'Lançamento';

-- Opcional: se o how_it_works_steps tiver mais registros alem dos 4 do
-- seed (ex.: voce adicionou um 5 manualmente), tambem preencher:
update public.how_it_works_steps
   set image_url = coalesce(nullif(image_url, ''), 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=900&q=80')
 where image_url is null or image_url = '';
