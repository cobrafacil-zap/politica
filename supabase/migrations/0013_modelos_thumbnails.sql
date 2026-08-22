-- =============================================================
-- 0013_modelos_thumbnails.sql
-- Define thumbnail_url padrão para modelos de jingles e vídeos,
-- apontando para as capas SVG em public/capas/.
-- Caminho relativo (servido pelo Next) evita dependência de
-- remotePatterns em next.config.mjs.
-- =============================================================

update public.modelos
   set thumbnail_url = '/capas/jingles.svg'
 where category = 'jingles'
   and (thumbnail_url is null or thumbnail_url = '');

update public.modelos
   set thumbnail_url = '/capas/videos.svg'
 where category = 'videos'
   and (thumbnail_url is null or thumbnail_url = '');
