"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <h2 className="text-2xl font-semibold">Algo deu errado</h2>
      <p className="text-muted-foreground">
        Não conseguimos carregar a página. Tente novamente.
      </p>
      <Button onClick={() => reset()}>Tentar novamente</Button>
    </div>
  );
}
