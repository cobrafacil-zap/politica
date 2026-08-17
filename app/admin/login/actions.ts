"use server";

import { createClient } from "@/lib/supabase/server";
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

  // Garante que o profile existe (caso seja o primeiro login)
  await supabase
    .from("profiles")
    .upsert({ id: data.user.id, email: data.user.email ?? "" }, { onConflict: "id" });

  // redirect() throw NÃO retorna — os cookies de sessão já foram
  // commitados via cookies() do next/headers dentro do setAll.
  redirect("/admin");
}

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}