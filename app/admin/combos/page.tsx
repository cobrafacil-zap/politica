import { createClient } from "@/lib/supabase/server";
import { ComboAdmin } from "@/components/admin/ComboAdmin";

export default async function CombosPage() {
  const supabase = createClient();
  const [{ data: combos }, { data: services }, { data: comboServices }] = await Promise.all([
    supabase.from("combos").select("*").order("display_order").order("created_at"),
    supabase.from("services").select("id, name").order("display_order"),
    supabase.from("combo_services").select("combo_id, service_id"),
  ]);
  return (
    <ComboAdmin
      combos={combos ?? []}
      services={services ?? []}
      comboServices={comboServices ?? []}
    />
  );
}
