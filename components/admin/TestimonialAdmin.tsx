"use client";

import { ResourceTable } from "@/components/admin/ResourceTable";
import {
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "@/app/admin/depoimentos/actions";
import { Star } from "lucide-react";

type Testimonial = {
  id: string;
  client_name: string;
  role: string | null;
  content: string;
  avatar_url: string | null;
  rating: number | null;
  display_order: number;
  active: boolean;
};

const FIELDS = [
  { name: "client_name", label: "Nome do cliente", type: "text" as const, required: true },
  { name: "role", label: "Cargo / Função", type: "text" as const, placeholder: "ex: Vereador, Prefeito" },
  { name: "content", label: "Depoimento", type: "textarea" as const, required: true },
  { name: "avatar_url", label: "URL do avatar (opcional)", type: "url" as const },
  { name: "rating", label: "Nota (1-5)", type: "number" as const },
  { name: "display_order", label: "Ordem", type: "number" as const },
  { name: "active", label: "Ativo", type: "checkbox" as const },
];

export function TestimonialAdmin({ items }: { items: Testimonial[] }) {
  return (
    <ResourceTable<typeof FIELDS[number], Testimonial>
      title="Depoimentos"
      description="Depoimentos de clientes exibidos na landing."
      items={items}
      fields={FIELDS}
      defaults={{ active: true, display_order: 0 }}
      createAction={createTestimonial}
      updateAction={updateTestimonial}
      deleteAction={deleteTestimonial}
      renderRow={(t) => (
        <div>
          <p className="font-medium">
            {t.client_name}
            {t.role && <span className="text-xs text-muted-foreground"> · {t.role}</span>}
          </p>
          <p className="text-xs text-muted-foreground line-clamp-1">“{t.content}”</p>
          {t.rating && (
            <div className="mt-1 flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={i < t.rating! ? "h-3 w-3 fill-yellow-400 text-yellow-400" : "h-3 w-3 text-muted-foreground/30"}
                  aria-hidden
                />
              ))}
            </div>
          )}
        </div>
      )}
    />
  );
}
