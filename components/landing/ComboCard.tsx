"use client";

import Image from "next/image";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
    itemsTotal > 0 && combo.price_cents < itemsTotal;
  const discountPct = hasDiscount
    ? Math.round(((itemsTotal - combo.price_cents) / itemsTotal) * 100)
    : 0;

  const handlePickCombo = () => {
    setMany(combo.services.map((s) => s.id));
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }, 50);
  };

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-3xl border-2 bg-card transition-all duration-300",
        "hover:-translate-y-1 hover:shadow-2xl",
        combo.featured
          ? "border-foreground shadow-2xl ring-4 ring-primary/20"
          : "border-border"
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        {combo.image_url ? (
          <Image
            src={combo.image_url}
            alt={combo.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/30 to-foreground/30">
            <Sparkles className="h-16 w-16 text-foreground/40" aria-hidden />
          </div>
        )}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/30 to-transparent"
        />

        {combo.badge_text && (
          <Badge className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-lg">
            {combo.badge_text}
          </Badge>
        )}

        {hasDiscount && (
          <Badge className="absolute right-4 top-4 rounded-full bg-foreground px-3 py-1 text-xs font-bold uppercase tracking-wider text-background shadow-lg">
            -{discountPct}%
          </Badge>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-5 p-6">
        <div>
          <h3 className="font-display text-2xl font-black tracking-tight md:text-3xl">
            {combo.name}
          </h3>
          {combo.description && (
            <p className="mt-2 text-sm text-muted-foreground">
              {combo.description}
            </p>
          )}
        </div>

        <div className="flex items-baseline gap-3">
          <span className="font-display text-4xl font-black tracking-tighter md:text-5xl">
            {formatBRL(combo.price_cents)}
          </span>
          {hasDiscount && (
            <span className="text-base text-muted-foreground line-through">
              {formatBRL(itemsTotal)}
            </span>
          )}
        </div>

        {combo.services.length > 0 && (
          <ul className="flex flex-wrap gap-1.5">
            {combo.services.map((s) => (
              <li
                key={s.id}
                className="inline-flex items-center gap-1.5 rounded-full border bg-background px-2.5 py-1 text-xs font-medium"
              >
                <Check
                  className="h-3 w-3 text-primary"
                  aria-hidden
                />
                {s.name}
              </li>
            ))}
          </ul>
        )}

        <button
          type="button"
          onClick={handlePickCombo}
          className={cn(
            "group/btn mt-auto flex h-14 w-full items-center justify-center gap-2 rounded-2xl text-base font-bold uppercase tracking-wider transition-all hover:scale-[1.02]",
            combo.featured
              ? "bg-foreground text-background shadow-xl shadow-foreground/30 hover:bg-primary hover:text-primary-foreground"
              : "border-2 border-foreground bg-background text-foreground hover:bg-foreground hover:text-background"
          )}
          aria-label={`Selecionar combo ${combo.name}`}
        >
          Quero esse combo
          <ArrowRight className="h-5 w-5 transition-transform group-hover/btn:translate-x-1" />
        </button>
      </div>
    </article>
  );
}