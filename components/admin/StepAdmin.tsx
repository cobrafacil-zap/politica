"use client";

import { ResourceTable } from "@/components/admin/ResourceTable";
import { createStep, updateStep, deleteStep } from "@/app/admin/como-funciona/actions";
import { getIcon } from "@/lib/icons";

type Step = {
  id: string;
  step_number: number;
  title: string;
  description: string;
  icon: string | null;
  display_order: number;
  active: boolean;
};

const FIELDS = [
  { name: "step_number", label: "Número do passo", type: "number" as const, required: true },
  { name: "title", label: "Título", type: "text" as const, required: true },
  { name: "description", label: "Descrição", type: "textarea" as const, required: true },
  { name: "icon", label: "Ícone (lucide)", type: "text" as const, placeholder: "ex: MessageCircle" },
  { name: "display_order", label: "Ordem", type: "number" as const },
  { name: "active", label: "Ativo", type: "checkbox" as const },
];

export function StepAdmin({ items }: { items: Step[] }) {
  return (
    <ResourceTable<typeof FIELDS[number], Step>
      title="Como funciona"
      description="Passos do processo exibidos na landing."
      items={items}
      fields={FIELDS}
      defaults={{ active: true, display_order: 0, step_number: 1 }}
      createAction={createStep}
      updateAction={updateStep}
      deleteAction={deleteStep}
      renderRow={(s) => {
        const Icon = getIcon(s.icon);
        return (
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
              {s.step_number}
            </div>
            <Icon className="h-4 w-4 text-muted-foreground" aria-hidden />
            <div>
              <p className="font-medium">{s.title}</p>
              <p className="text-xs text-muted-foreground line-clamp-1">{s.description}</p>
            </div>
          </div>
        );
      }}
    />
  );
}
