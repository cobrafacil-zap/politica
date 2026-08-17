import { ArrowRight, Sparkles } from "lucide-react";
import { WhatsAppButton } from "@/components/landing/WhatsAppButton";

type Props = {
  whatsappNumber: string | null;
  companyName: string;
  aboutText: string | null;
};

export function FinalCTA({ whatsappNumber, companyName, aboutText }: Props) {
  return (
    <section className="relative overflow-hidden bg-foreground py-24 text-background md:py-32">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-br from-foreground via-foreground to-primary/30"
      />
      <div
        aria-hidden
        className="absolute -right-32 -top-32 -z-10 h-96 w-96 rounded-full bg-primary/40 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -bottom-32 -left-32 -z-10 h-96 w-96 rounded-full bg-primary/30 blur-3xl"
      />

      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)",
          backgroundSize: "20px 20px",
        }}
      />

      <div className="container relative text-center">
        <span className="inline-flex items-center gap-2 rounded-full border-2 border-primary bg-foreground px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
          <Sparkles className="h-3 w-3" />
          Última chamada
        </span>

        <h2 className="mt-6 font-display text-5xl font-black leading-[0.95] tracking-tighter md:text-7xl lg:text-8xl">
          Vença a próxima<br />conversa.
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-background/80 md:text-xl">
          {aboutText ??
            `Fale agora com a equipe da ${companyName} e monte um plano sob medida pra sua campanha.`}
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <WhatsAppButton
            number={whatsappNumber}
            message={`Olá! Quero conversar com a ${companyName} sobre minha campanha.`}
            size="lg"
            aria-label="Falar agora no WhatsApp"
            className="group h-16 px-10 text-lg font-bold uppercase tracking-wide shadow-2xl shadow-primary/50 transition-all hover:scale-[1.02]"
          >
            Falar agora no WhatsApp
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </WhatsAppButton>
        </div>
      </div>
    </section>
  );
}