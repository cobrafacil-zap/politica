import Link from "next/link";
import { Megaphone } from "lucide-react";
import { WhatsAppButton } from "@/components/landing/WhatsAppButton";

type Props = {
  companyName: string;
  whatsappNumber: string | null;
  instagramUrl?: string | null;
  facebookUrl?: string | null;
  youtubeUrl?: string | null;
};

const NAV = [
  { href: "#servicos", label: "Cardápio" },
  { href: "#combos", label: "Combos" },
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#portfolio", label: "Portfólio" },
  { href: "#faq", label: "FAQ" },
];

export function Header({ companyName, whatsappNumber }: Props) {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-base font-bold tracking-tight"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Megaphone className="h-4 w-4" aria-hidden />
          </span>
          <span className="hidden sm:inline">{companyName}</span>
        </Link>

        <nav aria-label="Navegação principal" className="hidden md:block">
          <ul className="flex items-center gap-6 text-sm font-medium">
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

        <WhatsAppButton
          number={whatsappNumber}
          message={`Olá! Quero saber mais sobre os serviços da ${companyName}.`}
          size="sm"
          aria-label="Falar no WhatsApp"
          className="shadow-md shadow-primary/20"
        >
          WhatsApp
        </WhatsAppButton>
      </div>
    </header>
  );
}
