import { z } from "zod";

export const comboSchema = z.object({
  name: z.string().min(2).max(80),
  slug: z
    .string()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9-]+$/, "Use apenas letras minúsculas, números e hífens"),
  description: z.string().max(500).optional().nullable(),
  price_cents: z.coerce.number().int().min(0),
  original_price_cents: z.coerce.number().int().min(0).optional().nullable(),
  whatsapp_message: z.string().min(5, "Mensagem muito curta").max(800),
  display_order: z.coerce.number().int().min(0).default(0),
  active: z.coerce.boolean().default(true),
  featured: z.coerce.boolean().default(false),
  badge_text: z.string().max(40).optional().nullable(),
  service_ids: z.array(z.string().uuid()).default([]),
});

export type ComboInput = z.infer<typeof comboSchema>;
