import { createClient } from "@/lib/supabase/server";
import { SettingsForm } from "@/components/admin/SettingsForm";

export default async function ConfiguracoesPage() {
  const supabase = createClient();
  const { data } = await supabase.from("settings").select("*").eq("id", 1).single();
  return <SettingsForm initial={data ?? { company_name: "Social Marketing Digital" }} />;
}
