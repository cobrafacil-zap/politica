"use server";

import { revalidatePath } from "next/cache";
import { assertAdmin, revalidateLanding } from "@/lib/supabase/admin-guard";
import { stepSchema } from "@/lib/validation/step";

export async function createStep(formData: FormData) {
  const { supabase } = await assertAdmin();
  const rawImage = (formData.get("image_url") as string) ?? "";
  const parsed = stepSchema.parse({
    step_number: formData.get("step_number") || 1,
    title: formData.get("title"),
    description: formData.get("description"),
    icon: formData.get("icon") || null,
    image_url: rawImage === "" ? null : rawImage,
    display_order: formData.get("display_order") || 0,
    active: formData.get("active") === "on" || formData.get("active") === "true",
  });
  const { error } = await supabase.from("how_it_works_steps").insert(parsed);
  if (error) return { error: error.message };
  revalidateLanding();
  revalidatePath("/admin/como-funciona");
  return { ok: true };
}

export async function updateStep(id: string, formData: FormData) {
  const { supabase } = await assertAdmin();
  const rawImage = (formData.get("image_url") as string) ?? "";
  const parsed = stepSchema.parse({
    step_number: formData.get("step_number") || 1,
    title: formData.get("title"),
    description: formData.get("description"),
    icon: formData.get("icon") || null,
    image_url: rawImage === "" ? null : rawImage,
    display_order: formData.get("display_order") || 0,
    active: formData.get("active") === "on" || formData.get("active") === "true",
  });
  const { error } = await supabase.from("how_it_works_steps").update(parsed).eq("id", id);
  if (error) return { error: error.message };
  revalidateLanding();
  revalidatePath("/admin/como-funciona");
  return { ok: true };
}

export async function deleteStep(id: string) {
  const { supabase } = await assertAdmin();
  const { error } = await supabase.from("how_it_works_steps").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidateLanding();
  revalidatePath("/admin/como-funciona");
  return { ok: true };
}
