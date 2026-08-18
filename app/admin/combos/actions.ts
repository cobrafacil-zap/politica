"use server";

import { revalidatePath } from "next/cache";
import { assertAdmin, revalidateLanding } from "@/lib/supabase/admin-guard";
import { comboSchema, type ComboInput } from "@/lib/validation/combo";

function parseServiceIds(formData: FormData): string[] {
  const raw = formData.get("service_ids_json");
  if (typeof raw === "string" && raw.trim().startsWith("[")) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.filter((v): v is string => typeof v === "string");
      }
    } catch {
      // cai no fallback abaixo
    }
  }
  return formData.getAll("service_ids").map(String);
}

function parseNumOrNull(v: FormDataEntryValue | null): number | null {
  if (v == null) return null;
  const s = String(v).trim().replace(/\./g, "").replace(",", ".");
  if (s === "") return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

function parseForm(formData: FormData): ComboInput {
  const original = parseNumOrNull(formData.get("original_price_cents"));
  const price = parseNumOrNull(formData.get("price_cents")) ?? 0;
  const display = parseNumOrNull(formData.get("display_order")) ?? 0;

  const result = comboSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description") || null,
    image_url: formData.get("image_url") || null,
    price_cents: price,
    original_price_cents: original,
    whatsapp_message: formData.get("whatsapp_message"),
    display_order: display,
    active: formData.get("active") === "on" || formData.get("active") === "true",
    featured: formData.get("featured") === "on" || formData.get("featured") === "true",
    badge_text: formData.get("badge_text") || null,
    service_ids: parseServiceIds(formData),
  });
  if (!result.success) {
    const first = result.error.issues[0];
    throw new Error(
      `Campo "${first.path.join(".") || "?"}" invalido: ${first.message}`
    );
  }
  return result.data;
}

export async function createCombo(formData: FormData) {
  const { supabase } = await assertAdmin();
  let data: Omit<ComboInput, "service_ids">;
  let service_ids: string[];
  try {
    const parsed = parseForm(formData);
    ({ service_ids, ...data } = parsed);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Dados invalidos" };
  }
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
  let data: Omit<ComboInput, "service_ids">;
  let service_ids: string[];
  try {
    const parsed = parseForm(formData);
    ({ service_ids, ...data } = parsed);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Dados invalidos" };
  }

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
