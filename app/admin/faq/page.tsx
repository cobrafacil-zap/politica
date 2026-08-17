import { createClient } from "@/lib/supabase/server";
import { FAQAdmin } from "@/components/admin/FAQAdmin";

export default async function FAQsPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from("faqs")
    .select("*")
    .order("display_order")
    .order("created_at");
  return <FAQAdmin items={data ?? []} />;
}
