-- =============================================================
-- 0010_image_url_rotated.sql
-- Substitui URLs do Unsplash que retornaram 404 em 2026-08.
-- Validadas via curl em 2026-08-18 (HTTP 200 em images.unsplash.com).
--
-- Substituicoes:
--   Hero:  1517457373958-bb43f82c33c4  -> 1604881991720-f91add269bed
--   Step4: 1599658880436-c61792e70672 (mantida, segue 200)
--   Servicos 1-6: mantidos (200 OK em todos)
--   Steps 1-3:   mantidos (200 OK em todos)
--   Combos:      mantidos (200 OK em todos)
-- =============================================================

update public.settings
   set hero_image_url = 'https://images.unsplash.com/photo-1604881991720-f91add269bed?w=1600&q=80'
 where id = 1
   and (
     hero_image_url is null
     or hero_image_url like '%1517457373958%'
     or hero_image_url = ''
   );
