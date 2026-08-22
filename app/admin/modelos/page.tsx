import { createClient } from "@/lib/supabase/server";
import { ModeloAdmin } from "@/components/admin/ModeloAdmin";

export default async function ModelosAdminPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from("modelos")
    .select("*")
    .order("display_order")
    .order("created_at");

  // cast seguro: RLS já garante shape, e a página é admin-only
  return <ModeloAdmin items={(data ?? []) as any} />;
}
