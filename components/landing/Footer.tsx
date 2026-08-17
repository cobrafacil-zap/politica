import { Instagram, Facebook, Youtube, Mail } from "lucide-react";

type Props = {
  companyName: string;
  contactEmail: string | null;
  instagramUrl?: string | null;
  facebookUrl?: string | null;
  youtubeUrl?: string | null;
};

export function Footer({ companyName, contactEmail, instagramUrl, facebookUrl, youtubeUrl }: Props) {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t bg-background">
      <div className="container flex flex-col items-center gap-4 py-8 text-sm text-muted-foreground md:flex-row md:justify-between">
        <p>© {year} {companyName}. Todos os direitos reservados.</p>
        <div className="flex items-center gap-4">
          {contactEmail && (
            <a
              href={`mailto:${contactEmail}`}
              className="inline-flex items-center gap-1 hover:text-foreground"
              aria-label="Enviar e-mail"
            >
              <Mail className="h-4 w-4" aria-hidden />
              {contactEmail}
            </a>
          )}
          {instagramUrl && (
            <a href={instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <Instagram className="h-4 w-4" aria-hidden />
            </a>
          )}
          {facebookUrl && (
            <a href={facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <Facebook className="h-4 w-4" aria-hidden />
            </a>
          )}
          {youtubeUrl && (
            <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <Youtube className="h-4 w-4" aria-hidden />
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
