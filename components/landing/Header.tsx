import Link from "next/link";
import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "@/components/landing/WhatsAppButton";
import { Megaphone } from "lucide-react";

type Props = {
  companyName: string;
  whatsappNumber: string | null;
  instagramUrl?: string | null;
  facebookUrl?: string | null;
  youtubeUrl?: string | null;
};

const NAV = [
  { href: "#servicos", label: "Serviços" },
  { href: "#combos", label: "Combos" },
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#portfolio", label: "Portfólio" },
  { href: "#faq", label: "FAQ" },
];

export function Header({ companyName, whatsappNumber }: Props) {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Megaphone className="h-5 w-5 text-primary" aria-hidden />
          <span>{companyName}</span>
        </Link>

        <nav aria-label="Navegação principal" className="hidden md:block">
          <ul className="flex items-center gap-6 text-sm">
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <WhatsAppButton
            number={whatsappNumber}
            message={`Olá! Quero saber mais sobre os serviços da ${companyName}.`}
            variant="default"
            size="sm"
            className="hidden sm:inline-flex"
          >
            Falar no WhatsApp
          </WhatsAppButton>
        </div>
      </div>
    </header>
  );
}
