import { getIcon } from "@/lib/icons";
import type { Step } from "@/lib/supabase/queries";

type Props = { steps: Step[] };

export function HowItWorks({ steps }: Props) {
  if (!steps.length) return null;

  return (
    <section id="como-funciona" className="container py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Como funciona</h2>
        <p className="mt-3 text-muted-foreground">
          Um processo simples e transparente do briefing ao resultado.
        </p>
      </div>

      <ol className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((step) => {
          const Icon = getIcon(step.icon);
          return (
            <li
              key={step.id}
              className="relative rounded-lg border bg-card p-6 text-card-foreground shadow-sm"
            >
              <div className="absolute -top-4 left-6 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                {step.step_number}
              </div>
              <div className="mt-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-5 w-5" aria-hidden />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
