"use server";

import { revalidatePath } from "next/cache";
import { assertAdmin, revalidateLanding } from "@/lib/supabase/admin-guard";
import { testimonialSchema } from "@/lib/validation/testimonial";

export async function createTestimonial(formData: FormData) {
  const { supabase } = await assertAdmin();
  const parsed = testimonialSchema.parse({
    client_name: formData.get("client_name"),
    role: formData.get("role") || null,
    content: formData.get("content"),
    avatar_url: formData.get("avatar_url") || null,
    rating: formData.get("rating") || null,
    display_order: formData.get("display_order") || 0,
    active: formData.get("active") === "on" || formData.get("active") === "true",
  });
  const { error } = await supabase.from("testimonials").insert(parsed);
  if (error) return { error: error.message };
  revalidateLanding();
  revalidatePath("/admin/depoimentos");
  return { ok: true };
}

export async function updateTestimonial(id: string, formData: FormData) {
  const { supabase } = await assertAdmin();
  const parsed = testimonialSchema.parse({
    client_name: formData.get("client_name"),
    role: formData.get("role") || null,
    content: formData.get("content"),
    avatar_url: formData.get("avatar_url") || null,
    rating: formData.get("rating") || null,
    display_order: formData.get("display_order") || 0,
    active: formData.get("active") === "on" || formData.get("active") === "true",
  });
  const { error } = await supabase.from("testimonials").update(parsed).eq("id", id);
  if (error) return { error: error.message };
  revalidateLanding();
  revalidatePath("/admin/depoimentos");
  return { ok: true };
}

export async function deleteTestimonial(id: string) {
  const { supabase } = await assertAdmin();
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidateLanding();
  revalidatePath("/admin/depoimentos");
  return { ok: true };
}
