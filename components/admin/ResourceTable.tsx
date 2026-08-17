"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export type ResourceField = {
  name: string;
  label: string;
  type: "text" | "textarea" | "number" | "url" | "checkbox";
  placeholder?: string;
  required?: boolean;
};

export type ResourceItem = {
  id: string;
  [key: string]: unknown;
};

type Props<F extends ResourceField, I extends ResourceItem> = {
  title: string;
  description?: string;
  items: I[];
  fields: F[];
  defaults?: Partial<I>;
  createAction: (formData: FormData) => Promise<{ error?: string; ok?: boolean }>;
  updateAction: (id: string, formData: FormData) => Promise<{ error?: string; ok?: boolean }>;
  deleteAction: (id: string) => Promise<{ error?: string; ok?: boolean }>;
  renderRow?: (item: I) => React.ReactNode;
};

export function ResourceTable<F extends ResourceField, I extends ResourceItem>({
  title,
  description,
  items,
  fields,
  defaults,
  createAction,
  updateAction,
  deleteAction,
  renderRow,
}: Props<F, I>) {
  const [editing, setEditing] = useState<I | null>(null);
  const [creating, setCreating] = useState(false);
  const [pending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const res = editing
        ? await updateAction(editing.id, formData)
        : await createAction(formData);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(editing ? "Atualizado!" : "Criado!");
        setEditing(null);
        setCreating(false);
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Tem certeza que deseja excluir?")) return;
    startTransition(async () => {
      const res = await deleteAction(id);
      if (res.error) toast.error(res.error);
      else toast.success("Excluído!");
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>{title}</CardTitle>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        <Button onClick={() => setCreating(true)} size="sm">
          <Plus className="h-4 w-4" /> Novo
        </Button>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Nenhum item ainda. Clique em “Novo” para começar.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                {renderRow ? (
                  <TableHead>Item</TableHead>
                ) : (
                  fields.map((f) => <TableHead key={f.name}>{f.label}</TableHead>)
                )}
                <TableHead className="w-32 text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {renderRow ? renderRow(item) : fields.map((f) => (
                      <div key={f.name} className="text-sm">
                        {String(item[f.name] ?? "—")}
                      </div>
                    ))}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditing(item)}
                        aria-label="Editar"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(item.id)}
                        aria-label="Excluir"
                        disabled={pending}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {(creating || editing) && (
          <ResourceDialog
            title={editing ? "Editar item" : "Novo item"}
            fields={fields}
            defaultValues={editing ?? defaults}
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

function ResourceDialog({
  title,
  fields,
  defaultValues,
  onSubmit,
  onClose,
  pending,
}: {
  title: string;
  fields: ResourceField[];
  defaultValues?: Record<string, unknown>;
  onSubmit: (fd: FormData) => void;
  onClose: () => void;
  pending: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-lg border bg-background p-6 shadow-lg">
        <h2 className="mb-4 text-lg font-semibold">{title}</h2>
        <form
          action={onSubmit}
          className="space-y-3"
        >
          {fields.map((f) => {
            const value = (defaultValues?.[f.name] ?? "") as string | number;
            if (f.type === "checkbox") {
              return (
                <label key={f.name} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    name={f.name}
                    defaultChecked={Boolean(defaultValues?.[f.name])}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  {f.label}
                </label>
              );
            }
            if (f.type === "textarea") {
              return (
                <div key={f.name} className="space-y-1">
                  <label className="text-sm font-medium">{f.label}</label>
                  <textarea
                    name={f.name}
                    defaultValue={String(value ?? "")}
                    placeholder={f.placeholder}
                    required={f.required}
                    rows={3}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>
              );
            }
            return (
              <div key={f.name} className="space-y-1">
                <label className="text-sm font-medium">{f.label}</label>
                <input
                  type={f.type}
                  name={f.name}
                  defaultValue={String(value ?? "")}
                  placeholder={f.placeholder}
                  required={f.required}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
            );
          })}
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
