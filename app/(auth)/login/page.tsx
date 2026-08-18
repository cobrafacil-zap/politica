import { LoginForm } from "@/components/admin/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md space-y-6 rounded-lg border bg-card p-8 shadow-sm">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Painel admin</h1>
          <p className="text-sm text-muted-foreground">
            Entre com seu e-mail e senha para gerenciar o site.
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
