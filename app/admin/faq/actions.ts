"use server";

import { revalidatePath } from "next/cache";
import { assertAdmin, revalidateLanding } from "@/lib/supabase/admin-guard";
import { faqSchema } from "@/lib/validation/faq";

export async function createFAQ(formData: FormData) {
  const { supabase } = await assertAdmin();
  const parsed = faqSchema.parse({
    question: formData.get("question"),
    answer: formData.get("answer"),
    display_order: formData.get("display_order") || 0,
    active: formData.get("active") === "on" || formData.get("active") === "true",
  });
  const { error } = await supabase.from("faqs").insert(parsed);
  if (error) return { error: error.message };
  revalidateLanding();
  revalidatePath("/admin/faq");
  return { ok: true };
}

export async function updateFAQ(id: string, formData: FormData) {
  const { supabase } = await assertAdmin();
  const parsed = faqSchema.parse({
    question: formData.get("question"),
    answer: formData.get("answer"),
    display_order: formData.get("display_order") || 0,
    active: formData.get("active") === "on" || formData.get("active") === "true",
  });
  const { error } = await supabase.from("faqs").update(parsed).eq("id", id);
  if (error) return { error: error.message };
  revalidateLanding();
  revalidatePath("/admin/faq");
  return { ok: true };
}

export async function deleteFAQ(id: string) {
  const { supabase } = await assertAdmin();
  const { error } = await supabase.from("faqs").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidateLanding();
  revalidatePath("/admin/faq");
  return { ok: true };
}
