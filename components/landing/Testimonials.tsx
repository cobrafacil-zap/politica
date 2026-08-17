import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import type { Testimonial } from "@/lib/supabase/queries";

type Props = { items: Testimonial[] };

export function Testimonials({ items }: Props) {
  if (!items.length) return null;

  return (
    <section className="container py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
          O que dizem nossos clientes
        </h2>
      </div>

      <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((t) => (
          <li key={t.id}>
            <Card className="h-full">
              <CardContent className="flex h-full flex-col gap-4 p-6">
                {t.rating ? (
                  <div className="flex gap-0.5" aria-label={`Nota ${t.rating} de 5`}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={
                          i < t.rating!
                            ? "h-4 w-4 fill-yellow-400 text-yellow-400"
                            : "h-4 w-4 text-muted-foreground/30"
                        }
                        aria-hidden
                      />
                    ))}
                  </div>
                ) : null}
                <p className="text-sm leading-relaxed text-foreground">
                  “{t.content}”
                </p>
                <div className="mt-auto">
                  <p className="font-semibold">{t.client_name}</p>
                  {t.role && (
                    <p className="text-sm text-muted-foreground">{t.role}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
}
