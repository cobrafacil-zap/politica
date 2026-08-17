"use client";

import { Button, type ButtonProps } from "@/components/ui/button";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = Omit<ButtonProps, "asChild"> & {
  number: string | null;
  message: string;
  vars?: Record<string, string>;
  children?: React.ReactNode;
  className?: string;
};

export function WhatsAppButton({
  number,
  message,
  vars,
  children,
  className,
  variant = "default",
  size = "default",
  ...rest
}: Props) {
  const href = buildWhatsAppLink(number, message, vars);

  if (!href) {
    return (
      <span
        className={cn(
          "inline-flex h-10 items-center rounded-md border border-dashed px-4 text-xs text-muted-foreground",
          className
        )}
      >
        Configure o WhatsApp em /admin/configuracoes
      </span>
    );
  }

  return (
    <Button asChild variant={variant} size={size} className={className} {...rest}>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Abrir conversa no WhatsApp"
      >
        <MessageCircle className="h-4 w-4" aria-hidden />
        {children ?? "Falar no WhatsApp"}
      </a>
    </Button>
  );
}
