import { z } from "zod";

export const stepSchema = z.object({
  step_number: z.coerce.number().int().min(1).max(99),
  title: z.string().min(2).max(80),
  description: z.string().min(5).max(300),
  icon: z.string().max(40).optional().nullable(),
  image_url: z.string().url().or(z.literal("")).optional().nullable(),
  display_order: z.coerce.number().int().min(0).default(0),
  active: z.coerce.boolean().default(true),
});

export type StepInput = z.infer<typeof stepSchema>;
