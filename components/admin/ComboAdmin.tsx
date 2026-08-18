"use client";

import { useMemo, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { createCombo, updateCombo, deleteCombo } from "@/app/admin/combos/actions";
import { formatBRL } from "@/lib/format";
import { toast } from "sonner";

type Combo = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  price_cents: number;
  original_price_cents: number | null;
  whatsapp_message: string;
  display_order: number;
  active: boolean;
  featured: boolean;
  badge_text: string | null;
};

type Service = { id: string; name: string };
type ComboService = { combo_id: string; service_id: string };

type Props = {
  combos: Combo[];
  services: Service[];
  comboServices: ComboService[];
};

export function ComboAdmin({ combos, services, comboServices }: Props) {
  const [editing, setEditing] = useState<Combo | null>(null);
  const [creating, setCreating] = useState(false);
  const [pending, startTransition] = useTransition();

  const servicesByCombo = useMemo(() => {
    const m = new Map<string, string[]>();
    for (const cs of comboServices) {
      if (!m.has(cs.combo_id)) m.set(cs.combo_id, []);
      m.get(cs.combo_id)!.push(cs.service_id);
    }
    return m;
  }, [comboServices]);

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const res = editing
        ? await updateCombo(editing.id, formData)
        : await createCombo(formData);
      if (res.error) toast.error(res.error);
      else {
        toast.success(editing ? "Combo atualizado!" : "Combo criado!");
        setEditing(null);
        setCreating(false);
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Excluir este combo?")) return;
    startTransition(async () => {
      const res = await deleteCombo(id);
      if (res.error) toast.error(res.error);
      else toast.success("Excluído!");
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle>Combos</CardTitle>
          <CardDescription>
            Pacotes pré-definidos. Cada combo tem um botão próprio no WhatsApp com mensagem customizada.
            Use <code className="text-xs">{"{{company}}"}</code> e <code className="text-xs">{"{{price}}"}</code> na mensagem.
          </CardDescription>
        </div>
        <Button onClick={() => setCreating(true)} size="sm">
          <Plus className="h-4 w-4" /> Novo combo
        </Button>
      </CardHeader>
      <CardContent>
        {combos.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Nenhum combo ainda.
          </p>
        ) : (
          <ul className="divide-y">
            {combos.map((c) => {
              const sids = servicesByCombo.get(c.id) ?? [];
              return (
                <li key={c.id} className="flex items-center justify-between gap-4 py-4">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{c.name}</p>
                      {c.badge_text && <Badge>{c.badge_text}</Badge>}
                      {!c.active && <Badge variant="secondary">Inativo</Badge>}
                    </div>
                    {c.description && (
                      <p className="text-sm text-muted-foreground">{c.description}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">
                        {formatBRL(c.price_cents)}
                      </span>
                      {c.original_price_cents && (
                        <span className="line-through">
                          {formatBRL(c.original_price_cents)}
                        </span>
                      )}
                      <span>·</span>
                      <span>
                        {sids.length} serviço{sids.length === 1 ? "" : "s"}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => setEditing(c)} aria-label="Editar">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(c.id)} aria-label="Excluir">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {(creating || editing) && (
          <ComboDialog
            combo={editing}
            services={services}
            defaultServiceIds={editing ? servicesByCombo.get(editing.id) ?? [] : []}
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

function ComboDialog({
  combo,
  services,
  defaultServiceIds,
  onSubmit,
  onClose,
  pending,
}: {
  combo: Combo | null;
  services: Service[];
  defaultServiceIds: string[];
  onSubmit: (fd: FormData) => void;
  onClose: () => void;
  pending: boolean;
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set(defaultServiceIds));
  const [priceReais, setPriceReais] = useState(
    combo?.price_cents != null ? (combo.price_cents / 100).toFixed(2).replace(".", ",") : ""
  );
  const [imageUrl, setImageUrl] = useState(combo?.image_url ?? "");

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-lg border bg-background p-6 shadow-lg">
        <h2 className="mb-4 text-lg font-semibold">
          {combo ? "Editar combo" : "Novo combo"}
        </h2>
        <form action={onSubmit} className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1">
              <Label>Nome</Label>
              <Input name="name" defaultValue={combo?.name ?? ""} required />
            </div>
            <div className="space-y-1">
              <Label>Slug</Label>
              <Input name="slug" defaultValue={combo?.slug ?? ""} required placeholder="ex: combo-essencial" />
            </div>
          </div>

          <div className="space-y-1">
            <Label>Descrição</Label>
            <textarea
              name="description"
              defaultValue={combo?.description ?? ""}
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
              <Label>Preço (R$)</Label>
              <Input
                name="price_cents_display"
                value={priceReais}
                onChange={(e) => setPriceReais(e.target.value)}
                placeholder="1499,00"
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
              <Label>Preço original (opcional)</Label>
              <Input
                name="original_price_cents"
                defaultValue={
                  combo?.original_price_cents != null
                    ? (combo.original_price_cents / 100).toFixed(2).replace(".", ",")
                    : ""
                }
                placeholder="1999,00"
              />
            </div>
            <div className="space-y-1">
              <Label>Badge (opcional)</Label>
              <Input name="badge_text" defaultValue={combo?.badge_text ?? ""} placeholder="Mais vendido" />
            </div>
          </div>

          <div className="space-y-1">
            <Label>Mensagem do WhatsApp</Label>
            <textarea
              name="whatsapp_message"
              defaultValue={combo?.whatsapp_message ?? ""}
              rows={3}
              required
              placeholder="Olá! Tenho interesse no {{company}}…"
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Variáveis: <code>{"{{company}}"}</code>, <code>{"{{price}}"}</code>
            </p>
          </div>

          <div className="space-y-1">
            <Label>Serviços inclusos</Label>
            <div className="grid gap-2 rounded-md border p-3 sm:grid-cols-2">
              {services.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Crie serviços primeiro em /admin/servicos.
                </p>
              )}
              {services.map((s) => (
                <label key={s.id} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={selected.has(s.id)}
                    onCheckedChange={() => toggle(s.id)}
                  />
                  {s.name}
                </label>
              ))}
            </div>
          </div>
          <input
            type="hidden"
            name="service_ids_json"
            value={JSON.stringify(Array.from(selected))}
          />

          <div className="grid gap-3 md:grid-cols-3">
            <div className="space-y-1">
              <Label>Ordem</Label>
              <Input
                name="display_order"
                type="number"
                defaultValue={combo?.display_order ?? 0}
              />
            </div>
            <label className="flex items-center gap-2 self-end text-sm">
              <input
                type="checkbox"
                name="active"
                defaultChecked={combo?.active ?? true}
                className="h-4 w-4"
              />
              Ativo
            </label>
            <label className="flex items-center gap-2 self-end text-sm">
              <input
                type="checkbox"
                name="featured"
                defaultChecked={combo?.featured ?? false}
                className="h-4 w-4"
              />
              Destacado
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
