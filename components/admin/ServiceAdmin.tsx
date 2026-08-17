"use client";

import { ResourceTable } from "@/components/admin/ResourceTable";
import { createService, updateService, deleteService } from "@/app/admin/servicos/actions";
import { getIcon } from "@/lib/icons";

type Service = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  display_order: number;
  active: boolean;
};

const FIELDS = [
  { name: "name", label: "Nome", type: "text" as const, required: true },
  { name: "slug", label: "Slug (URL)", type: "text" as const, required: true, placeholder: "ex: jingle" },
  { name: "description", label: "Descrição", type: "textarea" as const },
  { name: "icon", label: "Ícone (lucide-react)", type: "text" as const, placeholder: "ex: Music, Globe, Image" },
  { name: "display_order", label: "Ordem", type: "number" as const },
  { name: "active", label: "Ativo", type: "checkbox" as const },
];

export function ServiceAdmin({ items }: { items: Service[] }) {
  return (
    <ResourceTable<typeof FIELDS[number], Service>
      title="Serviços"
      description="Serviços que compõem os combos."
      items={items}
      fields={FIELDS}
      defaults={{ active: true, display_order: 0 }}
      createAction={createService}
      updateAction={updateService}
      deleteAction={deleteService}
      renderRow={(s) => {
        const Icon = getIcon(s.icon);
        return (
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10 text-primary">
              <Icon className="h-4 w-4" aria-hidden />
            </div>
            <div>
              <p className="font-medium">{s.name}</p>
              <p className="text-xs text-muted-foreground">{s.slug}</p>
            </div>
          </div>
        );
      }}
    />
  );
}
