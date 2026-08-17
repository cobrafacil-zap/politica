import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { Megaphone, Package, Wrench, Image as ImageIcon, Star, HelpCircle, ListOrdered } from "lucide-react";

const QUICK = [
  { href: "/admin/servicos", label: "Serviços", icon: Wrench },
  { href: "/admin/combos", label: "Combos", icon: Package },
  { href: "/admin/portfolio", label: "Portfólio", icon: ImageIcon },
  { href: "/admin/depoimentos", label: "Depoimentos", icon: Star },
  { href: "/admin/faq", label: "FAQ", icon: HelpCircle },
  { href: "/admin/como-funciona", label: "Como funciona", icon: ListOrdered },
];

export default async function DashboardPage() {
  const supabase = createClient();
  const [s, c, p, t, f, st] = await Promise.all([
    supabase.from("services").select("*", { count: "exact", head: true }),
    supabase.from("combos").select("*", { count: "exact", head: true }),
    supabase.from("portfolio_items").select("*", { count: "exact", head: true }),
    supabase.from("testimonials").select("*", { count: "exact", head: true }),
    supabase.from("faqs").select("*", { count: "exact", head: true }),
    supabase.from("how_it_works_steps").select("*", { count: "exact", head: true }),
  ]);

  const stats = [
    { label: "Serviços", value: s.count ?? 0 },
    { label: "Combos", value: c.count ?? 0 },
    { label: "Portfólio", value: p.count ?? 0 },
    { label: "Depoimentos", value: t.count ?? 0 },
    { label: "FAQ", value: f.count ?? 0 },
    { label: "Passos", value: st.count ?? 0 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2">
        <Megaphone className="h-6 w-6 text-primary" aria-hidden />
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader className="pb-2">
              <CardDescription>{s.label}</CardDescription>
              <CardTitle className="text-3xl">{s.value}</CardTitle>
            </CardHeader>
            <CardContent />
          </Card>
        ))}
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold text-muted-foreground">Atalhos</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {QUICK.map((q) => {
            const Icon = q.icon;
            return (
              <Link
                key={q.href}
                href={q.href}
                className="flex items-center gap-3 rounded-lg border bg-card p-4 text-sm font-medium transition-colors hover:bg-accent"
              >
                <Icon className="h-4 w-4 text-primary" aria-hidden />
                {q.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
