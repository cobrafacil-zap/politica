import { createClient } from "@/lib/supabase/server";
import { TestimonialAdmin } from "@/components/admin/TestimonialAdmin";

export default async function DepoimentosPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from("testimonials")
    .select("*")
    .order("display_order")
    .order("created_at");
  return <TestimonialAdmin items={data ?? []} />;
}
