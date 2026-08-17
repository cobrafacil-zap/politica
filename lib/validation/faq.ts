import { z } from "zod";

export const faqSchema = z.object({
  question: z.string().min(5).max(200),
  answer: z.string().min(5).max(1000),
  display_order: z.coerce.number().int().min(0).default(0),
  active: z.coerce.boolean().default(true),
});

export type FAQInput = z.infer<typeof faqSchema>;
