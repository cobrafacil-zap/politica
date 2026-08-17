import { ComboCard } from "@/components/landing/ComboCard";
import type { Combo, Service } from "@/lib/supabase/queries";

type Props = {
  combos: (Combo & { services: Service[] })[];
  whatsappNumber: string | null;
  companyName: string;
};

export function CombosSection({ combos, whatsappNumber, companyName }: Props) {
  if (!combos.length) return null;

  return (
    <section id="combos" className="bg-muted/40 py-20">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Combos prontos para sua campanha
          </h2>
          <p className="mt-3 text-muted-foreground">
            Escolha o combo ideal para o seu momento. Personalize conforme precisar.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {combos.map((combo) => (
            <ComboCard
              key={combo.id}
              combo={combo}
              whatsappNumber={whatsappNumber}
              companyName={companyName}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
