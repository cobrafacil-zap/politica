"use client";

import { Sparkles, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatBRL } from "@/lib/format";
import { useCart } from "@/components/landing/CartProvider";
import type { Combo, Service } from "@/lib/supabase/queries";
import { cn } from "@/lib/utils";

type Props = {
  combo: Combo & { services: Service[] };
};

export function ComboCard({ combo }: Props) {
  const { setMany } = useCart();

  const itemsTotal = combo.services.reduce((acc, s) => acc + s.price_cents, 0);
  const hasDiscount =
    itemsTotal > 0 &&
    combo.price_cents < itemsTotal;
  const discountPct = hasDiscount
    ? Math.round(((itemsTotal - combo.price_cents) / itemsTotal) * 100)
    : 0;

  const handlePickCombo = () => {
    setMany(combo.services.map((s) => s.id));
    // Rola até a sacola
    setTimeout(() => {
      document
        .getElementById("cart-anchor")
        ?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 50);
  };

  return (
    <Card
      className={cn(
        "relative flex h-full flex-col overflow-hidden transition-all duration-200",
        "hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/10",
        combo.featured &&
          "border-primary/50 shadow-lg shadow-primary/10 ring-1 ring-primary/30"
      )}
    >
      {combo.badge_text && (
        <Badge className="absolute left-1/2 top-0 -translate-x-1/2 rounded-b-md rounded-t-none px-3 py-1 text-xs">
          {combo.badge_text}
        </Badge>
      )}
      <CardHeader className={combo.badge_text ? "pt-8" : ""}>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-2xl">{combo.name}</CardTitle>
          {combo.featured && (
            <Sparkles className="h-5 w-5 shrink-0 text-primary" aria-hidden />
          )}
        </div>
        {combo.description && (
          <p className="mt-2 text-sm text-muted-foreground">{combo.description}</p>
        )}
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-4xl font-bold tracking-tight">
            {formatBRL(combo.price_cents)}
          </span>
          {hasDiscount && (
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground line-through">
                {formatBRL(itemsTotal)}
              </span>
              <span className="text-xs font-semibold text-primary">
                Economize {discountPct}%
              </span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        {combo.services.length > 0 && (
          <ul className="mb-6 space-y-2 text-sm">
            {combo.services.map((s) => (
              <li key={s.id} className="flex items-start gap-2">
                <Check
                  className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                  aria-hidden
                />
                <span className="flex-1">{s.name}</span>
                <span className="text-xs text-muted-foreground">
                  {formatBRL(s.price_cents)}
                </span>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-auto">
          <Button
            type="button"
            onClick={handlePickCombo}
            className="w-full"
            size="lg"
            variant={combo.featured ? "default" : "outline"}
            aria-label={`Selecionar combo ${combo.name}`}
          >
            Quero esse combo
          </Button>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Adiciona os serviços à sacola — finalize no WhatsApp quando quiser
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
