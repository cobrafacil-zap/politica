"use server";

import { revalidatePath } from "next/cache";
import { assertAdmin, revalidateLanding } from "@/lib/supabase/admin-guard";
import { serviceSchema } from "@/lib/validation/service";

export async function createService(formData: FormData) {
  const { supabase } = await assertAdmin();
  const parsed = serviceSchema.parse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description") || null,
    icon: formData.get("icon") || null,
    price_cents: formData.get("price_cents") || 0,
    selectable: formData.get("selectable") === "on" || formData.get("selectable") === "true",
    display_order: formData.get("display_order") || 0,
    active: formData.get("active") === "on" || formData.get("active") === "true",
  });
  const { error } = await supabase.from("services").insert(parsed);
  if (error) return { error: error.message };
  revalidateLanding();
  revalidatePath("/admin/servicos");
  return { ok: true };
}

export async function updateService(id: string, formData: FormData) {
  const { supabase } = await assertAdmin();
  const parsed = serviceSchema.parse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description") || null,
    icon: formData.get("icon") || null,
    price_cents: formData.get("price_cents") || 0,
    selectable: formData.get("selectable") === "on" || formData.get("selectable") === "true",
    display_order: formData.get("display_order") || 0,
    active: formData.get("active") === "on" || formData.get("active") === "true",
  });
  const { error } = await supabase.from("services").update(parsed).eq("id", id);
  if (error) return { error: error.message };
  revalidateLanding();
  revalidatePath("/admin/servicos");
  return { ok: true };
}

export async function deleteService(id: string) {
  const { supabase } = await assertAdmin();
  const { error } = await supabase.from("services").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidateLanding();
  revalidatePath("/admin/servicos");
  return { ok: true };
}
