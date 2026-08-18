import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/admin/Sidebar";
import { Toaster } from "@/components/ui/sonner";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Verifica se é admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) {
    return (
      <div className="container flex min-h-screen items-center justify-center text-center">
        <div className="max-w-md space-y-4">
          <h1 className="text-2xl font-semibold">Acesso negado</h1>
          <p className="text-muted-foreground">
            Seu usuário não tem permissão de administrador. Fale com o responsável.
          </p>
        </div>
        <Toaster richColors position="top-right" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      <Sidebar email={user.email ?? ""} />
      <main className="flex-1 p-6 md:p-8">{children}</main>
      <Toaster richColors position="top-right" />
    </div>
  );
}
