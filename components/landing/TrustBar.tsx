import { Megaphone, MapPin, ThumbsUp } from "lucide-react";

type Props = {
  campaigns: string | null;
  states: string | null;
  satisfaction: string | null;
};

const ITEMS = [
  { key: "campaigns", icon: Megaphone, label: "campanhas atendidas" },
  { key: "states", icon: MapPin, label: "estados pelo Brasil" },
  { key: "satisfaction", icon: ThumbsUp, label: "de satisfação" },
] as const;

export function TrustBar({ campaigns, states, satisfaction }: Props) {
  const map: Record<string, string | null> = { campaigns, states, satisfaction };
  return (
    <section
      aria-label="Nossos números"
      className="relative isolate overflow-hidden bg-foreground py-12 text-background"
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)",
          backgroundSize: "20px 20px",
        }}
      />
      <div className="container grid gap-8 sm:grid-cols-3">
        {ITEMS.map(({ key, icon: Icon, label }) => (
          <div
            key={key}
            className="flex flex-col items-center gap-2 text-center"
          >
            <Icon className="h-6 w-6 text-primary" aria-hidden />
            <p className="font-display text-5xl font-black tracking-tight md:text-6xl">
              {map[key] ?? "—"}
            </p>
            <p className="text-sm uppercase tracking-widest text-background/70">
              {label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}