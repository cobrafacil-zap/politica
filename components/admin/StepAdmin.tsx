"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { createStep, updateStep, deleteStep } from "@/app/admin/como-funciona/actions";
import { getIcon } from "@/lib/icons";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

type Step = {
  id: string;
  step_number: number;
  title: string;
  description: string;
  icon: string | null;
  image_url: string | null;
  display_order: number;
  active: boolean;
};

export function StepAdmin({ items }: { items: Step[] }) {
  const [editing, setEditing] = useState<Step | null>(null);
  const [creating, setCreating] = useState(false);
  const [pending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const res = editing
        ? await updateStep(editing.id, formData)
        : await createStep(formData);
      if (res.error) toast.error(res.error);
      else {
        toast.success(editing ? "Passo atualizado!" : "Passo criado!");
        setEditing(null);
        setCreating(false);
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Excluir este passo?")) return;
    startTransition(async () => {
      const res = await deleteStep(id);
      if (res.error) toast.error(res.error);
      else toast.success("Excluído!");
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Como funciona</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Passos do processo exibidos na landing. Faça upload de uma imagem para cada passo.
          </p>
        </div>
        <Button onClick={() => setCreating(true)} size="sm">
          <Plus className="h-4 w-4" /> Novo
        </Button>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Nenhum passo ainda.
          </p>
        ) : (
          <ul className="divide-y">
            {items.map((s) => {
              const Icon = getIcon(s.icon);
              return (
                <li key={s.id} className="flex items-center justify-between gap-4 py-3">
                  <div className="flex flex-1 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                      {s.step_number}
                    </div>
                    {s.image_url ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={s.image_url}
                        alt=""
                        className="h-10 w-10 shrink-0 rounded object-cover"
                      />
                    ) : (
                      <Icon className="h-5 w-5 text-muted-foreground" aria-hidden />
                    )}
                    <div className="flex-1">
                      <p className="font-medium">{s.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {s.description}
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
          <StepDialog
            step={editing}
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

function StepDialog({
  step,
  onSubmit,
  onClose,
  pending,
}: {
  step: Step | null;
  onSubmit: (fd: FormData) => void;
  onClose: () => void;
  pending: boolean;
}) {
  const [imageUrl, setImageUrl] = useState(step?.image_url ?? "");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-xl rounded-lg border bg-background p-6 shadow-lg">
        <h2 className="mb-4 text-lg font-semibold">
          {step ? "Editar passo" : "Novo passo"}
        </h2>
        <form action={onSubmit} className="space-y-3">
          <div className="grid gap-3 md:grid-cols-3">
            <div className="space-y-1">
              <Label>Número do passo</Label>
              <Input
                name="step_number"
                type="number"
                min={1}
                defaultValue={step?.step_number ?? 1}
                required
              />
            </div>
            <div className="space-y-1 md:col-span-2">
              <Label>Título</Label>
              <Input name="title" defaultValue={step?.title ?? ""} required />
            </div>
          </div>

          <div className="space-y-1">
            <Label>Descrição</Label>
            <textarea
              name="description"
              defaultValue={step?.description ?? ""}
              rows={3}
              required
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>

          <ImageUploadField
            value={imageUrl}
            onChange={setImageUrl}
            label="Imagem do passo"
          />
          <input type="hidden" name="image_url" value={imageUrl} />

          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1">
              <Label>Ícone (lucide)</Label>
              <Input
                name="icon"
                defaultValue={step?.icon ?? ""}
                placeholder="ex: MessageCircle"
              />
            </div>
            <div className="space-y-1">
              <Label>Ordem</Label>
              <Input
                name="display_order"
                type="number"
                defaultValue={step?.display_order ?? 0}
              />
            </div>
          </div>

          <div className="flex items-center gap-4 pt-1">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="active"
                defaultChecked={step?.active ?? true}
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
