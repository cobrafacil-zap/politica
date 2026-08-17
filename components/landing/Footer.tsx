import { Instagram, Facebook, Youtube, Mail, Megaphone } from "lucide-react";

type Props = {
  companyName: string;
  contactEmail: string | null;
  instagramUrl?: string | null;
  facebookUrl?: string | null;
  youtubeUrl?: string | null;
};

export function Footer({
  companyName,
  contactEmail,
  instagramUrl,
  facebookUrl,
  youtubeUrl,
}: Props) {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t bg-muted/20">
      <div className="container flex flex-col items-center gap-6 py-10 text-sm md:flex-row md:justify-between">
        <div className="flex items-center gap-2 text-muted-foreground">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Megaphone className="h-4 w-4" aria-hidden />
          </span>
          <p>
            © {year} <span className="font-semibold text-foreground">{companyName}</span>.
            Todos os direitos reservados.
          </p>
        </div>
        <div className="flex items-center gap-4 text-muted-foreground">
          {contactEmail && (
            <a
              href={`mailto:${contactEmail}`}
              className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
              aria-label="Enviar e-mail"
            >
              <Mail className="h-4 w-4" aria-hidden />
              {contactEmail}
            </a>
          )}
          {instagramUrl && (
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="transition-colors hover:text-foreground"
            >
              <Instagram className="h-4 w-4" aria-hidden />
            </a>
          )}
          {facebookUrl && (
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="transition-colors hover:text-foreground"
            >
              <Facebook className="h-4 w-4" aria-hidden />
            </a>
          )}
          {youtubeUrl && (
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="transition-colors hover:text-foreground"
            >
              <Youtube className="h-4 w-4" aria-hidden />
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
