"use client";

import Image from "next/image";
import { Check, Plus, Sparkles } from "lucide-react";
import { getIcon } from "@/lib/icons";
import { formatBRL } from "@/lib/format";
import { useCart } from "@/components/landing/CartProvider";
import type { Service } from "@/lib/supabase/queries";
import { cn } from "@/lib/utils";

export function ServicesMenu({ services }: { services: Service[] }) {
  const { isSelected, toggle } = useCart();
  const selectable = services.filter((s) => s.selectable !== false);

  if (!selectable.length) return null;

  return (
    <section
      id="servicos"
      className="relative bg-background py-20 md:py-28"
    >
      <div
        aria-hidden
        className="absolute inset-x-0 -top-10 h-10 bg-gradient-to-b from-transparent to-background"
      />

      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-foreground bg-background px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-foreground">
            <Sparkles className="h-3 w-3" /> Cardápio
          </span>
          <h2 className="mt-4 font-display text-4xl font-black tracking-tighter md:text-6xl">
            Escolha o que faz sentido<br />pra sua campanha.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Marque quantos quiser. A sacola monta a mensagem certinha pro WhatsApp.
          </p>
        </div>

        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {selectable.map((service) => {
            const Icon = getIcon(service.icon);
            const selected = isSelected(service.id);
            return (
              <li key={service.id} className="group">
                <button
                  type="button"
                  onClick={() => toggle(service.id)}
                  aria-pressed={selected}
                  aria-label={`Selecionar ${service.name}`}
                  className={cn(
                    "relative flex h-full w-full flex-col overflow-hidden rounded-3xl border-2 bg-card text-left transition-all duration-300",
                    "hover:-translate-y-1 hover:shadow-2xl",
                    selected
                      ? "border-foreground shadow-2xl ring-4 ring-primary/30"
                      : "border-border hover:border-foreground/40"
                  )}
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    {service.image_url ? (
                      <Image
                        src={service.image_url}
                        alt={service.name}
                        fill
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className={cn(
                          "object-cover transition-transform duration-700",
                          "group-hover:scale-110",
                          selected && "scale-110"
                        )}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/30 via-primary/10 to-foreground/20">
                        <Icon
                          className="h-20 w-20 text-foreground/40"
                          aria-hidden
                        />
                      </div>
                    )}
                    <div
                      aria-hidden
                      className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
                    />

                    {service.price_cents > 0 && (
                      <div className="absolute right-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-lg">
                        A partir de {formatBRL(service.price_cents)}
                      </div>
                    )}

                    <div className="absolute bottom-3 left-3 flex h-10 w-10 items-center justify-center rounded-xl bg-background/95 text-foreground shadow-md backdrop-blur">
                      <Icon className="h-5 w-5" aria-hidden />
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col gap-3 p-5">
                    <h3 className="font-display text-2xl font-bold leading-tight">
                      {service.name}
                    </h3>
                    {service.description && (
                      <p className="line-clamp-2 text-sm text-muted-foreground">
                        {service.description}
                      </p>
                    )}

                    <div
                      className={cn(
                        "mt-auto flex items-center justify-between gap-2 rounded-xl px-4 py-3 text-sm font-bold uppercase tracking-wider transition-colors",
                        selected
                          ? "bg-foreground text-background"
                          : "bg-muted text-foreground group-hover:bg-foreground group-hover:text-background"
                      )}
                    >
                      <span>
                        {selected ? "Adicionado à sacola" : "Adicionar à sacola"}
                      </span>
                      {selected ? (
                        <Check className="h-5 w-5" aria-hidden />
                      ) : (
                        <Plus className="h-5 w-5" aria-hidden />
                      )}
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}