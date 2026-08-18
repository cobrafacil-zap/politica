"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Wrench,
  Package,
  Image as ImageIcon,
  Star,
  HelpCircle,
  ListOrdered,
  Settings,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "@/app/(auth)/login/actions";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/servicos", label: "Serviços", icon: Wrench },
  { href: "/admin/combos", label: "Combos", icon: Package },
  { href: "/admin/portfolio", label: "Portfólio", icon: ImageIcon },
  { href: "/admin/depoimentos", label: "Depoimentos", icon: Star },
  { href: "/admin/faq", label: "FAQ", icon: HelpCircle },
  { href: "/admin/como-funciona", label: "Como funciona", icon: ListOrdered },
  { href: "/admin/configuracoes", label: "Configurações", icon: Settings },
];

export function Sidebar({ email }: { email: string }) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 border-r bg-background md:block">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/admin" className="text-sm font-semibold">
          Social Marketing
        </Link>
      </div>

      <nav aria-label="Navegação admin" className="flex h-[calc(100vh-4rem)] flex-col justify-between p-3">
        <ul className="space-y-1">
          {NAV.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" aria-hidden />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="space-y-2 border-t pt-3">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <ExternalLink className="h-4 w-4" aria-hidden />
            Ver site
          </Link>
          <form action={signOut}>
            <button
              type="submit"
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <LogOut className="h-4 w-4" aria-hidden />
              Sair ({email})
            </button>
          </form>
        </div>
      </nav>
    </aside>
  );
}
