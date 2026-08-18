-- =============================================================
-- 0008_set_whatsapp_number.sql
-- Define o número de WhatsApp canônico do site.
-- Formato E.164 sem '+' conforme schema (settings.whatsapp_number text):
--   55            código do Brasil
--   43            DDD Paraná
--   9             nono dígito
--   6820-296      número local (8 dígitos)
-- Total: 11 dígitos. wa.me/554396820296 é o link gerado pelo front.
-- =============================================================
update public.settings
   set whatsapp_number = '554396820296'
 where id = 1
   and (whatsapp_number is null or whatsapp_number <> '554396820296');
