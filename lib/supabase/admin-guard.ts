import { createClient } from "@/lib/supabase/server";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

/**
 * Garante que o usuário atual está autenticado E é admin.
 * Use no início de cada server action que escreve dados.
 */
export async function assertAdmin() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) {
    throw new Error("Acesso negado: usuário não é admin");
  }
  return { supabase, user };
}

/**
 * Revalida a landing page após mutações admin.
 */
export function revalidateLanding() {
  revalidateTag("landing");
}
