import Image from "next/image";
import { getIcon } from "@/lib/icons";
import type { Step } from "@/lib/supabase/queries";

type Props = { steps: Step[] };

export function HowItWorks({ steps }: Props) {
  if (!steps.length) return null;

  return (
    <section
      id="como-funciona"
      className="relative overflow-hidden bg-foreground py-20 text-background md:py-28"
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-primary bg-foreground px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
            Como funciona
          </span>
          <h2 className="mt-4 font-display text-4xl font-black tracking-tighter md:text-6xl">
            4 passos. Sem enrolação.
          </h2>
          <p className="mt-4 text-lg text-background/70">
            Briefing rápido, proposta clara, produção ágil e resultado na rua.
          </p>
        </div>

        <ol className="mt-16 space-y-20">
          {steps.map((step, idx) => {
            const Icon = getIcon(step.icon);
            const reverse = idx % 2 === 1;
            return (
              <li
                key={step.id}
                className={`grid items-center gap-10 md:grid-cols-2 ${
                  reverse ? "md:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-background/10 bg-background/5 shadow-2xl">
                  {step.image_url ? (
                    <Image
                      src={step.image_url}
                      alt={step.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/30 via-primary/10 to-background/10">
                      <Icon className="h-24 w-24 text-primary/40" aria-hidden />
                    </div>
                  )}
                  <div className="absolute left-4 top-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary font-display text-2xl font-black text-primary-foreground shadow-lg">
                    {step.step_number}
                  </div>
                </div>

                <div className="space-y-4">
                  <span className="font-display text-7xl font-black leading-none text-primary/40 md:text-8xl">
                    0{step.step_number}
                  </span>
                  <h3 className="font-display text-3xl font-black tracking-tight md:text-4xl">
                    {step.title}
                  </h3>
                  <p className="text-lg text-background/80">
                    {step.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}