import { ComboCard } from "@/components/landing/ComboCard";
import type { Combo, Service } from "@/lib/supabase/queries";
import { Package } from "lucide-react";

type Props = {
  combos: (Combo & { services: Service[] })[];
};

export function CombosSection({ combos }: Props) {
  if (!combos.length) return null;

  return (
    <section
      id="combos"
      className="relative overflow-hidden py-20 md:py-28"
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/8 via-background to-amber-500/8"
      />

      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-foreground bg-background px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-foreground">
            <Package className="h-3 w-3" /> Combos prontos
          </span>
          <h2 className="mt-4 font-display text-4xl font-black tracking-tighter md:text-6xl">
            Pacotes montados<br />pros momentos-chave.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Mais barato que a soma dos avulsos. Pensa como estratégia, não como gasto.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {combos.map((combo) => (
            <ComboCard key={combo.id} combo={combo} />
          ))}
        </div>
      </div>
    </section>
  );
}