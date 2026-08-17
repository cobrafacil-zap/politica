import { createClient } from "@/lib/supabase/server";
import { PortfolioAdmin } from "@/components/admin/PortfolioAdmin";

export default async function PortfolioPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from("portfolio_items")
    .select("*")
    .order("display_order")
    .order("created_at");
  return <PortfolioAdmin items={data ?? []} />;
}
