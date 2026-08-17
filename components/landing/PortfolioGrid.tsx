import Image from "next/image";
import { ImageIcon } from "lucide-react";
import type { PortfolioItem } from "@/lib/supabase/queries";

type Props = { items: PortfolioItem[] };

export function PortfolioGrid({ items }: Props) {
  if (!items.length) return null;

  return (
    <section id="portfolio" className="bg-background py-20 md:py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-foreground bg-background px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-foreground">
            <ImageIcon className="h-3 w-3" /> Portfólio
          </span>
          <h2 className="mt-4 font-display text-4xl font-black tracking-tighter md:text-6xl">
            Cases reais. Resultado na rua.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Campanhas que confiaram na gente e colheram voto.
          </p>
        </div>

        {/* Mosaico editorial: primeiro item ocupa 2 colunas + 2 linhas */}
        <ul className="mt-14 grid auto-rows-[200px] grid-cols-2 gap-3 sm:grid-cols-3 md:auto-rows-[220px] md:gap-4 lg:grid-cols-4">
          {items.map((item, idx) => {
            const isFirst = idx === 0;
            return (
              <li
                key={item.id}
                className={
                  isFirst
                    ? "col-span-2 row-span-2 sm:col-span-2 sm:row-span-2"
                    : ""
                }
              >
                <div className="group relative h-full w-full overflow-hidden rounded-2xl bg-muted">
                  <Image
                    src={item.image_url}
                    alt={item.title}
                    fill
                    sizes={
                      isFirst
                        ? "(max-width: 768px) 100vw, 50vw"
                        : "(max-width: 768px) 50vw, 25vw"
                    }
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 transition-opacity group-hover:opacity-100"
                  />

                  {item.category && (
                    <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary-foreground">
                      {item.category}
                    </span>
                  )}

                  <div className="absolute inset-x-0 bottom-0 translate-y-2 p-4 text-background opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                    <h3 className="font-display text-lg font-bold leading-tight">
                      {item.title}
                    </h3>
                    {item.client_name && (
                      <p className="text-xs text-background/80">
                        {item.client_name}
                        {item.year ? ` · ${item.year}` : ""}
                      </p>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}