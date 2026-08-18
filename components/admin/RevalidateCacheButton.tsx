"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { toast } from "sonner";

/**
 * Botao que invalida o cache do getLandingData via /api/admin/revalidate.
 * Use apos rodar migracoes/SQL direto no Supabase para forcar a
 * landing publica a recarregar os dados imediatamente.
 */
export function RevalidateCacheButton() {
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(false);

  const handleClick = () => {
    startTransition(async () => {
      const res = await fetch("/api/admin/revalidate", { method: "POST" });
      if (res.ok) {
        setDone(true);
        toast.success("Cache atualizado. A home ja reflete os dados novos.");
      } else {
        toast.error("Falha ao atualizar cache");
      }
    });
  };

  return (
    <Button variant="outline" size="sm" onClick={handleClick} disabled={pending}>
      <RefreshCcw className={`mr-2 h-4 w-4 ${pending ? "animate-spin" : ""}`} />
      {pending ? "Atualizando…" : done ? "Cache atualizado" : "Atualizar cache da home"}
    </Button>
  );
}
