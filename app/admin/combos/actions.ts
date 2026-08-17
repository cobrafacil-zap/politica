"use server";

import { revalidatePath } from "next/cache";
import { assertAdmin, revalidateLanding } from "@/lib/supabase/admin-guard";
import { comboSchema } from "@/lib/validation/combo";

function parseForm(formData: FormData) {
  const serviceIds = formData.getAll("service_ids").map(String);
  return comboSchema.parse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description") || null,
    image_url: formData.get("image_url") || null,
    price_cents: formData.get("price_cents") || 0,
    original_price_cents: formData.get("original_price_cents") || null,
    whatsapp_message: formData.get("whatsapp_message"),
    display_order: formData.get("display_order") || 0,
    active: formData.get("active") === "on" || formData.get("active") === "true",
    featured: formData.get("featured") === "on" || formData.get("featured") === "true",
    badge_text: formData.get("badge_text") || null,
    service_ids: serviceIds,
  });
}

export async function createCombo(formData: FormData) {
  const { supabase } = await assertAdmin();
  const { service_ids, ...data } = parseForm(formData);
  const { data: combo, error } = await supabase
    .from("combos")
    .insert(data)
    .select("id")
    .single();
  if (error) return { error: error.message };

  if (service_ids.length > 0) {
    const rows = service_ids.map((service_id) => ({
      combo_id: combo.id,
      service_id,
    }));
    const { error: e2 } = await supabase.from("combo_services").insert(rows);
    if (e2) return { error: e2.message };
  }

  revalidateLanding();
  revalidatePath("/admin/combos");
  return { ok: true };
}

export async function updateCombo(id: string, formData: FormData) {
  const { supabase } = await assertAdmin();
  const { service_ids, ...data } = parseForm(formData);

  const { error } = await supabase.from("combos").update(data).eq("id", id);
  if (error) return { error: error.message };

  await supabase.from("combo_services").delete().eq("combo_id", id);
  if (service_ids.length > 0) {
    const rows = service_ids.map((service_id) => ({
      combo_id: id,
      service_id,
    }));
    const { error: e2 } = await supabase.from("combo_services").insert(rows);
    if (e2) return { error: e2.message };
  }

  revalidateLanding();
  revalidatePath("/admin/combos");
  return { ok: true };
}

export async function deleteCombo(id: string) {
  const { supabase } = await assertAdmin();
  const { error } = await supabase.from("combos").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidateLanding();
  revalidatePath("/admin/combos");
  return { ok: true };
}
