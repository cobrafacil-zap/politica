"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { assertAdmin } from "@/lib/supabase/admin-guard";
import { modeloSchema } from "@/lib/validation/modelo";

function revalidateModelos() {
  revalidatePath("/admin/modelos");
  revalidatePath("/modelos");
  // getModelos em lib/supabase/queries.ts usa a tag "modelos"
  revalidateTag("modelos");
}

export async function createModelo(formData: FormData) {
  const { supabase } = await assertAdmin();
  let parsed;
  try {
    parsed = modeloSchema.parse({
      title: formData.get("title"),
      description: formData.get("description") || null,
      category: formData.get("category"),
      media_type: formData.get("media_type"),
      media_url: formData.get("media_url"),
      thumbnail_url: formData.get("thumbnail_url") || null,
      display_order: formData.get("display_order") || 0,
      active: formData.get("active") === "on" || formData.get("active") === "true",
    });
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Dados inválidos",
    };
  }

  const { error } = await supabase.from("modelos").insert(parsed);
  if (error) return { error: error.message };
  revalidateModelos();
  return { ok: true };
}

export async function updateModelo(id: string, formData: FormData) {
  const { supabase } = await assertAdmin();
  let parsed;
  try {
    parsed = modeloSchema.parse({
      title: formData.get("title"),
      description: formData.get("description") || null,
      category: formData.get("category"),
      media_type: formData.get("media_type"),
      media_url: formData.get("media_url"),
      thumbnail_url: formData.get("thumbnail_url") || null,
      display_order: formData.get("display_order") || 0,
      active: formData.get("active") === "on" || formData.get("active") === "true",
    });
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Dados inválidos",
    };
  }

  const { error } = await supabase.from("modelos").update(parsed).eq("id", id);
  if (error) return { error: error.message };
  revalidateModelos();
  return { ok: true };
}

export async function deleteModelo(id: string) {
  const { supabase } = await assertAdmin();
  const { error } = await supabase.from("modelos").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidateModelos();
  return { ok: true };
}
