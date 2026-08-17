"use client";

import { useState } from "react";
import { ShoppingCart, X, MessageCircle, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useCart } from "@/components/landing/CartProvider";
import { buildCartMessage, buildWhatsAppLink } from "@/lib/whatsapp";
import { formatBRL } from "@/lib/format";
import type { Service } from "@/lib/supabase/queries";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Props = {
  services: Service[];
  whatsappNumber: string | null;
  companyName: string;
};

export function Cart({ services, whatsappNumber, companyName }: Props) {
  const { items, remove, clear, hasItems } = useCart();
  const [open, setOpen] = useState(false);

  const selected = services.filter((s) => items.includes(s.id));
  const total = selected.reduce((acc, s) => acc + (s.price_cents ?? 0), 0);
  const message = buildCartMessage(companyName, selected);
  const link = buildWhatsAppLink(whatsappNumber, message);

  if (!hasItems) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/95 shadow-2xl backdrop-blur supports-[backdrop-filter]:bg-background/80 md:inset-x-auto md:bottom-6 md:right-6 md:w-[360px] md:rounded-2xl md:border">
      <div className="mx-auto flex max-w-md flex-col p-3 md:max-w-none">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <ShoppingCart className="h-5 w-5" aria-hidden />
            <span className="absolute -mt-6 ml-6 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs font-bold text-destructive-foreground">
              {items.length}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex flex-1 items-center justify-between text-left"
            aria-expanded={open}
          >
            <div>
              <p className="text-sm font-semibold">
                {items.length} serviço{items.length === 1 ? "" : "s"} selecionado
                {items.length === 1 ? "" : "s"}
              </p>
              <p className="text-xs text-muted-foreground">Total: {formatBRL(total)}</p>
            </div>
            {open ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" aria-hidden />
            ) : (
              <ChevronUp className="h-4 w-4 text-muted-foreground" aria-hidden />
            )}
          </button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => clear()}
            aria-label="Limpar sacola"
            className="hidden md:inline-flex"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {open && (
          <div className="mt-3 max-h-64 space-y-2 overflow-y-auto rounded-md border bg-card p-2 md:max-h-72">
            {selected.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent"
              >
                <span className="truncate">{s.name}</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{formatBRL(s.price_cents)}</span>
                  <button
                    type="button"
                    onClick={() => remove(s.id)}
                    aria-label={`Remover ${s.name}`}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-3 flex items-center gap-2">
          {link ? (
            <Button asChild className="flex-1" size="lg">
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Finalizar pedido no WhatsApp"
              >
                <MessageCircle className="h-4 w-4" />
                Finalizar no WhatsApp
              </a>
            </Button>
          ) : (
            <div
              className={cn(
                "flex flex-1 items-center justify-center rounded-md border border-dashed border-amber-500/50 bg-amber-50 px-3 py-2 text-xs text-amber-900 dark:bg-amber-900/20 dark:text-amber-200"
              )}
            >
              Configure o WhatsApp em /admin/configuracoes
            </div>
          )}
          <Button
            variant="outline"
            size="icon"
            onClick={() => clear()}
            aria-label="Limpar sacola"
            className="md:hidden"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
