import { z } from "zod";

export const portfolioSchema = z.object({
  title: z.string().min(2).max(120),
  description: z.string().max(500).optional().nullable(),
  image_url: z.string().url("Informe uma URL válida"),
  client_name: z.string().max(120).optional().nullable(),
  year: z.coerce.number().int().min(1900).max(2100).optional().nullable(),
  category: z.string().max(60).optional().nullable(),
  display_order: z.coerce.number().int().min(0).default(0),
  active: z.coerce.boolean().default(true),
});

export type PortfolioInput = z.infer<typeof portfolioSchema>;
