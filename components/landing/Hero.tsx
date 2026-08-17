import { WhatsAppButton } from "@/components/landing/WhatsAppButton";

type Props = {
  title: string;
  subtitle: string;
  ctaLabel: string;
  whatsappNumber: string | null;
  companyName: string;
};

export function Hero({ title, subtitle, ctaLabel, whatsappNumber, companyName }: Props) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-background">
      <div className="container flex min-h-[60vh] flex-col items-center justify-center gap-6 py-20 text-center">
        <span className="rounded-full border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground">
          Marketing político que gera resultado
        </span>
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight md:text-6xl">
          {title}
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground md:text-xl">
          {subtitle}
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <WhatsAppButton
            number={whatsappNumber}
            message={`Olá! Quero saber mais sobre os serviços da ${companyName}.`}
            size="lg"
            aria-label={ctaLabel}
          >
            {ctaLabel}
          </WhatsAppButton>
          <a
            href="#combos"
            className="inline-flex h-11 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Ver combos
          </a>
        </div>
      </div>
    </section>
  );
}
