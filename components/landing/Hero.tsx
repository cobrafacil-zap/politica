import Image from "next/image";
import { ArrowRight, Megaphone } from "lucide-react";
import { WhatsAppButton } from "@/components/landing/WhatsAppButton";

type Props = {
  title: string;
  subtitle: string;
  ctaLabel: string;
  whatsappNumber: string | null;
  companyName: string;
  heroImageUrl: string | null;
};

const AUDIENCE = [
  "Prefeitos",
  "Vereadores",
  "Deputados",
  "Governadores",
  "Candidatos a qualquer cargo",
];

export function Hero({
  title,
  subtitle,
  ctaLabel,
  whatsappNumber,
  companyName,
  heroImageUrl,
}: Props) {
  return (
    <section className="relative overflow-hidden bg-foreground text-background">
      {heroImageUrl && (
        <div className="absolute inset-0 -z-10">
          <Image
            src={heroImageUrl}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-40"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-r from-foreground via-foreground/85 to-foreground/40"
          />
        </div>
      )}

      <div className="container relative grid items-center gap-12 py-20 md:grid-cols-2 md:py-28">
        <div className="space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
            <Megaphone className="h-3 w-3" />
            Eleições 2026
          </span>

          <h1 className="font-display text-5xl font-black leading-[0.95] tracking-tighter md:text-7xl lg:text-8xl">
            {title}
          </h1>

          <p className="max-w-xl text-lg text-background/80 md:text-xl">
            {subtitle}
          </p>

          <div className="flex flex-col items-start gap-3 pt-2 sm:flex-row">
            <WhatsAppButton
              number={whatsappNumber}
              message={`Olá! Quero montar minha campanha com a ${companyName}.`}
              size="lg"
              aria-label={ctaLabel}
              className="group h-14 px-8 text-base font-bold uppercase tracking-wide shadow-2xl shadow-primary/40 transition-all hover:scale-[1.02] hover:shadow-primary/60"
            >
              {ctaLabel}
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </WhatsAppButton>
            <a
              href="#servicos"
              className="inline-flex h-14 items-center text-base font-semibold text-background/90 underline-offset-4 hover:underline"
            >
              Ver cardápio de serviços ↓
            </a>
          </div>
        </div>

        {heroImageUrl ? null : (
          <div className="relative hidden h-[480px] overflow-hidden rounded-3xl border border-background/10 bg-gradient-to-br from-primary/30 via-foreground to-foreground shadow-2xl md:block">
            <div className="absolute inset-0 grid place-items-center">
              <Megaphone className="h-32 w-32 text-primary/40" aria-hidden />
            </div>
            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-foreground to-transparent"
            />
            <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-background/20 bg-foreground/60 p-5 backdrop-blur">
              <p className="font-display text-2xl font-bold text-primary">
                Sua campanha começa aqui.
              </p>
              <p className="mt-1 text-sm text-background/80">
                Estratégia, conteúdo e tráfego — tudo num lugar só.
              </p>
            </div>
          </div>
        )}
      </div>

      <div
        aria-hidden
        className="relative border-y border-primary/30 bg-primary/15 py-3"
      >
        <div className="flex animate-[marquee_30s_linear_infinite] gap-12 whitespace-nowrap font-display text-sm font-bold uppercase tracking-widest text-primary">
          {[...AUDIENCE, ...AUDIENCE].map((item, i) => (
            <span key={i} className="flex items-center gap-12">
              {item}
              <span className="text-primary/40">★</span>
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}