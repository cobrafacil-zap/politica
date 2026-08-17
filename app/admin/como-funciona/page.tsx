import { createClient } from "@/lib/supabase/server";
import { StepAdmin } from "@/components/admin/StepAdmin";

export default async function ComoFuncionaPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from("how_it_works_steps")
    .select("*")
    .order("step_number")
    .order("display_order");
  return <StepAdmin items={data ?? []} />;
}
