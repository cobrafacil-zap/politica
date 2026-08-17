"use client";

import { useState, useTransition } from "react";
import { ResourceTable, type ResourceField } from "@/components/admin/ResourceTable";
import { createService, updateService, deleteService } from "@/app/admin/servicos/actions";
import { getIcon } from "@/lib/icons";
import { formatBRL } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

type Service = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  image_url: string | null;
  display_order: number;
  active: boolean;
  price_cents: number;
  selectable: boolean;
};

export function ServiceAdmin({ items }: { items: Service[] }) {
  const [editing, setEditing] = useState<Service | null>(null);
  const [creating, setCreating] = useState(false);
  const [pending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const res = editing
        ? await updateService(editing.id, formData)
        : await createService(formData);
      if (res.error) toast.error(res.error);
      else {
        toast.success(editing ? "Serviço atualizado!" : "Serviço criado!");
        setEditing(null);
        setCreating(false);
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Excluir este serviço?")) return;
    startTransition(async () => {
      const res = await deleteService(id);
      if (res.error) toast.error(res.error);
      else toast.success("Excluído!");
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Serviços</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Defina o nome, descrição, ícone e preço de cada serviço. Marque "Selecionável" para ele aparecer no cardápio.
          </p>
        </div>
        <Button onClick={() => setCreating(true)} size="sm">
          <Plus className="h-4 w-4" /> Novo
        </Button>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Nenhum serviço ainda.
          </p>
        ) : (
          <ul className="divide-y">
            {items.map((s) => {
              const Icon = getIcon(s.icon);
              return (
                <li key={s.id} className="flex items-center justify-between gap-4 py-3">
                  <div className="flex flex-1 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" aria-hidden />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{s.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatBRL(s.price_cents)} · {s.selectable ? "selecionável" : "só em combo"} · {s.active ? "ativo" : "inativo"}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => setEditing(s)} aria-label="Editar">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(s.id)} aria-label="Excluir">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {(creating || editing) && (
          <ServiceDialog
            service={editing}
            onSubmit={handleSubmit}
            onClose={() => {
              setEditing(null);
              setCreating(false);
            }}
            pending={pending}
          />
        )}
      </CardContent>
    </Card>
  );
}

function ServiceDialog({
  service,
  onSubmit,
  onClose,
  pending,
}: {
  service: Service | null;
  onSubmit: (fd: FormData) => void;
  onClose: () => void;
  pending: boolean;
}) {
  const [priceReais, setPriceReais] = useState(
    service?.price_cents != null ? (service.price_cents / 100).toFixed(2).replace(".", ",") : ""
  );
  const [imageUrl, setImageUrl] = useState(service?.image_url ?? "");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-xl rounded-lg border bg-background p-6 shadow-lg">
        <h2 className="mb-4 text-lg font-semibold">
          {service ? "Editar serviço" : "Novo serviço"}
        </h2>
        <form action={onSubmit} className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1">
              <Label>Nome</Label>
              <Input name="name" defaultValue={service?.name ?? ""} required />
            </div>
            <div className="space-y-1">
              <Label>Slug (URL)</Label>
              <Input name="slug" defaultValue={service?.slug ?? ""} required placeholder="ex: jingle" />
            </div>
          </div>

          <div className="space-y-1">
            <Label>Descrição</Label>
            <textarea
              name="description"
              defaultValue={service?.description ?? ""}
              rows={2}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>

          <ImageUploadField
            value={imageUrl}
            onChange={setImageUrl}
            label="Imagem de capa"
          />
          <input type="hidden" name="image_url" value={imageUrl} />

          <div className="grid gap-3 md:grid-cols-3">
            <div className="space-y-1">
              <Label>Ícone (lucide)</Label>
              <Input name="icon" defaultValue={service?.icon ?? ""} placeholder="Music, Globe…" />
            </div>
            <div className="space-y-1">
              <Label>Preço (R$)</Label>
              <Input
                value={priceReais}
                onChange={(e) => setPriceReais(e.target.value)}
                placeholder="800,00"
                required
              />
              <input
                type="hidden"
                name="price_cents"
                value={Math.round(
                  Number(priceReais.replace(/\./g, "").replace(",", ".") || 0) * 100
                )}
              />
            </div>
            <div className="space-y-1">
              <Label>Ordem</Label>
              <Input
                name="display_order"
                type="number"
                defaultValue={service?.display_order ?? 0}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-1">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="selectable"
                defaultChecked={service?.selectable ?? true}
                className="h-4 w-4"
              />
              Selecionável individualmente (aparece no cardápio)
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="active"
                defaultChecked={service?.active ?? true}
                className="h-4 w-4"
              />
              Ativo
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={pending}>
              Cancelar
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Salvando…" : "Salvar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
