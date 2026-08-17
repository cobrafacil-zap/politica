import { z } from "zod";

const phoneRegex = /^\d{10,15}$/;
const urlOptional = z
  .string()
  .url("URL inválida")
  .or(z.literal(""))
  .optional()
  .nullable();

export const settingsSchema = z.object({
  company_name: z.string().min(2).max(120),
  whatsapp_number: z
    .string()
    .regex(phoneRegex, "Use apenas dígitos (Ex: 5511999999999)")
    .or(z.literal(""))
    .optional()
    .nullable(),
  hero_title: z.string().max(200).optional().nullable(),
  hero_subtitle: z.string().max(400).optional().nullable(),
  hero_cta_label: z.string().max(60).optional().nullable(),
  about_text: z.string().max(2000).optional().nullable(),
  contact_email: z
    .string()
    .email("E-mail inválido")
    .or(z.literal(""))
    .optional()
    .nullable(),
  instagram_url: urlOptional,
  facebook_url: urlOptional,
  youtube_url: urlOptional,
});

export type SettingsInput = z.infer<typeof settingsSchema>;
