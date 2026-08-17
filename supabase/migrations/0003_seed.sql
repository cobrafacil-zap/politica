-- =============================================================
-- 0003_seed.sql
-- Popula dados iniciais editáveis no painel admin depois.
-- =============================================================

-- 6 serviços iniciais
insert into public.services (name, slug, description, icon, display_order) values
  ('Jingle',          'jingle',       'Produção de jingle político com letra personalizada e voz qualificada.', 'Music',   1),
  ('Site',            'site',         'Site institucional responsivo, rápido e otimizado para mecanismos de busca.', 'Globe', 2),
  ('Flyer',           'flyer',        'Artes profissionais para redes sociais e materiais impressos.',          'Image',  3),
  ('Edição de Vídeos','edicao-video', 'Edição de vídeos, reels e cortes para suas redes.',                     'Video',  4),
  ('Tráfego Pago',    'trafego-pago', 'Gestão de anúncios em Meta e Google com segmentação política.',          'Target', 5),
  ('Social Media',    'social-media', 'Gestão de conteúdo com calendário editorial e relatórios mensais.',     'Share2', 6);

-- 3 combos iniciais (preços e mensagens são placeholders — ajuste no painel)
insert into public.combos (name, slug, description, price_cents, original_price_cents, whatsapp_message, display_order, featured, badge_text) values
  ('Combo Essencial',     'combo-essencial',     'Ideal para começar com presença digital sólida.', 149900, 199900,
   'Olá! Tenho interesse no Combo Essencial da {{company}}. Podemos conversar sobre os próximos passos?',
   1, false, null),
  ('Combo Profissional',  'combo-profissional',  'Para campanhas com presença digital forte em múltiplos canais.', 299900, 399900,
   'Olá! Gostaria de contratar o Combo Profissional ({{price}}). Poderia me enviar uma proposta detalhada?',
   2, true,  'Mais vendido'),
  ('Combo Completo',      'combo-completo',      'Pacote completo: todos os serviços + bônus de lançamento.', 499900, 649900,
   'Olá! Quero o Combo Completo ({{price}}). Vamos alinhar os próximos passos?',
   3, false, 'Premium');

-- Itens do Combo Essencial: Jingle + Site + Flyer
insert into public.combo_services (combo_id, service_id)
select c.id, s.id from public.combos c, public.services s
where c.slug = 'combo-essencial' and s.slug in ('jingle', 'site', 'flyer');

-- Itens do Combo Profissional: Essencial + Edição de Vídeo + Social Media
insert into public.combo_services (combo_id, service_id)
select c.id, s.id from public.combos c, public.services s
where c.slug = 'combo-profissional' and s.slug in ('jingle', 'site', 'flyer', 'edicao-video', 'social-media');

-- Itens do Combo Completo: todos
insert into public.combo_services (combo_id, service_id)
select c.id, s.id from public.combos c, public.services s
where c.slug = 'combo-completo';

-- Como funciona (4 passos)
insert into public.how_it_works_steps (step_number, title, description, icon, display_order) values
  (1, 'Briefing',   'Entendemos seu objetivo, público e orçamento.',                 'MessageCircle', 1),
  (2, 'Proposta',   'Montamos um combo sob medida com cronograma claro.',            'FileText',      2),
  (3, 'Produção',   'Executamos com checkpoints e aprovações parciais.',             'Wrench',        3),
  (4, 'Lançamento', 'Publicamos e acompanhamos as primeiras métricas.',              'Rocket',        4);

-- FAQs iniciais
insert into public.faqs (question, answer, display_order) values
  ('Atendem em todo o Brasil?',          'Sim. Operamos 100% remoto e atendemos clientes em qualquer estado.', 1),
  ('Como funciona o pagamento?',         'Pix, cartão ou boleto. Parcelamos combos de maior valor.',            2),
  ('Posso personalizar o combo?',        'Sim, montamos combinações sob medida conforme sua necessidade.',     3),
  ('Em quanto tempo vejo resultados?',   'Campanhas de tráfego pago costumam ter métricas em 7 dias.',        4);

-- Depois de criar o primeiro usuário em Auth, promova a admin com:
-- update public.profiles set is_admin = true where email = 'seu@email.com';
