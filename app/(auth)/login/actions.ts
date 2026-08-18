"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { loginSchema } from "@/lib/validation/auth";
import { redirect } from "next/navigation";

export async function signIn(formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error || !data.user) {
    return { error: "E-mail ou senha inválidos." };
  }

  // Garante que o profile existe e promove a admin se for o primeiro.
  // Usa o service_role (bypassa RLS) porque o profile ainda pode estar faltando.
  const admin = createAdminClient();
  const { data: anyAdmin } = await admin
    .from("profiles")
    .select("id")
    .eq("is_admin", true)
    .limit(1)
    .maybeSingle();

  const shouldPromote = !anyAdmin;

  await admin.from("profiles").upsert(
    {
      id: data.user.id,
      email: data.user.email ?? "",
      is_admin: shouldPromote ? true : undefined,
    },
    { onConflict: "id" }
  );

  // redirect() throw NÃO retorna — os cookies de sessão já foram
  // commitados via cookies() do next/headers dentro do setAll.
  redirect("/admin");
}

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/login");
}