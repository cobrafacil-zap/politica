"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[admin error]", error);
  }, [error]);

  return (
    <div className="space-y-4 p-6">
      <div className="rounded-md border border-destructive/30 bg-destructive/5 p-4">
        <h2 className="text-lg font-semibold text-destructive">
          Erro ao processar acao
        </h2>
        <p className="mt-2 text-sm">
          Quando o servidor retorna um erro ao salvar (ex: campo obrigatorio
          vazio, problema no banco), o Next mostrava a tela vermelha generica.
          Esta tela mostra o erro real para facilitar o diagnostico.
        </p>
        <div className="mt-3 rounded border bg-background p-3 text-xs">
          <p className="font-mono">
            <strong>Mensagem:</strong> {error.message || "sem mensagem"}
          </p>
          {error.digest && (
            <p className="mt-1 font-mono text-muted-foreground">
              <strong>Digest:</strong> {error.digest}
            </p>
          )}
        </div>
        <div className="mt-4 flex gap-2">
          <Button onClick={reset} size="sm">
            Tentar de novo
          </Button>
        </div>
      </div>
    </div>
  );
}
