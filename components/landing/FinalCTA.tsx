import { WhatsAppButton } from "@/components/landing/WhatsAppButton";

type Props = {
  whatsappNumber: string | null;
  companyName: string;
  aboutText: string | null;
};

export function FinalCTA({ whatsappNumber, companyName, aboutText }: Props) {
  return (
    <section className="bg-primary py-20 text-primary-foreground">
      <div className="container text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
          Pronto para dar o próximo passo?
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-lg opacity-90">
          {aboutText ??
            `Fale agora com a equipe da ${companyName} e monte um plano sob medida para sua campanha.`}
        </p>
        <div className="mt-8">
          <WhatsAppButton
            number={whatsappNumber}
            message={`Olá! Quero conversar com a ${companyName} sobre minha campanha.`}
            size="lg"
            variant="secondary"
            aria-label="Falar agora no WhatsApp"
          >
            Falar agora no WhatsApp
          </WhatsAppButton>
        </div>
      </div>
    </section>
  );
}
