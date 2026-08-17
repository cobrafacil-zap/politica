import { ComboCard } from "@/components/landing/ComboCard";
import type { Combo, Service } from "@/lib/supabase/queries";
import { Package } from "lucide-react";

type Props = {
  combos: (Combo & { services: Service[] })[];
};

export function CombosSection({ combos }: Props) {
  if (!combos.length) return null;

  return (
    <section id="combos" className="bg-muted/40 py-20">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1 rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
            <Package className="h-3 w-3" /> Combos prontos
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
            Ou escolha um combo com desconto
          </h2>
          <p className="mt-3 text-muted-foreground">
            Pacotes montados para os momentos mais comuns de campanha. Mais barato que a soma dos avulsos.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {combos.map((combo) => (
            <ComboCard key={combo.id} combo={combo} />
          ))}
        </div>
      </div>
    </section>
  );
}
