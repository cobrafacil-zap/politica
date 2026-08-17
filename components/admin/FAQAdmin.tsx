"use client";

import { ResourceTable } from "@/components/admin/ResourceTable";
import { createFAQ, updateFAQ, deleteFAQ } from "@/app/admin/faq/actions";

type FAQ = {
  id: string;
  question: string;
  answer: string;
  display_order: number;
  active: boolean;
};

const FIELDS = [
  { name: "question", label: "Pergunta", type: "text" as const, required: true },
  { name: "answer", label: "Resposta", type: "textarea" as const, required: true },
  { name: "display_order", label: "Ordem", type: "number" as const },
  { name: "active", label: "Ativo", type: "checkbox" as const },
];

export function FAQAdmin({ items }: { items: FAQ[] }) {
  return (
    <ResourceTable<typeof FIELDS[number], FAQ>
      title="FAQ"
      description="Perguntas frequentes exibidas na landing page."
      items={items}
      fields={FIELDS}
      defaults={{ active: true, display_order: 0 }}
      createAction={createFAQ}
      updateAction={updateFAQ}
      deleteAction={deleteFAQ}
      renderRow={(f) => (
        <div>
          <p className="font-medium">{f.question}</p>
          <p className="text-xs text-muted-foreground line-clamp-1">{f.answer}</p>
        </div>
      )}
    />
  );
}
