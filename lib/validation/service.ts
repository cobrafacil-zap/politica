import { z } from "zod";

export const serviceSchema = z.object({
  name: z.string().min(2, "Nome muito curto").max(80),
  slug: z
    .string()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9-]+$/, "Use apenas letras minúsculas, números e hífens"),
  description: z.string().max(500).optional().nullable(),
  icon: z.string().max(40).optional().nullable(),
  image_url: z
    .string()
    .max(500)
    .url()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : null)),
  price_cents: z.coerce.number().int().min(0),
  selectable: z.coerce.boolean().default(true),
  display_order: z.coerce.number().int().min(0).default(0),
  active: z.coerce.boolean().default(true),
});

export type ServiceInput = z.infer<typeof serviceSchema>;
