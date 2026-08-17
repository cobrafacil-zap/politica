import { createClient } from "@/lib/supabase/server";
import { ServiceAdmin } from "@/components/admin/ServiceAdmin";

export default async function ServicosPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from("services")
    .select("*")
    .order("display_order")
    .order("created_at");
  return <ServiceAdmin items={data ?? []} />;
}
