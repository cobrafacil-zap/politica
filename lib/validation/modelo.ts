import { z } from "zod";

export const MODELO_CATEGORIES = ["social_media", "jingles", "videos"] as const;
export const MODELO_MEDIA_TYPES = ["image", "audio", "video"] as const;

export const modeloSchema = z.object({
  title: z.string().min(2).max(120),
  description: z.string().max(500).optional().nullable(),
  category: z.enum(MODELO_CATEGORIES),
  media_type: z.enum(MODELO_MEDIA_TYPES),
  media_url: z.string().url("Informe uma URL válida"),
  thumbnail_url: z
    .string()
    .url()
    .optional()
    .nullable()
    .or(z.literal(""))
    .transform((v) => (v ? v : null)),
  display_order: z.coerce.number().int().min(0).default(0),
  active: z.coerce.boolean().default(true),
});

export type ModeloInput = z.infer<typeof modeloSchema>;
