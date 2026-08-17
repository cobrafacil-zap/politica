import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getIcon } from "@/lib/icons";
import type { Service } from "@/lib/supabase/queries";

type Props = { services: Service[] };

export function ServicesGrid({ services }: Props) {
  if (!services.length) return null;

  return (
    <section id="servicos" className="container py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Nossos serviços</h2>
        <p className="mt-3 text-muted-foreground">
          Tudo o que sua campanha precisa para se comunicar bem e crescer.
        </p>
      </div>

      <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => {
          const Icon = getIcon(service.icon);
          return (
            <li key={service.id}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <CardTitle className="mt-4 text-xl">{service.name}</CardTitle>
                </CardHeader>
                {service.description && (
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed">
                      {service.description}
                    </CardDescription>
                  </CardContent>
                )}
              </Card>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
