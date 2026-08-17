"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { getIcon } from "@/lib/icons";
import { formatBRL } from "@/lib/format";
import { useCart } from "@/components/landing/CartProvider";
import type { Service } from "@/lib/supabase/queries";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

export function ServicesMenu({ services }: { services: Service[] }) {
  const { isSelected, toggle } = useCart();
  const selectable = services.filter((s) => s.selectable !== false);

  if (!selectable.length) return null;

  return (
    <section id="servicos" className="container py-20">
      <div className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-1 rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
          <Sparkles className="h-3 w-3" /> Cardápio
        </span>
        <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
          Escolha os serviços que combinam com sua campanha
        </h2>
        <p className="mt-3 text-muted-foreground">
          Marque quantos quiser. A sacola no fim da página monta a mensagem certa pro WhatsApp.
        </p>
      </div>

      <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {selectable.map((service) => {
          const Icon = getIcon(service.icon);
          const selected = isSelected(service.id);
          return (
            <li key={service.id}>
              <button
                type="button"
                onClick={() => toggle(service.id)}
                aria-pressed={selected}
                aria-label={`Selecionar ${service.name}`}
                className={cn(
                  "group block w-full rounded-2xl border bg-card p-5 text-left transition-all duration-200",
                  "hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10",
                  selected &&
                    "border-primary bg-primary/5 shadow-md shadow-primary/20 ring-2 ring-primary/30"
                )}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors",
                      selected
                        ? "bg-primary text-primary-foreground"
                        : "bg-primary/10 text-primary group-hover:bg-primary/15"
                    )}
                  >
                    <Icon className="h-6 w-6" aria-hidden />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold leading-tight">{service.name}</h3>
                      <Checkbox
                        checked={selected}
                        onCheckedChange={() => toggle(service.id)}
                        aria-label={`Selecionar ${service.name}`}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    {service.description && (
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                        {service.description}
                      </p>
                    )}
                    <p className="mt-3 text-lg font-bold text-primary">
                      {formatBRL(service.price_cents)}
                    </p>
                  </div>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
