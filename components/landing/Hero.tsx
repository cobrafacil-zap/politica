import { ArrowRight, Sparkles, MessageCircle, ChevronDown } from "lucide-react";
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
    <section className="relative overflow-hidden">
      {/* Fundo decorativo */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-background to-primary/5"
      />
      <div
        aria-hidden
        className="absolute -top-24 left-1/2 -z-10 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute right-0 top-1/3 -z-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
      />

      <div className="container flex min-h-[80vh] flex-col items-center justify-center gap-6 py-24 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border bg-background/80 px-3 py-1.5 text-xs font-medium text-foreground shadow-sm backdrop-blur">
          <Sparkles className="h-3 w-3 text-primary" />
          Marketing político que gera resultado
        </span>

        <h1 className="max-w-4xl text-balance font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
          {title}
        </h1>

        <p className="max-w-2xl text-balance text-lg text-muted-foreground md:text-xl">
          {subtitle}
        </p>

        <div className="mt-2 flex flex-col items-center gap-3 sm:flex-row">
          <WhatsAppButton
            number={whatsappNumber}
            message={`Olá! Quero saber mais sobre os serviços da ${companyName}.`}
            size="lg"
            aria-label={ctaLabel}
            className="group h-12 px-6 text-base shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30"
          >
            {ctaLabel}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </WhatsAppButton>
          <a
            href="#servicos"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-input bg-background/60 px-6 text-base font-medium backdrop-blur transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <MessageCircle className="h-4 w-4 text-primary" />
            Ver cardápio
          </a>
        </div>

        <a
          href="#servicos"
          aria-label="Rolar para o cardápio"
          className="mt-8 inline-flex animate-bounce text-muted-foreground/60 hover:text-foreground"
        >
          <ChevronDown className="h-6 w-6" />
        </a>
      </div>
    </section>
  );
}
