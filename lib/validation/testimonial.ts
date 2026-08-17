import { z } from "zod";

export const testimonialSchema = z.object({
  client_name: z.string().min(2).max(80),
  role: z.string().max(80).optional().nullable(),
  content: z.string().min(5).max(500),
  avatar_url: z.string().url().optional().nullable(),
  rating: z.coerce.number().int().min(1).max(5).optional().nullable(),
  display_order: z.coerce.number().int().min(0).default(0),
  active: z.coerce.boolean().default(true),
});

export type TestimonialInput = z.infer<typeof testimonialSchema>;
