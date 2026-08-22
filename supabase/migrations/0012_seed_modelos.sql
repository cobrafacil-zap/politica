-- =============================================================
-- 0012_seed_modelos.sql
-- Cadastra 3 modelos de exemplo na página /modelos.
-- As capas SVG estão em public/capas/ e são servidas pelo Next.
-- Domínio configurado: https://politica-omega.vercel.app
-- =============================================================

do $$
declare
  base_url text := 'https://politica-omega.vercel.app';
  capa_jingles text;
  capa_videos  text;
begin

  capa_jingles := base_url || '/capas/jingles.svg';
  capa_videos  := base_url || '/capas/videos.svg';

  -- remove exemplos anteriores (idempotente)
  delete from public.modelos
   where title in (
     'Jingle de Apresentação',
     'Spot de Proposta — Saúde',
     'Vídeo de Apresentação'
   );

  insert into public.modelos
    (title, description, category, media_type, media_url, thumbnail_url, display_order, active)
  values
    (
      'Jingle de Apresentação',
      'Vinheta curta para abertura de vídeo de campanha (placeholder — troque pelo mp3 real no admin).',
      'jingles', 'image',
      capa_jingles, null, 1, true
    ),
    (
      'Spot de Proposta — Saúde',
      'Jingle de 30s para spot de rádio (placeholder — troque pelo mp3 real no admin).',
      'jingles', 'image',
      capa_jingles, null, 2, true
    ),
    (
      'Vídeo de Apresentação',
      'Vídeo curto de apresentação do candidato (placeholder — troque pelo mp4 real no admin).',
      'videos', 'image',
      capa_videos, null, 1, true
    );
end $$;
