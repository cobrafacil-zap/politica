"use client";

import { Button, type ButtonProps } from "@/components/ui/button";
import { buildWhatsAppLink } from "@/lib/whatsapp";
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
          "inline-flex h-10 items-center rounded-md border border-dashed border-amber-500/40 bg-amber-50 px-4 text-xs text-amber-900 dark:bg-amber-900/20 dark:text-amber-200",
          className
        )}
      >
        WhatsApp não configurado
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
        {children}
      </a>
    </Button>
  );
}
