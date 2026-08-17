"use server";

import { revalidatePath } from "next/cache";
import { assertAdmin, revalidateLanding } from "@/lib/supabase/admin-guard";
import { portfolioSchema } from "@/lib/validation/portfolio";

export async function createPortfolio(formData: FormData) {
  const { supabase } = await assertAdmin();
  const parsed = portfolioSchema.parse({
    title: formData.get("title"),
    description: formData.get("description") || null,
    image_url: formData.get("image_url"),
    client_name: formData.get("client_name") || null,
    year: formData.get("year") || null,
    category: formData.get("category") || null,
    display_order: formData.get("display_order") || 0,
    active: formData.get("active") === "on" || formData.get("active") === "true",
  });
  const { error } = await supabase.from("portfolio_items").insert(parsed);
  if (error) return { error: error.message };
  revalidateLanding();
  revalidatePath("/admin/portfolio");
  return { ok: true };
}

export async function updatePortfolio(id: string, formData: FormData) {
  const { supabase } = await assertAdmin();
  const parsed = portfolioSchema.parse({
    title: formData.get("title"),
    description: formData.get("description") || null,
    image_url: formData.get("image_url"),
    client_name: formData.get("client_name") || null,
    year: formData.get("year") || null,
    category: formData.get("category") || null,
    display_order: formData.get("display_order") || 0,
    active: formData.get("active") === "on" || formData.get("active") === "true",
  });
  const { error } = await supabase.from("portfolio_items").update(parsed).eq("id", id);
  if (error) return { error: error.message };
  revalidateLanding();
  revalidatePath("/admin/portfolio");
  return { ok: true };
}

export async function deletePortfolio(id: string) {
  const { supabase } = await assertAdmin();
  const { error } = await supabase.from("portfolio_items").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidateLanding();
  revalidatePath("/admin/portfolio");
  return { ok: true };
}
