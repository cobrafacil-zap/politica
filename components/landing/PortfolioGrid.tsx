import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import type { PortfolioItem } from "@/lib/supabase/queries";

type Props = { items: PortfolioItem[] };

export function PortfolioGrid({ items }: Props) {
  if (!items.length) return null;

  return (
    <section id="portfolio" className="bg-muted/40 py-20">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Cases de sucesso
          </h2>
          <p className="mt-3 text-muted-foreground">
            Resultados reais de campanhas que confiaram na gente.
          </p>
        </div>

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li key={item.id}>
              <Card className="overflow-hidden transition-shadow hover:shadow-md">
                <div className="relative aspect-[4/3] w-full bg-muted">
                  <Image
                    src={item.image_url}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold">{item.title}</h3>
                  {item.client_name && (
                    <p className="text-sm text-muted-foreground">
                      {item.client_name}
                      {item.year ? ` · ${item.year}` : ""}
                    </p>
                  )}
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
