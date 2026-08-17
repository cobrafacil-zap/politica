import { Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WhatsAppButton } from "@/components/landing/WhatsAppButton";
import { formatBRL } from "@/lib/format";
import type { Combo, Service } from "@/lib/supabase/queries";
import { cn } from "@/lib/utils";

type Props = {
  combo: Combo & { services: Service[] };
  whatsappNumber: string | null;
  companyName: string;
};

export function ComboCard({ combo, whatsappNumber, companyName }: Props) {
  const price = formatBRL(combo.price_cents);
  const originalPrice = combo.original_price_cents
    ? formatBRL(combo.original_price_cents)
    : null;

  return (
    <Card
      className={cn(
        "relative flex h-full flex-col",
        combo.featured && "border-primary shadow-lg ring-1 ring-primary"
      )}
    >
      {combo.badge_text && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
          {combo.badge_text}
        </Badge>
      )}
      <CardHeader>
        <CardTitle className="text-2xl">{combo.name}</CardTitle>
        {combo.description && (
          <p className="mt-2 text-sm text-muted-foreground">{combo.description}</p>
        )}
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-4xl font-bold">{price}</span>
          {originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {originalPrice}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        {combo.services.length > 0 && (
          <ul className="mb-6 space-y-2 text-sm">
            {combo.services.map((s) => (
              <li key={s.id} className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                <span>{s.name}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-auto">
          <WhatsAppButton
            number={whatsappNumber}
            message={combo.whatsapp_message}
            vars={{ company: companyName, price }}
            className="w-full"
            size="lg"
            variant={combo.featured ? "default" : "outline"}
            aria-label={`Contratar ${combo.name} via WhatsApp`}
          >
            Contratar agora
          </WhatsAppButton>
        </div>
      </CardContent>
    </Card>
  );
}
