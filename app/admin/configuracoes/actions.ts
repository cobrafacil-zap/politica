"use server";

import { revalidatePath } from "next/cache";
import { assertAdmin, revalidateLanding } from "@/lib/supabase/admin-guard";
import { settingsSchema } from "@/lib/validation/settings";

export async function updateSettings(formData: FormData) {
  const { supabase } = await assertAdmin();
  const parsed = settingsSchema.parse({
    company_name: formData.get("company_name") || "Social Marketing Digital",
    whatsapp_number: formData.get("whatsapp_number") || null,
    hero_title: formData.get("hero_title") || null,
    hero_subtitle: formData.get("hero_subtitle") || null,
    hero_cta_label: formData.get("hero_cta_label") || null,
    hero_image_url: formData.get("hero_image_url") || null,
    about_text: formData.get("about_text") || null,
    contact_email: formData.get("contact_email") || null,
    instagram_url: formData.get("instagram_url") || null,
    facebook_url: formData.get("facebook_url") || null,
    youtube_url: formData.get("youtube_url") || null,
    stats_campaigns: formData.get("stats_campaigns") || null,
    stats_states: formData.get("stats_states") || null,
    stats_satisfaction: formData.get("stats_satisfaction") || null,
  });
  const { error } = await supabase
    .from("settings")
    .update(parsed)
    .eq("id", 1);
  if (error) return { error: error.message };
  revalidateLanding();
  revalidatePath("/admin/configuracoes");
  return { ok: true };
}
