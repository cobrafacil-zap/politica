import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { createClient } from "@/lib/supabase/server";

/**
 * Invalida caches da landing sem precisar editar nada.
 *
 * Util apos rodar migrations/SQL direto no Supabase: limpa
 * o unstable_cache do getLandingData (tag "landing") e as
 * paginas estaticas.
 *
 * Protegido: so admin autenticado consegue chamar.
 */
export async function POST() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Nao autenticado" }, { status: 401 });
  }
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();
  if (!profile?.is_admin) {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  revalidateTag("landing");
  revalidatePath("/");

  return NextResponse.json({ ok: true });
}
